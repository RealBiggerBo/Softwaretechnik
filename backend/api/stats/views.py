import json, csv, io, base64
from urllib.parse import quote
from typing import Any, Dict, List, Optional, Tuple

from django.utils.text import slugify
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .utils import (
    build_id_to_field_maps,
    filter_records_for,
    compute_count_output,
    compute_count_categorized_output,
    compute_average_output,
    compute_max_output,
    id_to_field,
    collect_ids_from_query,
    validate_ids_for_record,
)

ALLOWED_RECORD_TYPES = {"Anfrage", "Fall"}

# ----- Hilfsfunktionen -----

def _b64_urlsafe_encode(s: str) -> str:
    return base64.urlsafe_b64encode(s.encode("utf-8")).decode("ascii").rstrip("=")

def _b64_urlsafe_decode(s: str) -> str:
    padding = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode((s + padding).encode("ascii")).decode("utf-8")

def get_ci(d: Dict[str, Any], name: str, default: Any = None) -> Any:
    """
    Case-insensitive Zugriff: Holt d[name], unabhängig von Groß-/Kleinschreibung.
    Canonical ist camelCase (z. B. 'globalFilterOptions', 'queries').
    """
    if not isinstance(d, dict):
        return default
    lname = name.lower()
    for k, v in d.items():
        if isinstance(k, str) and k.lower() == lname:
            return v
    return default

def _rows_from_results(results: List[Dict[str, Any]]) -> List[List[Any]]:
    """
    Baut Tabellenzeilen aus den berechneten Ergebnissen.
    Erwartet camelCase-Schlüssel in results:
      - queryTitle
      - outputs: [{ displayAction, displayActionTitle, output }]
      - output kann Dict oder Skalar sein
    """
    rows: List[List[Any]] = []
    for query in results:
        qt = get_ci(query, "queryTitle", "")
        rt = get_ci(query, "recordType", "")
        for output_entry in get_ci(query, "outputs", []) or []:
            da = get_ci(output_entry, "displayAction", "")
            dat = get_ci(output_entry, "displayActionTitle", "")
            out = get_ci(output_entry, "output", {})
            if isinstance(out, dict):
                for key, value in out.items():
                    rows.append([qt, da, dat, key, value])
            else:
                rows.append([qt, da, dat, "", out])
    return rows

def _normalize_format(fileformat: str) -> Optional[str]:
    f = (fileformat or "").strip().lower()
    if f in ("csv",):
        return "csv"
    if f in ("xlsx", "xls", "xlsl"):  # 'xlsl' tolerierter Alias
        return "xlsx"
    if f in ("pdf",):
        return "pdf"
    return None

def _build_download_link_by_title(preset_title: str, fmt: str) -> Tuple[str, str]:
    # Link mit preset_title (Server lädt Preset beim GET)
    filename = f"{slugify(preset_title)}.{fmt}"
    encoded_title = quote(preset_title)
    download_url = f"/api/stats/presets/export/{fmt.upper()}?preset_title={encoded_title}"
    return download_url, filename

# ----- Statistik-JSON -----

@csrf_exempt
@require_http_methods(["POST"])
def stats_execute(request: HttpRequest):
    """
    Führt Statistik-Berechnungen aus und liefert die Ergebnisse als JSON.
    Canonical Felder (camelCase), case-insensitive akzeptiert:
      Top-Level: globalRecordType, globalFilterOptions, queries
      Query: queryTitle, recordType, displayActions, filterOptions
      Action: displayActionTitle, type, fieldId
    Rückgabe: Liste mit Einträgen { queryTitle, outputs: [{ displayAction, displayActionTitle, output }] }
    """
    try:
        payload: Dict[str, Any] = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    global_filters: List[Dict[str, Any]] = (
        get_ci(payload, "globalFilterOptions", []) or get_ci(payload, "GlobalFilterOptions", []) or []
    )
    queries: List[Dict[str, Any]] = (
        get_ci(payload, "queries", []) or get_ci(payload, "Queries", []) or []
    )
    global_record_type: Optional[str] = (
        get_ci(payload, "globalRecordType") or payload.get("globalRecordType")
    )

    if global_record_type is not None and global_record_type not in ALLOWED_RECORD_TYPES:
        return JsonResponse({"error": f"Ungültiger globalRecordType '{global_record_type}'."}, status=400)

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    for q in queries:
        query_title = get_ci(q, "queryTitle") or q.get("QueryTitle", "")
        actions = get_ci(q, "displayActions", []) or q.get("displayActions", [])
        qfilters = get_ci(q, "filterOptions", []) or q.get("filterOptions", [])
        record_type: Optional[str] = get_ci(q, "recordType") or q.get("recordType") or global_record_type

        if not record_type:
            return JsonResponse({"error": f"Query '{query_title}': recordType oder globalRecordType ist erforderlich."}, status=400)
        if record_type not in ALLOWED_RECORD_TYPES:
            return JsonResponse({"error": f"Query '{query_title}': Ungültiger recordType '{record_type}'."}, status=400)

        ids_for_query = collect_ids_from_query(q)
        msg = validate_ids_for_record(ids_for_query, record_type, maps)
        if msg:
            return JsonResponse({"error": f"Query '{query_title}': {msg}"}, status=400)

        record_global_filters = [
            gf for gf in global_filters
            if isinstance(get_ci(gf, "id"), int) and id_to_field(record_type, get_ci(gf, "id"), maps)
        ]

        recs = filter_records_for(record_type, record_global_filters, qfilters, maps)

        outputs: List[Dict[str, Any]] = []
        for act in actions:
            atype = get_ci(act, "type") or act.get("type")
            fid = get_ci(act, "fieldId") or act.get("fieldId")
            title = get_ci(act, "displayActionTitle") or act.get("DisplayActionTitle", "")

            if atype == "CountCategorized":
                out_obj = compute_count_categorized_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "CountCategorized", "displayActionTitle": title, "output": out_obj})
            elif atype == "Count":
                out_obj = compute_count_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "Count", "displayActionTitle": title, "output": out_obj})
            elif atype == "Average":
                out_obj = compute_average_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "Average", "displayActionTitle": title, "output": out_obj})
            elif atype == "Max":
                out_obj = compute_max_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "Max", "displayActionTitle": title, "output": out_obj})
            else:
                outputs.append({"displayAction": str(atype), "displayActionTitle": title, "output": {}})

        results.append({"queryTitle": query_title, "outputs": outputs})

    return JsonResponse(results, safe=False, status=200)

# ----- Export über statische URL /presets/export/<FORMAT> -----

@csrf_exempt
@require_http_methods(["POST", "GET"])
def presets_export_file(request: HttpRequest, fileformat: str):
    """
    Statischer Export per PresetTitle:
    - POST /api/stats/presets/export/<FORMAT> → JSON mit download_url + filename (FORMAT: CSV/XLSX/PDF)
      Body akzeptiert case-insensitive: presetTitle/title/PresetTitle
    - GET  /api/stats/presets/export/<FORMAT>?preset_title=... → Datei streamen (FORMAT bestimmt)
    - GET  /api/stats/presets/export/<FORMAT>?payload_b64=... → Datei streamen basierend auf Payload-Snapshot
    """
    fmt = _normalize_format(fileformat)
    if fmt is None:
        return HttpResponse("Ungültiges Format. Erlaubt: CSV, XLSX, PDF", status=400, content_type="text/plain")

    # POST → Link per PresetTitle zurückgeben
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        preset_title = (
            get_ci(body, "presetTitle") or get_ci(body, "title") or get_ci(body, "PresetTitle")
        )
        if not isinstance(preset_title, str) or not preset_title.strip():
            return JsonResponse({"error": "presetTitle ist erforderlich."}, status=400)

        url, filename = _build_download_link_by_title(preset_title.strip(), fmt)
        return JsonResponse({"download_url": url, "filename": filename}, status=200)

    # GET → Datei streamen (entweder aus preset_title oder payload_b64)
    payload: Optional[Dict[str, Any]] = None
    preset_title = request.GET.get("preset_title")
    payload_b64 = request.GET.get("payload_b64")

    if payload_b64:
        try:
            payload_json = _b64_urlsafe_decode(payload_b64)
            payload = json.loads(payload_json)
        except Exception:
            return HttpResponse("Ungültiges payload_b64.", status=400, content_type="text/plain")
    elif preset_title:
        try:
            from .models import StatsPreset
            p = StatsPreset.objects.get(title=preset_title)
            payload = p.payload
            if not isinstance(payload, dict):
                return HttpResponse("Preset payload ist ungültig.", status=400, content_type="text/plain")
        except StatsPreset.DoesNotExist:
            return HttpResponse("Preset nicht gefunden.", status=404, content_type="text/plain")
        except Exception:
            return HttpResponse("Fehler beim Laden des Presets.", status=500, content_type="text/plain")
    else:
        return HttpResponse("Erforderlich: preset_title oder payload_b64.", status=400, content_type="text/plain")

    # Berechnungslogik (analog stats_execute) mit camelCase + tolerantem Lesen
    global_filters: List[Dict[str, Any]] = (
        get_ci(payload, "globalFilterOptions", []) or get_ci(payload, "GlobalFilterOptions", []) or []
    )
    queries: List[Dict[str, Any]] = (
        get_ci(payload, "queries", []) or get_ci(payload, "Queries", []) or []
    )
    global_record_type: Optional[str] = (
        get_ci(payload, "globalRecordType") or payload.get("globalRecordType")
    )

    if global_record_type is not None and global_record_type not in ALLOWED_RECORD_TYPES:
        return HttpResponse(f"Ungültiger globalRecordType '{global_record_type}'.", status=400, content_type="text/plain")

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    for q in queries:
        query_title = get_ci(q, "queryTitle") or q.get("QueryTitle", "")
        actions = get_ci(q, "displayActions", []) or q.get("displayActions", [])
        qfilters = get_ci(q, "filterOptions", []) or q.get("filterOptions", [])
        record_type: Optional[str] = get_ci(q, "recordType") or q.get("recordType") or global_record_type

        if not record_type:
            return HttpResponse(f"Query '{query_title}': recordType oder globalRecordType ist erforderlich.", status=400, content_type="text/plain")
        if record_type not in ALLOWED_RECORD_TYPES:
            return HttpResponse(f"Query '{query_title}': Ungültiger recordType '{record_type}'.", status=400, content_type="text/plain")

        ids_for_query = collect_ids_from_query(q)
        msg = validate_ids_for_record(ids_for_query, record_type, maps)
        if msg:
            return HttpResponse(f"Query '{query_title}': {msg}", status=400, content_type="text/plain")

        record_global_filters = [
            gf for gf in global_filters
            if isinstance(get_ci(gf, "id"), int) and id_to_field(record_type, get_ci(gf, "id"), maps)
        ]

        recs = filter_records_for(record_type, record_global_filters, qfilters, maps)

        outputs: List[Dict[str, Any]] = []
        for act in actions:
            atype = get_ci(act, "type") or act.get("type")
            fid = get_ci(act, "fieldId") or act.get("fieldId")
            title = get_ci(act, "displayActionTitle") or act.get("DisplayActionTitle", "")

            if atype == "CountCategorized":
                out_obj = compute_count_categorized_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "CountCategorized", "displayActionTitle": title, "output": out_obj})
            elif atype == "Count":
                out_obj = compute_count_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "Count", "displayActionTitle": title, "output": out_obj})
            elif atype == "Average":
                out_obj = compute_average_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "Average", "displayActionTitle": title, "output": out_obj})
            elif atype == "Max":
                out_obj = compute_max_output(recs, record_type, fid, maps)
                outputs.append({"displayAction": "Max", "displayActionTitle": title, "output": out_obj})
            else:
                outputs.append({"displayAction": str(atype), "displayActionTitle": title, "output": {}})

        results.append({"queryTitle": query_title, "recordType": record_type, "outputs": outputs})

    # Ausgabe nach Format (camelCase Header)
    header = ["queryTitle", "recordType", "displayAction", "displayActionTitle", "key", "value"]
    rows = _rows_from_results(results)

    title = get_ci(payload, "title") or get_ci(payload, "presetTitle") or preset_title or "statistik"
    filename = f"{slugify(title)}.{fmt}"

    if fmt == "xlsx":
        try:
            from openpyxl import Workbook
        except ImportError:
            return HttpResponse("Excel-Export benötigt 'openpyxl'. Bitte installieren: pip install openpyxl", status=500, content_type="text/plain")

        wb = Workbook()
        ws = wb.active
        ws.title = "Statistik"
        ws.append(header)
        for row in rows:
            ws.append(row)

        bio = io.BytesIO()
        wb.save(bio)
        bio.seek(0)

        resp = HttpResponse(bio.getvalue(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        resp["Content-Disposition"] = f'attachment; filename="{filename}"'
        return resp

    if fmt == "pdf":
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib import colors
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
        except ImportError:
            return HttpResponse("PDF-Export benötigt 'reportlab'. Bitte installieren: pip install reportlab", status=500, content_type="text/plain")

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        data = [header] + rows
        table = Table(data)
        style = TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.black),
            ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ])
        table.setStyle(style)
        doc.build([table])
        pdf_bytes = buffer.getvalue()
        buffer.close()

        resp = HttpResponse(pdf_bytes, content_type="application/pdf")
        resp["Content-Disposition"] = f'attachment; filename="{filename}"'
        return resp

    # CSV (Default)
    output = io.StringIO()
    writer = csv.writer(output, delimiter=";")
    writer.writerow(header)
    writer.writerows(rows)

    resp = HttpResponse(output.getvalue(), content_type="text/csv")
    resp["Content-Disposition"] = f'attachment; filename="{filename}"'
    return resp