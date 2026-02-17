import json
from typing import Any, Dict, Optional

from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import StatsPreset

def _parse_json(request: HttpRequest) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(request.body.decode("utf-8"))
    except Exception:
        return None

def _validate_payload(payload: Dict[str, Any]) -> Optional[str]:
    if not isinstance(payload, dict):
        return "Payload muss ein JSON-Objekt sein."
    if "Queries" not in payload:
        return "Payload muss ein Feld 'Queries' enthalten."
    if not isinstance(payload.get("Queries"), list) or len(payload["Queries"]) == 0:
        return "'Queries' muss eine nicht-leere Liste sein."
    return None

@csrf_exempt
@require_http_methods(["POST"])
def presets_create(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = body.get("title") or body.get("PresetTitle")
    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "title/PresetTitle ist erforderlich."}, status=400)

    payload = body if "Queries" in body else body.get("payload")
    if not isinstance(payload, dict):
        return JsonResponse({"error": "payload muss ein JSON-Objekt sein."}, status=400)

    payload.pop("PresetTitle", None)
    if "GlobalFilterOptions" in payload:
        for fo in payload["GlobalFilterOptions"]:
            fo.pop("possibleValues", None)

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
    items = [
        {"id": p.id, "title": p.title, "updated_at": p.updated_at.isoformat()}
        for p in StatsPreset.objects.all()
    ]
    return JsonResponse({"items": items}, status=200)

# NEU: Get per PresetTitle via POST (statischer Endpoint)
@csrf_exempt
@require_http_methods(["POST"])
def presets_get_by_title_post(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = body.get("PresetTitle") or body.get("title")
    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "PresetTitle ist erforderlich."}, status=400)

    try:
        p = StatsPreset.objects.get(title=title.strip())
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

# NEU: Update per PresetTitle via statischem Endpoint
@csrf_exempt
@require_http_methods(["PUT", "PATCH", "POST"])
def presets_update_by_title(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = body.get("PresetTitle") or body.get("title")
    payload = body.get("payload") if "payload" in body and isinstance(body.get("payload"), dict) else (body if "Queries" in body else None)

    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "PresetTitle ist erforderlich."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "payload muss ein JSON-Objekt sein."}, status=400)

    # Payload säubern
    payload.pop("PresetTitle", None)
    if "GlobalFilterOptions" in payload:
        for fo in payload["GlobalFilterOptions"]:
            fo.pop("possibleValues", None)

    msg = _validate_payload(payload)
    if msg:
        return JsonResponse({"error": msg}, status=400)

    try:
        p = StatsPreset.objects.get(title=title.strip())
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    # Titel bleibt gleich (wie gewünscht). Nur Payload aktualisieren.
    p.payload = payload
    p.save()

    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

# NEU: Delete per PresetTitle via statischem Endpoint
@csrf_exempt
@require_http_methods(["DELETE", "POST"])
def presets_delete_by_title(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    title = body.get("PresetTitle") or body.get("title")
    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "PresetTitle ist erforderlich."}, status=400)

    try:
        p = StatsPreset.objects.get(title=title.strip())
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    p.delete()
    # 204 No Content ist üblich, hier geben wir eine Bestätigung zurück.
    return JsonResponse({"message": f"Preset '{title.strip()}' gelöscht."}, status=200)