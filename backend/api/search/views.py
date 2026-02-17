import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from api.stats.utils import id_to_field, get_dataset_qs
from api.stats.id_mapping_from_db import build_id_to_field_maps_from_db

ALLOWED_RECORD_TYPES = {"Anfrage", "Fall"}

def _as_date_str(s: Any) -> Optional[str]:
    if isinstance(s, str) and len(s) == 10:
        return s
    return None

def _parse_iso_date(s: str) -> Optional[datetime]:
    try:
        if len(s) == 10:
            return datetime.strptime(s, "%Y-%m-%d")
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return None

def _matches_single_filter(values: Dict[str, Any], record_type: str, f: Dict[str, Any], maps: Dict[str, Dict[int, str]]) -> bool:
    ftype = f.get("type")
    fid = f.get("fieldId", f.get("id"))
    # Ausschließlich IDs nutzen (kein fieldName-Fallback)
    field_name = id_to_field(record_type, fid, maps) if isinstance(fid, int) else None
    val = values.get(field_name) if field_name else None

    if ftype == "Empty" or ftype is None:
        return True

    if ftype == "EnumValueFilter":
        target = f.get("value")
        if isinstance(target, list):
            return val in target
        return val == target

    if ftype == "StringValueFilter":
        return isinstance(val, str) and isinstance(f.get("value"), str) and val == f["value"]

    if ftype == "IntegerValueFilter":
        try:
            tgt = int(f.get("value"))
        except Exception:
            return False
        return isinstance(val, int) and val == tgt

    if ftype == "IntegerRangeFilter":
        try:
            mn = int(f.get("minValue"))
            mx = int(f.get("maxValue"))
        except Exception:
            return False
        return isinstance(val, int) and mn <= val <= mx

    if ftype == "DateValueFilter":
        v = _as_date_str(val)
        return v is not None and v == f.get("value")

    if ftype == "DateRangeFilter":
        v = _as_date_str(val)
        min_v = f.get("minValue")
        max_v = f.get("maxValue")
        return v is not None and isinstance(min_v, str) and isinstance(max_v, str) and (min_v <= v <= max_v)

    if ftype == "DateImplicitFilter":
        month_span = f.get("monthSpan")
        try:
            n = int(month_span)
        except Exception:
            return False
        v_str = _as_date_str(val)
        v_dt = _parse_iso_date(v_str) if v_str else None
        if not v_dt:
            return False
        now = datetime.utcnow()
        lower = now - timedelta(days=30 * n)
        return lower <= v_dt <= now

    return False

def _records_match_filters(values: Dict[str, Any], record_type: str, filters: List[Dict[str, Any]], maps: Dict[str, Dict[int, str]]) -> bool:
    return all(_matches_single_filter(values, record_type, f, maps) for f in (filters or []))

@csrf_exempt
@require_POST
def search_execute(request: HttpRequest):
    try:
        payload: Dict[str, Any] = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    record_type: Optional[str] = payload.get("Type") or payload.get("recordType") or "Fall"
    if record_type not in ALLOWED_RECORD_TYPES:
        return JsonResponse({"error": f"Ungültiger Type '{record_type}'."}, status=400)

    filter_options: List[Dict[str, Any]] = payload.get("filteroption", payload.get("filterOptions", []))

    # ID->Feldname-Mapping ausschließlich aus der DB-Struktur (Data API) laden
    maps = build_id_to_field_maps_from_db()

    qs = get_dataset_qs(record_type)

    results: List[Dict[str, Any]] = []
    for ds in qs:
        vals = ds.values or {}
        if _records_match_filters(vals, record_type, filter_options, maps):
            results.append({"id": ds.id, **vals})

    return JsonResponse(results, status=200, safe=False)