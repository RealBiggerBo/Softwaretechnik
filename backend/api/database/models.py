from django.db import models
from datetime import date
from api.utils.encryption import encrypt, decrypt
from api.database.encryption_utils import get_sensitive_fields

#DataRecords
class Anfrage(models.Model):
    """
    Definiert die Struktur einer Anfrage
    """

    structure = models.JSONField()

class Fall(models.Model):
    """
    Definiert die Struktur eines Falls
    """

    structure = models.JSONField()

class DataRecord(models.TextChoices):
    ANFRAGE = "Anfrage", "Anfrage"
    FALL = "Fall", "Fall"

class DataSet(models.Model):
    """
    Der Datensatz als JSON,
    gibt zudem an, als welcher DataRecord und in welcher Version dieser gespeichert wurde.
    """

    data_record = models.CharField(max_length=50, choices=DataRecord)
    version = models.IntegerField()
    values = models.JSONField()
    
    def save(self, *args, **kwargs):
        sensitive_fields = get_sensitive_fields(self.data_record, self.version)

        def recursive_encrypt(values, sensitive_fields, parent_key=""):
            encrypted = {}
            for key, value in values.items():
                full_key = f"{parent_key}.{key}" if parent_key else key

                if isinstance(value, dict):
                    encrypted[key] = recursive_encrypt(value, sensitive_fields, full_key)
                elif full_key in sensitive_fields and value not in (None, ""):
                    encrypted[key] = encrypt(value, full_key)
                else:
                    encrypted[key] = value
            return encrypted

        self.values = recursive_encrypt(self.values, sensitive_fields)
        super().save(*args, **kwargs)

    def get_decrypted_values(self):

        sensitive_fields = get_sensitive_fields(self.data_record, self.version)

        def recursive_decrypt(values, sensitive_fields, parent_key=""):
            decrypted = {}
            for key, value in values.items():
                full_key = f"{parent_key}.{key}" if parent_key else key

                if isinstance(value, dict):
                    decrypted[key] = recursive_decrypt(value, sensitive_fields, full_key)
                elif full_key in sensitive_fields and isinstance(value, str):
                    try:
                        decrypted[key] = decrypt(value, full_key)
                    except Exception:
                        decrypted[key] = value
                else:
                    decrypted[key] = value
            return decrypted

        return recursive_decrypt(self.values, sensitive_fields)