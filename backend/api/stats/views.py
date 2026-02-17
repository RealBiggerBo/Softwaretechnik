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


def _build_download_link_for_payload(payload: Dict[str, Any]) -> Tuple[str, str]:
    """
    Erzeugt einen Download-Link mit base64-kodiertem Payload für den CSV-Download.
    Gibt (download_url, filename) zurück.
    """
    title = payload.get("title") or payload.get("PresetTitle") or "statistik"
    filename = slugify(title) + ".csv"
    payload_json = json.dumps(payload, ensure_ascii=False)
    payload_b64 = base64.b64encode(payload_json.encode("utf-8")).decode("ascii")
    download_url = f"/api/stats/statistic-csv?payload_b64={quote(payload_b64)}"
    return download_url, filename


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
        return JsonResponse(
            {"error": f"Ungültiger globalRecordType '{global_record_type}'."},
            status=400,
        )

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    for q in queries:
        qtitle = q.get("QueryTitle", "")
        actions = q.get("displayActions", [])
        qfilters = q.get("filterOptions", [])
        record_type: Optional[str] = q.get("recordType") or global_record_type

        if not record_type:
            return JsonResponse(
                {"error": f"Query '{qtitle}': recordType oder globalRecordType ist erforderlich."},
                status=400,
            )

        if record_type not in ALLOWED_RECORD_TYPES:
            return JsonResponse(
                {"error": f"Query '{qtitle}': Ungültiger recordType '{record_type}'."},
                status=400,
            )

        # IDs strikt gegen den gewünschten Record validieren
        ids_for_query = collect_ids_from_query(q)
        msg = validate_ids_for_record(ids_for_query, record_type, maps)
        if msg:
            return JsonResponse(
                {"error": f"Query '{qtitle}': {msg}"},
                status=400,
            )

        # GlobalFilterOptions nur anwenden, wenn deren id zu diesem Record gehört
        record_global_filters = [
            gf
            for gf in global_filters
            if isinstance(gf.get("id"), int) and id_to_field(record_type, gf["id"], maps)
        ]

        # Datensätze für den Record filtern
        recs = filter_records_for(record_type, record_global_filters, qfilters, maps)

        # Aktionen berechnen
        outputs: List[Dict[str, Any]] = []
        for act in actions:
            atype = act.get("type")
            fid = act.get("fieldId")
            title = act.get("DisplayActionTitle", "")

            if atype == "CountCategorized":
                out_obj = compute_count_categorized_output(recs, record_type, fid, maps)
                outputs.append(
                    {"DisplayAction": "CountCategorized", "DisplayActionTitle": title, "Output": out_obj}
                )
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


@csrf_exempt
@require_http_methods(["POST", "GET"])
def stats_execute_csv(request: HttpRequest):
    """
    Liefert IMMER einen Download-Link (POST) und bedient den eigentlichen CSV-Download (GET).
    - POST: erwartet JSON-Payload und gibt {download_url, filename} zurück
    - GET: erwartet ?payload_b64=... und liefert die CSV-Datei
    """

    # POST → immer Download-Link zurückgeben
    if request.method == "POST":
        try:
            payload: Dict[str, Any] = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        # Nur minimale Validierung (Record-Typ prüfen, falls gesetzt)
        global_record_type: Optional[str] = payload.get("globalRecordType")
        if global_record_type is not None and global_record_type not in ALLOWED_RECORD_TYPES:
            return JsonResponse(
                {"error": f"Ungültiger globalRecordType '{global_record_type}'."},
                status=400,
            )

        url, filename = _build_download_link_for_payload(payload)
        return JsonResponse({"download_url": url, "filename": filename}, status=200)

    # GET → CSV streamen, benötigt payload_b64
    payload_b64 = request.GET.get("payload_b64")
    if not payload_b64:
        return HttpResponse("payload_b64 ist erforderlich.", status=400, content_type="text/plain")

    try:
        payload_json = base64.b64decode(payload_b64.encode("ascii")).decode("utf-8")
        payload = json.loads(payload_json)
    except Exception:
        return HttpResponse("Ungültiges payload_b64.", status=400, content_type="text/plain")

    # CSV-Berechnung wie gehabt
    global_filters: List[Dict[str, Any]] = payload.get("GlobalFilterOptions", [])
    queries: List[Dict[str, Any]] = payload.get("Queries", [])
    global_record_type: Optional[str] = payload.get("globalRecordType")

    if global_record_type is not None and global_record_type not in ALLOWED_RECORD_TYPES:
        return HttpResponse(
            f"Ungültiger globalRecordType '{global_record_type}'.",
            status=400,
            content_type="text/plain",
        )

    maps = build_id_to_field_maps()
    results: List[Dict[str, Any]] = []

    for q in queries:
        qtitle = q.get("QueryTitle", "")
        actions = q.get("displayActions", [])
        qfilters = q.get("filterOptions", [])
        record_type: Optional[str] = q.get("recordType") or global_record_type

        if not record_type:
            return HttpResponse(
                f"Query '{qtitle}': recordType oder globalRecordType ist erforderlich.",
                status=400,
                content_type="text/plain",
            )

        if record_type not in ALLOWED_RECORD_TYPES:
            return HttpResponse(
                f"Query '{qtitle}': Ungültiger recordType '{record_type}'.",
                status=400,
                content_type="text/plain",
            )

        # IDs strikt gegen den gewünschten Record validieren
        ids_for_query = collect_ids_from_query(q)
        msg = validate_ids_for_record(ids_for_query, record_type, maps)
        if msg:
            return HttpResponse(f"Query '{qtitle}': {msg}", status=400, content_type="text/plain")

        # GlobalFilterOptions nur anwenden, wenn deren id zu diesem Record gehört
        record_global_filters = [
            gf
            for gf in global_filters
            if isinstance(gf.get("id"), int) and id_to_field(record_type, gf["id"], maps)
        ]

        # Datensätze für den Record filtern
        recs = filter_records_for(record_type, record_global_filters, qfilters, maps)

        # Aktionen berechnen
        outputs: List[Dict[str, Any]] = []
        for act in actions:
            atype = act.get("type")
            fid = act.get("fieldId")
            title = act.get("DisplayActionTitle", "")

            if atype == "CountCategorized":
                out_obj = compute_count_categorized_output(recs, record_type, fid, maps)
                outputs.append(
                    {"DisplayAction": "CountCategorized", "DisplayActionTitle": title, "Output": out_obj}
                )
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

    # CSV schreiben
    output = io.StringIO()
    writer = csv.writer(output, delimiter=";")
    writer.writerow(["QueryTitle", "DisplayAction", "DisplayActionTitle", "Key", "Value"])
    for query in results:
        qt = query.get("QueryTitle", "")
        for output_entry in query.get("Outputs", []):
            da = output_entry.get("DisplayAction", "")
            dat = output_entry.get("DisplayActionTitle", "")
            out = output_entry.get("Output", {})
            if isinstance(out, dict):
                for key, value in out.items():
                    writer.writerow([qt, da, dat, key, value])
            else:
                writer.writerow([qt, da, dat, "", out])

    title = payload.get("title") or payload.get("PresetTitle") or "statistik"
    filename = slugify(title) + ".csv"

    resp = HttpResponse(output.getvalue(), content_type="text/csv")
    resp["Content-Disposition"] = f"attachment; filename={filename}"
    return resp