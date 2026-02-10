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
    # Minimalvalidierung: Queries vorhanden
    if not isinstance(payload, dict):
        return "Payload muss ein JSON-Objekt sein."
    if "Queries" not in payload:
        return "Payload muss ein Feld 'Queries' enthalten."
    if not isinstance(payload.get("Queries"), list) or len(payload["Queries"]) == 0:
        return "'Queries' muss eine nicht-leere Liste sein."
    # Optional: PresetTitle vorhanden
    if "PresetTitle" not in payload or not isinstance(payload["PresetTitle"], str) or not payload["PresetTitle"].strip():
        return "Payload muss 'PresetTitle' (string) enthalten."
    return None

@csrf_exempt
@require_http_methods(["POST"])
def presets_create(request: HttpRequest):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    # Erlaube zwei Varianten:
    # - Voller Stats-Payload; Titel aus PresetTitle
    # - Expliziter Titel + payload
    title = body.get("title") or body.get("PresetTitle")
    payload = body if "Queries" in body else body.get("payload")

    if not isinstance(title, str) or not title.strip():
        return JsonResponse({"error": "title/PresetTitle ist erforderlich."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "payload muss ein JSON-Objekt sein."}, status=400)

    msg = _validate_payload(payload)
    if msg:
        return JsonResponse({"error": msg}, status=400)

    preset = StatsPreset.objects.create(
        title=title.strip(),
        payload=payload,
        created_by=getattr(request, "user", None) if getattr(request, "user", None) and getattr(request.user, "is_authenticated", False) else None,
    )
    return JsonResponse(
        {"id": preset.id, "title": preset.title, "payload": preset.payload, "created_at": preset.created_at.isoformat()},
        status=201,
    )

@csrf_exempt
@require_http_methods(["GET"])
def presets_list(request: HttpRequest):
    items = [
        {"id": p.id, "title": p.title, "updated_at": p.updated_at.isoformat()}
        for p in StatsPreset.objects.all()
    ]
    return JsonResponse({"items": items}, status=200)

@csrf_exempt
@require_http_methods(["GET"])
def presets_get(request: HttpRequest, preset_id: int):
    try:
        p = StatsPreset.objects.get(id=preset_id)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

@csrf_exempt
@require_http_methods(["GET"])
def presets_get_by_title(request: HttpRequest, title: str):
    try:
        p = StatsPreset.objects.get(title=title)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)
    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def presets_update(request: HttpRequest, preset_id: int):
    body = _parse_json(request)
    if body is None:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)
    try:
        p = StatsPreset.objects.get(id=preset_id)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    title = body.get("title")
    payload = body.get("payload")

    if title is not None:
        if not isinstance(title, str) or not title.strip():
            return JsonResponse({"error": "title muss ein nicht-leerer String sein."}, status=400)
        p.title = title.strip()

    if payload is not None:
        if not isinstance(payload, dict):
            return JsonResponse({"error": "payload muss ein JSON-Objekt sein."}, status=400)
        msg = _validate_payload(payload)
        if msg:
            return JsonResponse({"error": msg}, status=400)
        p.payload = payload

    p.save()
    return JsonResponse({"id": p.id, "title": p.title, "payload": p.payload, "updated_at": p.updated_at.isoformat()}, status=200)

@csrf_exempt
@require_http_methods(["DELETE"])
def presets_delete(request: HttpRequest, preset_id: int):
    try:
        p = StatsPreset.objects.get(id=preset_id)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)
    p.delete()
    return JsonResponse({"ok": True}, status=200)