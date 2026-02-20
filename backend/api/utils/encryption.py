import base64
import os
from django.conf import settings
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag

PREFIX = "ENC1:"

def _key():
    key = base64.urlsafe_b64decode(settings.AES_KEY)
    if len(key) != 32:
        raise ValueError("AES Key muss 32 Byte sein")
    return key

def encrypt(text: str, field_name: str) -> str:
    if text is None:
        return None

    if str(text).startswith(PREFIX):
        return text  

    aes = AESGCM(_key())
    nonce = os.urandom(12)

    ciphertext = aes.encrypt(nonce, str(text).encode(), field_name.encode())

    token = base64.b64encode(nonce + ciphertext).decode()
    return PREFIX + token


def decrypt(token: str, field_name: str) -> str:
    if token is None:
        return None

    if not str(token).startswith(PREFIX):
        return token  

    raw = base64.b64decode(token[len(PREFIX):])
    nonce, ct = raw[:12], raw[12:]

    aes = AESGCM(_key())

    try:
        return aes.decrypt(nonce, ct, field_name.encode()).decode()
    except InvalidTag:
        raise ValueError("Verschlüsselte daten wurden manipuliert oder der Schlüssel war falsch")