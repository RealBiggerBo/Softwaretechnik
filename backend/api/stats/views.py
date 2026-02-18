from django.views.decorators.http import require_http_methods
import json, csv, io, base64
from urllib.parse import quote
from typing import Any, Dict, List, Optional, Tuple
from django.utils.text import slugify
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt

ALLOWED_RECORD_TYPES = {"Anfrage", "Fall"}

def _b64_urlsafe_encode(s: str) -> str:
    return base64.urlsafe_b64encode(s.encode("utf-8")).decode("ascii").rstrip("=")

def _b64_urlsafe_decode(s: str) -> str:
    padding = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode((s + padding).encode("ascii")).decode("utf-8")

def get_ci(d: Dict[str, Any], name: str, default: Any = None) -> Any:
    if not isinstance(d, dict):
        return default
    lname = name.lower()
    for k, v in d.items():
        if isinstance(k, str) and k.lower() == lname:
            return v
    return default

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
    if f in ("csv",): return "csv"
    if f in ("xlsx", "xls", "xlsl"): return "xlsx"
    if f in ("pdf",): return "pdf"
    return None

def _build_download_link_by_title(preset_title: str, fmt: str) -> Tuple[str, str]:
    # NEU: Link zeigt auf dieselbe Route, Format als Query-Parameter
    filename = f"{slugify(preset_title)}.{fmt}"
    encoded_title = quote(preset_title)
    download_url = f"/api/stats/presets/export?format={fmt.upper()}&preset_title={encoded_title}"
    return download_url, filename

@csrf_exempt
@require_http_methods(["POST"])
def stats_execute(request: HttpRequest):
    # … unverändert …
    return JsonResponse(results, safe=False, status=200)

@csrf_exempt
@require_http_methods(["POST", "GET"])
def presets_export(request: HttpRequest):
    """
    Neue Export-API:
    - POST /api/stats/presets/export → JSON {download_url, filename}
    - GET  /api/stats/presets/export?format=CSV|XLSX|PDF&preset_title=... → Datei streamen
    PDF: unformatierter Text (Semikolon-separiert), eine Zeile pro Datensatz
    """
    # POST → Link zurückgeben
    if request.method == "POST":
        try:
            body: Dict[str, Any] = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        preset_title = body.get("PresetTitle") or get_ci(body, "presetTitle") or body.get("title")
        file_format = body.get("FileFormat") or get_ci(body, "fileFormat") or body.get("format")

        if not isinstance(preset_title, str) or not preset_title.strip():
            return JsonResponse({"error": "PresetTitle ist erforderlich."}, status=400)
        fmt = _normalize_format(file_format or "")
        if fmt is None:
            return JsonResponse({"error": "Ungültiges Format. Erlaubt: CSV, XLSX, PDF"}, status=400)

        download_url, filename = _build_download_link_by_title(preset_title.strip(), fmt)
        return JsonResponse({"download_url": download_url, "filename": filename}, status=200)

    # GET → Datei streamen
    file_format_qs = request.GET.get("format") or request.GET.get("fileformat")
    fmt = _normalize_format(file_format_qs or "")
    if fmt is None:
        return HttpResponse("Ungültiges Format. Erlaubt: CSV, XLSX, PDF", status=400, content_type="text/plain")

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

    if (rt := payload.get("globalRecordType")) is not None and rt not in ALLOWED_RECORD_TYPES:
        return HttpResponse(f"Ungültiger globalRecordType '{rt}'.", status=400, content_type="text/plain")

    from .utils import (
        build_id_to_field_maps, filter_records_for,
        compute_count_output, compute_count_categorized_output,
        compute_average_output, compute_max_output,
        id_to_field, collect_ids_from_query, validate_ids_for_record,
    )

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    global_filters: List[Dict[str, Any]] = payload.get("GlobalFilterOptions", [])
    queries: List[Dict[str, Any]] = payload.get("Queries", [])
    global_record_type: Optional[str] = payload.get("globalRecordType")

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
            atype = act.get("type"); fid = act.get("fieldId"); title = act.get("DisplayActionTitle", "")
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

    if fmt == "xlsx":
        try:
            from openpyxl import Workbook
        except ImportError:
            return HttpResponse("Excel-Export benötigt 'openpyxl'. Bitte installieren: pip install openpyxl", status=500, content_type="text/plain")
        wb = Workbook(); ws = wb.active; ws.title = "Statistik"
        ws.append(header)
        for row in rows: ws.append(row)
        bio = io.BytesIO(); wb.save(bio); bio.seek(0)
        resp = HttpResponse(bio.getvalue(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        resp["Content-Disposition"] = f'attachment; filename="{filename}"'
        return resp

    if fmt == "pdf":
        try:
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import A4
        except ImportError:
            return HttpResponse("PDF-Export benötigt 'reportlab'. Bitte installieren: pip install reportlab", status=500, content_type="text/plain")
        buffer = io.BytesIO(); c = canvas.Canvas(buffer, pagesize=A4); width, height = A4
        line_height = 14; margin = 40; y = height - margin
        c.setFont("Helvetica", 10)
        c.drawString(margin, y, ";".join(header)); y -= line_height
        for row in rows:
            line = ";".join([str(x) if x is not None else "" for x in row])
            if y < margin:
                c.showPage(); y = height - margin; c.setFont("Helvetica", 10)
            c.drawString(margin, y, line); y -= line_height
        c.save(); pdf_bytes = buffer.getvalue(); buffer.close()
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