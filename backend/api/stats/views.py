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

def _rows_from_results(results: List[Dict[str, Any]]) -> List[List[Any]]:
    rows: List[List[Any]] = []
    for query in results:
        qt = query.get("QueryTitle", "")
        for output_entry in query.get("Outputs", []):
            da = output_entry.get("DisplayAction", "")
            dat = output_entry.get("DisplayActionTitle", "")
            out = output_entry.get("Output", {})
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
    if f in ("xlsx", "xls", "xlsl"):  # 'xlsl' als tolerierter Alias
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

# ----- Bestehende Statistik-JSON -----

@csrf_exempt
@require_http_methods(["POST"])
def stats_execute(request: HttpRequest):
    """
    Führt Statistik-Berechnungen aus und liefert die Ergebnisse als JSON.
    """
    try:
        payload: Dict[str, Any] = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    global_filters: List[Dict[str, Any]] = payload.get("GlobalFilterOptions", [])
    queries: List[Dict[str, Any]] = payload.get("Queries", [])
    global_record_type: Optional[str] = payload.get("globalRecordType")

    if global_record_type is not None and global_record_type not in ALLOWED_RECORD_TYPES:
        return JsonResponse({"error": f"Ungültiger globalRecordType '{global_record_type}'."}, status=400)

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    for q in queries:
        qtitle = q.get("QueryTitle", "")
        actions = q.get("displayActions", [])
        qfilters = q.get("filterOptions", [])
        record_type: Optional[str] = q.get("recordType") or global_record_type

        if not record_type:
            return JsonResponse({"error": f"Query '{qtitle}': recordType oder globalRecordType ist erforderlich."}, status=400)
        if record_type not in ALLOWED_RECORD_TYPES:
            return JsonResponse({"error": f"Query '{qtitle}': Ungültiger recordType '{record_type}'."}, status=400)

        ids_for_query = collect_ids_from_query(q)
        msg = validate_ids_for_record(ids_for_query, record_type, maps)
        if msg:
            return JsonResponse({"error": f"Query '{qtitle}': {msg}"}, status=400)

        record_global_filters = [
            gf for gf in global_filters
            if isinstance(gf.get("id"), int) and id_to_field(record_type, gf["id"], maps)
        ]

        recs = filter_records_for(record_type, record_global_filters, qfilters, maps)

        outputs: List[Dict[str, Any]] = []
        for act in actions:
            atype = act.get("type")
            fid = act.get("fieldId")
            title = act.get("DisplayActionTitle", "")

            if atype == "CountCategorized":
                out_obj = compute_count_categorized_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "CountCategorized", "DisplayActionTitle": title, "Output": out_obj})
            elif atype == "Count":
                out_obj = compute_count_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "Count", "DisplayActionTitle": title, "Output": out_obj})
            elif atype == "Average":
                out_obj = compute_average_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "Average", "DisplayActionTitle": title, "Output": out_obj})
            elif atype == "Max":
                out_obj = compute_max_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "Max", "DisplayActionTitle": title, "Output": out_obj})
            else:
                outputs.append({"DisplayAction": str(atype), "DisplayActionTitle": title, "Output": {}})

        results.append({"QueryTitle": qtitle, "Outputs": outputs})

    return JsonResponse(results, safe=False, status=200)

# ----- NEU: Export über statische URL /presets/export/<FORMAT> -----

@csrf_exempt
@require_http_methods(["POST", "GET"])
def presets_export_file(request: HttpRequest, fileformat: str):
    """
    Statischer Export per PresetTitle:
    - POST /api/stats/presets/export/<FORMAT> → JSON mit download_url + filename (FORMAT: CSV/XLSX/PDF)
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

        preset_title = body.get("PresetTitle") or body.get("title")
        if not isinstance(preset_title, str) or not preset_title.strip():
            return JsonResponse({"error": "PresetTitle ist erforderlich."}, status=400)

        # Link, der per GET das Preset lädt
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
        except Exception:
            return HttpResponse("Preset nicht gefunden.", status=404, content_type="text/plain")
    else:
        return HttpResponse("Erforderlich: preset_title oder payload_b64.", status=400, content_type="text/plain")

    # Berechnungslogik (analog stats_execute)
    global_filters: List[Dict[str, Any]] = payload.get("GlobalFilterOptions", [])
    queries: List[Dict[str, Any]] = payload.get("Queries", [])
    global_record_type: Optional[str] = payload.get("globalRecordType")

    if global_record_type is not None and global_record_type not in ALLOWED_RECORD_TYPES:
        return HttpResponse(f"Ungültiger globalRecordType '{global_record_type}'.", status=400, content_type="text/plain")

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    for q in queries:
        qtitle = q.get("QueryTitle", "")
        actions = q.get("displayActions", [])
        qfilters = q.get("filterOptions", [])
        record_type: Optional[str] = q.get("recordType") or global_record_type

        if not record_type:
            return HttpResponse(f"Query '{qtitle}': recordType oder globalRecordType ist erforderlich.", status=400, content_type="text/plain")
        if record_type not in ALLOWED_RECORD_TYPES:
            return HttpResponse(f"Query '{qtitle}': Ungültiger recordType '{record_type}'.", status=400, content_type="text/plain")

        ids_for_query = collect_ids_from_query(q)
        msg = validate_ids_for_record(ids_for_query, record_type, maps)
        if msg:
            return HttpResponse(f"Query '{qtitle}': {msg}", status=400, content_type="text/plain")

        record_global_filters = [
            gf for gf in global_filters
            if isinstance(gf.get("id"), int) and id_to_field(record_type, gf["id"], maps)
        ]

        recs = filter_records_for(record_type, record_global_filters, qfilters, maps)

        outputs: List[Dict[str, Any]] = []
        for act in actions:
            atype = act.get("type")
            fid = act.get("fieldId")
            title = act.get("DisplayActionTitle", "")

            if atype == "CountCategorized":
                out_obj = compute_count_categorized_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "CountCategorized", "DisplayActionTitle": title, "Output": out_obj})
            elif atype == "Count":
                out_obj = compute_count_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "Count", "DisplayActionTitle": title, "Output": out_obj})
            elif atype == "Average":
                out_obj = compute_average_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "Average", "DisplayActionTitle": title, "Output": out_obj})
            elif atype == "Max":
                out_obj = compute_max_output(recs, record_type, fid, maps)
                outputs.append({"DisplayAction": "Max", "DisplayActionTitle": title, "Output": out_obj})
            else:
                outputs.append({"DisplayAction": str(atype), "DisplayActionTitle": title, "Output": {}})

        results.append({"QueryTitle": qtitle, "Outputs": outputs})

    header = ["QueryTitle", "DisplayAction", "DisplayActionTitle", "Key", "Value"]
    rows = _rows_from_results(results)

    title = payload.get("title") or payload.get("PresetTitle") or preset_title or "statistik"
    filename = f"{slugify(title)}.{fmt}"

    # Ausgabe nach Format
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