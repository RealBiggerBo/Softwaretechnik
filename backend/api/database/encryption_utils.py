from django.core.cache import cache
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64
from django.conf import settings

def decrypt_value(encrypted_value: str) -> str:
    """
    Entschlüsselt einen AES-GCM verschlüsselten Wert.
    Erwartet das Format: ENC1:BASE64(nonce + ciphertext + tag)
    """
    if not encrypted_value:
        return encrypted_value

    if encrypted_value.startswith("ENC1:"):
        encrypted_value = encrypted_value[5:]

    encrypted_bytes = base64.b64decode(encrypted_value)

    # AESGCM erwartet 12 Byte Nonce, Rest ist Ciphertext + Tag
    nonce = encrypted_bytes[:12]
    ciphertext_and_tag = encrypted_bytes[12:]

    aesgcm = AESGCM(settings.AES_KEY.encode())  # Key aus settings.py
    decrypted_bytes = aesgcm.decrypt(nonce, ciphertext_and_tag, associated_data=None)
    return decrypted_bytes.decode("utf-8")


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

# def decrypt_sensitive_fields(data_dict, sensitive_keys):
#     """
#     Entschlüsselt rekursiv die sensiblen Felder in einem dict.
#     """
#     result = {}
#     for k, v in data_dict.items():
#         full_key = str(k)
#         # Wenn Wert ein dict ist, rekursiv prüfen
#         if isinstance(v, dict):
#             nested_keys = [key[len(full_key)+1:] for key in sensitive_keys if key.startswith(f"{full_key}.")]
#             result[k] = decrypt_sensitive_fields(v, nested_keys)
#         # Wenn Schlüssel sensibel, entschlüsseln
#         elif full_key in sensitive_keys:
#             result[k] = decrypt_value(v) 
#         else:
#             result[k] = v
#     return result

def decrypt_sensitive_fields(data_dict, sensitive_keys):
    """
    Debug: Ersetzt alle sensiblen Felder rekursiv mit 'hello'.
    Funktioniert auch für verschachtelte Dicts und Listen.
    """
    if isinstance(data_dict, dict):
        result = {}
        for k, v in data_dict.items():
            full_key = str(k)
            # Prüfen, ob der Key selbst sensibel ist
            if full_key in sensitive_keys:
                result[k] = "hello"
            # Dict rekursiv prüfen
            elif isinstance(v, dict):
                nested_keys = [key[len(full_key)+1:] for key in sensitive_keys if key.startswith(f"{full_key}.")]
                result[k] = decrypt_sensitive_fields(v, nested_keys)
            # Liste rekursiv prüfen
            elif isinstance(v, list):
                result[k] = [decrypt_sensitive_fields(item, sensitive_keys) if isinstance(item, dict) else item for item in v]
            else:
                result[k] = v
        return result
    elif isinstance(data_dict, list):
        return [decrypt_sensitive_fields(item, sensitive_keys) if isinstance(item, dict) else item for item in data_dict]
    else:
        return data_dict