import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Literal

from django.db.models import QuerySet
from api.database.models import DataSet, Anfrage, Fall

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


def _month_day_str(s: Any) -> Optional[str]:
    """
    Liefert 'MM-DD' wenn s ein Datum 'YYYY-MM-DD' oder 'MM-DD' ist, sonst None.
    """
    if not isinstance(s, str):
        return None
    s = s.strip()
    if len(s) == 10 and s[4] == "-" and s[7] == "-":
        return s[5:]
    if len(s) == 5 and s[2] == "-":
        return s
    return None

def build_id_to_field_maps() -> Dict[RecordName, Dict[int, str]]:
    """
    Baut das Mapping ID -> Feldname aus den in der DB hinterlegten DataRecord-Strukturen (Fall/Anfrage).
    Nimmt jeweils die neueste Struktur-Version (latest('id')).

    Erwartete Struktur-Form:
      structure = {
        "<id-as-string>": { "name": "<fieldName>", ... },
        ...
      }

    Ergebnis:
      { "Fall": { 1: "Alias", 2: "Rolle", ... }, "Anfrage": { ... } }
    """
    # def _map_from_structure(structure: Any) -> Dict[int, str]:

    #     """
    #     Unterstützt verschiedene Struktur-Formate und traversiert verschachtelte
    #     Gruppen/Lists ('element'), so dass alle Feld-IDs -> Feldname gemappt werden.
    #     Unterstützte Eingabe-Beispiele:
    #     A) { "3": {"name": "Alter", ...} , ... }
    #     B) { "Alter": {"id": 3, ...}, ... }
    #     Liefert ein flaches Mapping { id: fieldName } für alle in der Struktur vorkommenden Felder.

    #     """

    #     if not isinstance(structure, dict):
    #         return {}

    #     out: Dict[int, str] = {}

    #     def _add_from_meta(raw_key: Any, meta: Any, parent_name: Optional[str] = None) -> None:
    #         # raw_key kann "3" (string id) oder Feldname sein (case B)
    #         if isinstance(raw_key, str) and raw_key.isdigit():
    #             # Case A: raw_key ist ID-String
    #             try:
    #                 fid = int(raw_key)
    #             except Exception:
    #                 return
    #             if isinstance(meta, dict):
    #                 name = meta.get("name") or parent_name
    #                 if isinstance(name, str) and name.strip():
    #                     out[fid] = name.strip()
    #         elif isinstance(raw_key, str) and isinstance(meta, dict):
    #             # Case B: raw_key ist Feldname, meta enthält id
    #             fid = meta.get("id")
    #             if isinstance(fid, int):
    #                 out[fid] = raw_key.strip()

    #         # Falls meta verschachtelte Elemente enthält, traversiere diese
    #         if isinstance(meta, dict):
    #             # Common key for nested fields: 'element'
    #             elem = meta.get("element")
    #             if isinstance(elem, dict):
    #                 for rk, rm in elem.items():
    #                     _add_from_meta(rk, rm, parent_name=None)
    #             # In manchen Strukturen gibt es 'fields' o.ä. (sicherheitshalber prüfen)
    #             fields = meta.get("fields")
    #             if isinstance(fields, dict):
    #                 for rk, rm in fields.items():
    #                     _add_from_meta(rk, rm, parent_name=None)

    #     # Heuristik: Falls top-level keys sind id-strings, handle direkt; else try case B
    #     for k, v in structure.items():
    #         _add_from_meta(k, v, parent_name=None)

    #     return out



    def _map_from_structure(structure: Any) -> Dict[int, str]:
        if not isinstance(structure, dict):
            return {}

        out: Dict[int, str] = {}

        def _add_from_meta(raw_key: Any, meta: Any) -> None:
            # raw_key: "3" (ID-string) oder Feldname
            if isinstance(raw_key, str) and raw_key.isdigit():
                try:
                    fid = int(raw_key)
                except Exception:
                    fid = None
                if fid is not None and isinstance(meta, dict):
                    name = meta.get("name")
                    if isinstance(name, str) and name.strip():
                        out[fid] = name.strip()
            elif isinstance(raw_key, str) and isinstance(meta, dict):
                fid = meta.get("id")
                if isinstance(fid, int):
                    out[fid] = raw_key.strip()

            # traverse nested structures
            if isinstance(meta, dict):
                elem = meta.get("element")
                if isinstance(elem, dict):
                    for rk, rm in elem.items():
                        _add_from_meta(rk, rm)
                fields = meta.get("fields")
                if isinstance(fields, dict):
                    for rk, rm in fields.items():
                        _add_from_meta(rk, rm)

        for k, v in structure.items():
            _add_from_meta(k, v)

        return out

    result: Dict[RecordName, Dict[int, str]] = {"Fall": {}, "Anfrage": {}}

    try:
        fall_struct = Fall.objects.latest("id").structure
        result["Fall"] = _map_from_structure(fall_struct)
    except Exception:
        result["Fall"] = {}

    try:
        anfrage_struct = Anfrage.objects.latest("id").structure
        result["Anfrage"] = _map_from_structure(anfrage_struct)
    except Exception:
        result["Anfrage"] = {}

    return result


# Alte Struktur

# def build_id_to_field_maps() -> Dict[RecordName, Dict[int, str]]:
#     """
#     Baut das Mapping ID -> Feldname aus den in der DB hinterlegten DataRecord-Strukturen (Fall/Anfrage).
#     Nimmt jeweils die neueste Struktur-Version (latest('id')).
#     """
#     result: Dict[RecordName, Dict[int, str]] = {}

#     # Fall-Struktur
#     try:
#         fall_struct = Fall.objects.latest('id').structure or {}
#         fall_map: Dict[int, str] = {}
#         for field_name, meta in fall_struct.items():
#             fid = meta.get("id")
#             if isinstance(fid, int):
#                 fall_map[fid] = field_name
#         result["Fall"] = fall_map
#     except Exception:
#         result["Fall"] = {}

#     # Anfrage-Struktur
#     try:
#         anfrage_struct = Anfrage.objects.latest('id').structure or {}
#         anfrage_map: Dict[int, str] = {}
#         for field_name, meta in anfrage_struct.items():
#             fid = meta.get("id")
#             if isinstance(fid, int):
#                 anfrage_map[fid] = field_name
#         result["Anfrage"] = anfrage_map
#     except Exception:
#         result["Anfrage"] = {}

#     return result

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


# def get_value(values: Any, field_id: Any, default: Any = None) -> Any:
#     """
#     Liest ein Feld aus DataSet.values robust (JSON keys sind i.d.R. strings).
#     Unterstützt field_id als int oder str.
#     """
#     if not isinstance(values, dict):
#         return default
#     if field_id in values:
#         return values.get(field_id, default)
#     if isinstance(field_id, int):
#         return values.get(str(field_id), default)
#     if isinstance(field_id, str) and field_id.isdigit():
#         return values.get(int(field_id), default)
#     return default



def normalize_values(values: Any) -> Dict[Any, Any]:
    if not isinstance(values, dict):
        return {}
    out = {}
    for k, v in values.items():
        if isinstance(k, str) and k.isdigit():
            out[int(k)] = v
        else:
            out[k] = v
    return out



def _extract_date_strings(x: Any) -> List[str]:
    """
    Rekursiv alle Datum-Strings (YYYY-MM-DD oder MM-DD) aus x extrahieren.
    Unterstützt str, dict, list. Liefert eine Liste (evtl. leer).
    """
    out: List[str] = []
    if isinstance(x, str):
        if _as_date_str(x) or _month_day_str(x):
            out.append(x)
        return out
    if isinstance(x, dict):
        for v in x.values():
            out.extend(_extract_date_strings(v))
        return out
    if isinstance(x, list):
        for it in x:
            out.extend(_extract_date_strings(it))
        return out
    return out




def _matches_single_filter(
    values: Dict[Any, Any],
    record: RecordName,
    f: Dict[str, Any],
    maps: Dict[RecordName, Dict[int, str]],
) -> bool:
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
        return isinstance(val, int) and val == tgt

    if ftype == "IntegerRangeFilter":
        try:
            mn = int(f.get("minValue"))
            mx = int(f.get("maxValue"))
        except Exception:
            return False
        return isinstance(val, int) and mn <= val <= mx

    if ftype == "DateValueFilter":
        include_year = f.get("includeYear", True)
        dates = _extract_date_strings(val)
        if include_year:
            target = f.get("value")
            if not isinstance(target, str):
                return False
            return any(_as_date_str(d) is not None and d == target for d in dates)
        else:
            tgt_md = _month_day_str(f.get("value"))
            if tgt_md is None:
                return False
            return any(_month_day_str(d) == tgt_md for d in dates)

    if ftype in ("DateRangeFilter", "GlobalFilterOption"):
        include_year = f.get("includeYear", True)
        dates = _extract_date_strings(val)
        if include_year:
            min_v = f.get("minValue")
            max_v = f.get("maxValue")
            if not (isinstance(min_v, str) and isinstance(max_v, str)):
                return False
            return any((_as_date_str(d) is not None and min_v <= d <= max_v) for d in dates)
        else:
            min_md = _month_day_str(f.get("minValue"))
            max_md = _month_day_str(f.get("maxValue"))
            if min_md is None or max_md is None:
                return False
            for d in dates:
                d_md = _month_day_str(d)
                if d_md is None:
                    continue
                if min_md <= max_md:
                    if min_md <= d_md <= max_md:
                        return True
                else:
                    # wrap-around über Jahreswechsel (z. B. 11-01 .. 02-28)
                    if d_md >= min_md or d_md <= max_md:
                        return True
            return False

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
        vals = normalize_values(ds.values or {})
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
        v = r.get(field_id)
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
    buckets: Dict[str, int] = {}
    for r in records:
        key = r.get(field_id)
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
        v = r.get(field_id)
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
        v = r.get(field_id)
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