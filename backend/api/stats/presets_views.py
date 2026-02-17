import json
from typing import Any, Dict, Optional

from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import StatsPreset

# Case-insensitive Zugriff auf Keys (canonical: camelCase)
def get_ci(d: Dict[str, Any], name: str, default: Any = None) -> Any:
    if not isinstance(d, dict):
        return default
    lname = name.lower()
    for k, v in d.items():
        if isinstance(k, str) and k.lower() == lname:
            return v
    return default

def _parse_json(request: HttpRequest) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(request.body.decode("utf-8"))
    except Exception:
        return None

def _validate_payload(payload: Dict[str, Any]) -> Optional[str]:
    if not isinstance(payload, dict):
        return "Payload muss ein JSON-Objekt sein."
    # akzeptiert 'queries' (camelCase) und 'Queries' (Legacy) – canonical ist 'queries'
    queries = get_ci(payload, "queries")
    if queries is None:
        return "Payload muss ein Feld 'queries' enthalten."
    if not isinstance(queries, list) or len(queries) == 0:
        return "'queries' muss eine nicht-leere Liste sein."
    return None

def _infer_record_type(payload: Dict[str, Any]) -> Optional[str]:
    """
    Leitet den recordType eines Presets ab:
    - bevorzugt globalRecordType
    - falls nicht vorhanden: recordType der ersten Query
    - sonst: None
    """
    if not isinstance(payload, dict):
        return None
    rt = get_ci(payload, "globalRecordType")
    if isinstance(rt, str) and rt:
        return rt
    queries = get_ci(payload, "queries") or []
    if isinstance(queries, list) and queries:
        first = queries[0]
        frt = get_ci(first, "recordType")
        if isinstance(frt, str) and frt:
            return frt
    return None

@csrf_exempt
@require_http_methods(["POST"])
def presets_create(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    # Titel: canonical 'presetTitle', fallback 'title'/'PresetTitle'
    title = get_ci(body, "presetTitle") or get_ci(body, "title")
    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "presetTitle/title ist erforderlich."}, status=400)

    # payload: entweder explizit 'payload' oder der Body selbst, wenn 'queries' enthalten ist
    payload = get_ci(body, "payload")
    if not isinstance(payload, dict):
        payload = body if get_ci(body, "queries") is not None else None
    if not isinstance(payload, dict):
        return JsonResponse({"error": "payload muss ein JSON-Objekt sein."}, status=400)

    # Payload säubern: 'presetTitle' entfernen (egal welches Case)
    for k in list(payload.keys()):
        if isinstance(k, str) and k.lower() == "presettitle":
            payload.pop(k, None)

    # possibleValues aus globalFilterOptions entfernen (case-insensitive)
    gfs = get_ci(payload, "globalFilterOptions") or []
    if isinstance(gfs, list):
        for fo in gfs:
            if isinstance(fo, dict):
                for k in list(fo.keys()):
                    if isinstance(k, str) and k.lower() == "possiblevalues":
                        fo.pop(k, None)

    if StatsPreset.objects.filter(title=title.strip()).exists():
        return JsonResponse({"error": "Preset mit diesem Namen existiert bereits."}, status=409)

    msg = _validate_payload(payload)
    if msg:
        return JsonResponse({"error": msg}, status=400)

    preset = StatsPreset.objects.create(
        title=title.strip(),
        payload=payload,
        created_by=getattr(request, "user", None) if getattr(request, "user", None) and getattr(request.user, "is_authenticated", False) else None,
    )

    return JsonResponse({"id": preset.id, "title": preset.title, "payload": preset.payload, "updated_at": preset.updated_at.isoformat()}, status=201)

@csrf_exempt
@require_http_methods(["GET"])
def presets_list(request: HttpRequest):
    items = []
    for p in StatsPreset.objects.all():
        rt = _infer_record_type(p.payload)
        items.append({
            "id": p.id,
            "title": p.title,
            "recordType": rt,  # neu: abgeleitet aus Payload
            "updated_at": p.updated_at.isoformat(),
        })
    return JsonResponse({"items": items}, status=200)

# Get per presetTitle via POST (statischer Endpoint)
@csrf_exempt
@require_http_methods(["POST"])
def presets_get_by_title_post(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = get_ci(body, "presetTitle") or get_ci(body, "title")
    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "presetTitle ist erforderlich."}, status=400)

    try:
        p = StatsPreset.objects.get(title=title.strip())
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

# Update per presetTitle via statischem Endpoint
@csrf_exempt
@require_http_methods(["PUT", "PATCH", "POST"])
def presets_update_by_title(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = get_ci(body, "presetTitle") or get_ci(body, "title")
    candidate_payload = get_ci(body, "payload")
    payload = candidate_payload if isinstance(candidate_payload, dict) else (body if get_ci(body, "queries") is not None else None)

    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "presetTitle ist erforderlich."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "payload muss ein JSON-Objekt sein."}, status=400)

    # Payload säubern
    for k in list(payload.keys()):
        if isinstance(k, str) and k.lower() == "presettitle":
            payload.pop(k, None)

    gfs = get_ci(payload, "globalFilterOptions") or []
    if isinstance(gfs, list):
        for fo in gfs:
            if isinstance(fo, dict):
                for k in list(fo.keys()):
                    if isinstance(k, str) and k.lower() == "possiblevalues":
                        fo.pop(k, None)

    msg = _validate_payload(payload)
    if msg:
        return JsonResponse({"error": msg}, status=400)

    try:
        p = StatsPreset.objects.get(title=title.strip())
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    p.payload = payload
    p.save()

    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

# Delete per presetTitle via statischem Endpoint
@csrf_exempt
@require_http_methods(["DELETE", "POST"])
def presets_delete_by_title(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = get_ci(body, "presetTitle") or get_ci(body, "title")
    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "presetTitle ist erforderlich."}, status=400)

    try:
        p = StatsPreset.objects.get(title=title.strip())
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    p.delete()
    return JsonResponse({"message": f"Preset '{title.strip()}' gelöscht."}, status=200)