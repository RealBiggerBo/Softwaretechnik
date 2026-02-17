from typing import Dict, Literal
from api.database.models import Anfrage, Fall

RecordName = Literal["Anfrage", "Fall"]

def build_id_to_field_maps_from_db() -> Dict[RecordName, Dict[int, str]]:
    """
    Baut das Mapping ID -> Feldname aus den in der DB hinterlegten DataRecord-Strukturen (Fall/Anfrage).
    Nimmt jeweils die neueste Struktur-Version (latest('id')).
    """
    result: Dict[RecordName, Dict[int, str]] = {}
    # Fall-Struktur
    try:
        fall_struct = Fall.objects.latest('id').structure or {}
        fall_map: Dict[int, str] = {}
        for fname, meta in fall_struct.items():
            fid = meta.get("id")
            if isinstance(fid, int):
                fall_map[fid] = fname
        result["Fall"] = fall_map
    except Exception:
        result["Fall"] = {}
    # Anfrage-Struktur
    try:
        anfrage_struct = Anfrage.objects.latest('id').structure or {}
        anfrage_map: Dict[int, str] = {}
        for fname, meta in anfrage_struct.items():
            fid = meta.get("id")
            if isinstance(fid, int):
                anfrage_map[fid] = fname
        result["Anfrage"] = anfrage_map
    except Exception:
        result["Anfrage"] = {}
    return result