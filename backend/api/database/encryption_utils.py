from django.core.cache import cache

CACHE_TIME = 60 * 10  # 10 Minuten

def get_sensitive_fields(data_record_type, id=None):
    """
    Gibt Liste sensibler Felder zurück (rekursiv verschachtelte Keys).
    Nutzt Cache für Performance.
    """
    from api.database.models import Anfrage, Fall

    cache_key = f"sensitive:{data_record_type}:{id or 'latest'}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    # richtige Version abfragen
    if data_record_type == "Anfrage":
        record = Anfrage.objects.get(pk=id) if id else Anfrage.objects.last()
    elif data_record_type == "Fall":
        record = Fall.objects.get(pk=id) if id else Fall.objects.last()
    else:
        return []

    structure = record.structure or {}

    sensitive = []

    # Rekursive Funktion für verschachtelte Keys
    def collect_keys(struct, parent_key=""):
        keys = []
        for k, v in struct.items():
            full_key = f"{parent_key}.{k}" if parent_key else k
            if v.get("sensitive"):
                keys.append(full_key)
            if v.get("type") in ["Group", "List"]:
                element = v.get("element", {})
                keys.extend(collect_keys(element, full_key))
        return keys

    sensitive = collect_keys(structure)

    cache.set(cache_key, sensitive, CACHE_TIME)
    return sensitive