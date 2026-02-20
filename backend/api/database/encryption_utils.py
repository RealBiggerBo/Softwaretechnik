from django.core.cache import cache

CACHE_TIME = 60 * 10 # 10 Minuten

def get_sensitive_fields(data_record_type, version):
    """
    Gibt Liste sensibler Felder zurück.
    Nutzt Cache für Performance.
    """
    from api.database.models import Anfrage, Fall

    cache_key = f"sensitive:{data_record_type}:{version}"
    cached = cache.get(cache_key)

    if cached is not None:
        return cached

    if data_record_type == "Anfrage":
        record = Anfrage.objects.get(version=version)
    elif data_record_type == "Fall":
        record = Fall.objects.get(version=version)
    else:
        return []

    structure = record.structure or {}

    sensitive = []

    for field in structure.values():
        if field.get("sensitive"):
            sensitive.append(field.get("name"))

    cache.set(cache_key, sensitive, CACHE_TIME)

    return sensitive