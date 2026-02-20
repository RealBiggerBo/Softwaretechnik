import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from api.stats.utils import id_to_field, get_dataset_qs, normalize_values, build_id_to_field_maps, records_match_filters

ALLOWED_RECORD_TYPES = {"Anfrage", "Fall"}

def _as_date_str(s: Any) -> Optional[str]:
    if isinstance(s, str) and len(s) == 10:
        return s
    return None

def _month_day_str(s: Any) -> Optional[str]:
    if not isinstance(s, str):
        return None
    s = s.strip()
    if len(s) == 10 and s[4] == "-" and s[7] == "-":
        return s[5:]
    if len(s) == 5 and s[2] == "-":
        return s
    return None


def _parse_iso_date(s: str) -> Optional[datetime]:
    try:
        if len(s) == 10:
            return datetime.strptime(s, "%Y-%m-%d")
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return None

def _matches_single_filter(values: Dict[Any, Any], record_type: str, f: Dict[str, Any], maps: Dict[str, Dict[int, str]]) -> bool:
    """
    Erwartet normalisierte values (numerische IDs als Keys).
    Filter arbeitet über fieldId (int). Numeric-strings werden für Integer-Checks toleriert.
    """
    ftype = f.get("type")
    fid = f.get("fieldId", f.get("id"))

    if ftype == "Empty" or ftype is None:
        return True

    if not isinstance(fid, int):
        return False

    val = values.get(fid)

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
        # akzeptiere numeric strings als Integer
        if isinstance(val, str) and val.isdigit():
            try:
                return int(val) == tgt
            except Exception:
                return False
        return isinstance(val, int) and val == tgt

    if ftype == "IntegerRangeFilter":
        try:
            mn = int(f.get("minValue"))
            mx = int(f.get("maxValue"))
        except Exception:
            return False
        if isinstance(val, str) and val.isdigit():
            try:
                v_int = int(val)
            except Exception:
                return False
            return mn <= v_int <= mx
        return isinstance(val, int) and mn <= val <= mx

    if ftype == "DateValueFilter":
        include_year = f.get("includeYear", True)
        if include_year:
            v = _as_date_str(val)
            return v is not None and v == f.get("value")
        else:
            v_md = _month_day_str(val)
            tgt_md = _month_day_str(f.get("value"))
            return v_md is not None and tgt_md is not None and v_md == tgt_md

    if ftype == "DateRangeFilter":
        include_year = f.get("includeYear", True)
        if include_year:
            v = _as_date_str(val)
            min_v = f.get("minValue")
            max_v = f.get("maxValue")
            return v is not None and isinstance(min_v, str) and isinstance(max_v, str) and (min_v <= v <= max_v)
        else:
            v_md = _month_day_str(val)
            min_md = _month_day_str(f.get("minValue"))
            max_md = _month_day_str(f.get("maxValue"))
            if v_md is None or min_md is None or max_md is None:
                return False
            if min_md <= max_md:
                return min_md <= v_md <= max_md
            return v_md >= min_md or v_md <= max_md

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


    format_version = payload.get("formatVersion", None)
    if format_version is not None:
        try:
            format_version = int(format_version)
        except Exception:
            return JsonResponse({"error": "formatVersion must be an integer."}, status=400)
    # ID->Feldname-Mapping ausschließlich aus der DB-Struktur (Data API) laden
    maps = build_id_to_field_maps()

    qs = get_dataset_qs(record_type)
    if format_version is not None:
        qs = qs.filter(version=format_version)

    results: List[Dict[str, Any]] = []
    for ds in qs:
        vals = normalize_values(ds.values or {})
        if records_match_filters(vals, record_type, filter_options, maps):
            results.append({"id": ds.id, **vals})

    return JsonResponse(results, status=200, safe=False)