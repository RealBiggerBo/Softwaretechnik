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
    return None


def _infer_record_type_from_payload(payload: Dict[str, Any]) -> str:
    """
    Liefert 'Fall' oder 'Anfrage', falls im Payload vorhanden.
    1. Zuerst globalRecordType prüfen
    2. Sonst erstes vorkommendes recordType in den Queries
    3. Sonst leerer String
    """
    t = payload.get("globalRecordType")
    if t in ("Fall", "Anfrage"):
        return t

    for q in payload.get("Queries", []):
        rt = q.get("recordType")
        if rt in ("Fall", "Anfrage"):
            return rt

    return ""


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

    # Payload säubern
    payload.pop("PresetTitle", None)
    if "GlobalFilterOptions" in payload:
        for fo in payload["GlobalFilterOptions"]:
            fo.pop("possibleValues", None)

    # Duplikatnamen verhindern
    if StatsPreset.objects.filter(title=title.strip()).exists():
        return JsonResponse({"error": "Preset mit diesem Namen existiert bereits."}, status=409)

    # Validierung
    msg = _validate_payload(payload)
    if msg:
        return JsonResponse({"error": msg}, status=400)

    # Speichern
    preset = StatsPreset.objects.create(
        title=title.strip(),
        payload=payload,
        created_by=getattr(request, "user", None)
        if getattr(request, "user", None) and getattr(request.user, "is_authenticated", False)
        else None,
    )

    # Konsistente Rückgabe inkl. Type
    return JsonResponse(
        {
            "id": preset.id,
            "title": preset.title,
            "payload": preset.payload,
            "updated_at": preset.updated_at.isoformat(),
            "type": _infer_record_type_from_payload(preset.payload if isinstance(preset.payload, dict) else {}),
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["GET"])
def presets_list(request: HttpRequest):
    items = []
    for p in StatsPreset.objects.all():
        payload = p.payload if isinstance(p.payload, dict) else {}
        items.append(
            {
                "id": p.id,
                "title": p.title,
                "updated_at": p.updated_at.isoformat(),
                "type": _infer_record_type_from_payload(payload),
            }
        )
    return JsonResponse({"items": items}, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def presets_get(request: HttpRequest, preset_id: int):
    try:
        p = StatsPreset.objects.get(id=preset_id)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    payload = p.payload if isinstance(p.payload, dict) else {}
    return JsonResponse(
        {
            "id": p.id,
            "title": p.title,
            "payload": p.payload,
            "updated_at": p.updated_at.isoformat(),
            "type": _infer_record_type_from_payload(payload),
        },
        status=200,
    )


@csrf_exempt
@require_http_methods(["GET"])
def presets_get_by_title(request: HttpRequest, title: str):
    try:
        p = StatsPreset.objects.get(title=title)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    payload = p.payload if isinstance(p.payload, dict) else {}
    return JsonResponse(
        {
            "id": p.id,
            "title": p.title,
            "payload": p.payload,
            "updated_at": p.updated_at.isoformat(),
            "type": _infer_record_type_from_payload(payload),
        },
        status=200,
    )


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

        # Payload säubern
        payload.pop("PresetTitle", None)
        if "GlobalFilterOptions" in payload:
            for fo in payload["GlobalFilterOptions"]:
                fo.pop("possibleValues", None)

        msg = _validate_payload(payload)
        if msg:
            return JsonResponse({"error": msg}, status=400)

        p.payload = payload

    p.save()

    payload_dict = p.payload if isinstance(p.payload, dict) else {}
    return JsonResponse(
        {
            "id": p.id,
            "title": p.title,
            "payload": p.payload,
            "updated_at": p.updated_at.isoformat(),
            "type": _infer_record_type_from_payload(payload_dict),
        },
        status=200,
    )


@csrf_exempt
@require_http_methods(["DELETE"])
def presets_delete(request: HttpRequest, preset_id: int):
    try:
        p = StatsPreset.objects.get(id=preset_id)
    except StatsPreset.DoesNotExist:
        return JsonResponse({"error": "Preset nicht gefunden."}, status=404)

    p.delete()
    return JsonResponse({"ok": True}, status=200)