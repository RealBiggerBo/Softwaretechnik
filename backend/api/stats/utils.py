import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Literal

from django.db.models import QuerySet
from api.database.models import DataSet

RecordName = Literal["Anfrage", "Fall"]

BASE_DIR = Path(__file__).resolve().parents[2]  # .../backend/
FORMAT_DIR = BASE_DIR / "api" / "database"

def _load_json(path: Path) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_all_formats() -> Dict[RecordName, Dict[str, Any]]:
    fmts: Dict[RecordName, Dict[str, Any]] = {}
    anfrage = FORMAT_DIR / "anfrage.json"
    fall = FORMAT_DIR / "fall.json"
    if anfrage.exists():
        fmts["Anfrage"] = _load_json(anfrage)
    if fall.exists():
        fmts["Fall"] = _load_json(fall)
    return fmts

def build_id_to_field_maps() -> Dict[RecordName, Dict[int, str]]:
    fmts = load_all_formats()
    result: Dict[RecordName, Dict[int, str]] = {}
    for rec, spec in fmts.items():
        id_map: Dict[int, str] = {}
        for field_name, meta in spec.items():
            field_id = meta.get("id")
            if isinstance(field_id, int):
                id_map[field_id] = field_name
        result[rec] = id_map
    return result

def get_dataset_qs(record: RecordName) -> QuerySet[DataSet]:
    return DataSet.objects.filter(data_record=record)

def id_to_field(
    record: RecordName, field_id: int, maps: Dict[RecordName, Dict[int, str]]
) -> Optional[str]:
    return maps.get(record, {}).get(field_id)

def _as_date_str(s: Any) -> Optional[str]:
    if isinstance(s, str) and len(s) == 10:
        return s
    return None

def _matches_single_filter(
    values: Dict[str, Any],
    record: RecordName,
    f: Dict[str, Any],
    maps: Dict[RecordName, Dict[int, str]],
) -> bool:
    ftype = f.get("type")
    fid = f.get("fieldId", f.get("id"))
    field_name = id_to_field(record, fid, maps) if isinstance(fid, int) else None
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
        except Exception:
            return False
        try:
            mx = int(f.get("maxValue"))
        except Exception:
            return False
        return isinstance(val, int) and mn <= val <= mx

    if ftype == "DateValueFilter":
        v = _as_date_str(val)
        return v is not None and v == f.get("value")

    if ftype in ("DateRangeFilter", "GlobalFilterOption"):
        v = _as_date_str(val)
        min_v = f.get("minValue")
        max_v = f.get("maxValue")
        return v is not None and isinstance(min_v, str) and isinstance(max_v, str) and (min_v <= v <= max_v)

    return True

def records_match_filters(
    values: Dict[str, Any],
    record: RecordName,
    filters: List[Dict[str, Any]],
    maps: Dict[RecordName, Dict[int, str]],
) -> bool:
    return all(_matches_single_filter(values, record, f, maps) for f in (filters or []))

def filter_records_for(
    record: RecordName,
    global_filters: List[Dict[str, Any]],
    query_filters: List[Dict[str, Any]],
    maps: Dict[RecordName, Dict[int, str]],
) -> List[Dict[str, Any]]:
    qs = get_dataset_qs(record)
    out: List[Dict[str, Any]] = []
    for ds in qs:
        vals = ds.values or {}
        if records_match_filters(vals, record, global_filters, maps) and records_match_filters(
            vals, record, query_filters, maps
        ):
            out.append(vals)
    return out

def compute_count_output(
    records: List[Dict[str, Any]],
    record: RecordName,
    field_id: int,
    maps: Dict[RecordName, Dict[int, str]],
) -> Dict[str, int]:
    fname = id_to_field(record, field_id, maps)
    cnt = 0
    for r in records:
        v = r.get(fname)
        if isinstance(v, bool):
            if v:
                cnt += 1
        else:
            if v is not None:
                cnt += 1
    return {str(fname): cnt}

def compute_count_categorized_output(
    records: List[Dict[str, Any]],
    record: RecordName,
    field_id: int,
    maps: Dict[RecordName, Dict[int, str]],
) -> Dict[str, int]:
    fname = id_to_field(record, field_id, maps)
    buckets: Dict[str, int] = {}
    for r in records:
        key = r.get(fname)
        label = "null" if key is None else str(key)
        buckets[label] = buckets.get(label, 0) + 1
    return buckets

def compute_average_output(
    records: List[Dict[str, Any]],
    record: RecordName,
    field_id: int,
    maps: Dict[RecordName, Dict[int, str]],
) -> Dict[str, float]:
    fname = id_to_field(record, field_id, maps)
    total = 0
    count = 0
    for r in records:
        v = r.get(fname)
        if isinstance(v, int):
            total += v
            count += 1
    avg = (total / count) if count > 0 else 0.0
    return {str(fname): round(avg, 2)}

def compute_max_output(
    records: List[Dict[str, Any]],
    record: RecordName,
    field_id: int,
    maps: Dict[RecordName, Dict[int, str]],
) -> Dict[str, Optional[int]]:
    fname = id_to_field(record, field_id, maps)
    current_max: Optional[int] = None
    for r in records:
        v = r.get(fname)
        if isinstance(v, int):
            current_max = v if current_max is None else max(current_max, v)
    return {str(fname): current_max}

def collect_ids_from_query(query: Dict[str, Any]) -> List[int]:
    ids: List[int] = []
    for a in query.get("displayActions", []) or []:
        fid = a.get("fieldId")
        if isinstance(fid, int):
            ids.append(fid)
    for f in query.get("filterOptions", []) or []:
        fid = f.get("fieldId")
        if isinstance(fid, int):
            ids.append(fid)
    return ids

def validate_ids_for_record(
    ids: List[int],
    record: RecordName,
    maps: Dict[RecordName, Dict[int, str]],
) -> Optional[str]:
    rec_map = maps.get(record, {})
    unknown = [i for i in ids if i not in rec_map]
    if unknown:
        return f"IDs {unknown} gehören nicht zum DataRecord '{record}'."
    return None