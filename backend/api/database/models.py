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

        encrypted = {}
        for key, value in self.values.items():
            if key in sensitive_fields and value is not None:
                encrypted[key] = encrypt(value, key)
            else:
                encrypted[key] = value

        self.values = encrypted
        super().save(*args, **kwargs)

    def get_decrypted_values(self):
        sensitive_fields = get_sensitive_fields(self.data_record, self.version)

        decrypted = {}
        for key, value in self.values.items():
            if key in sensitive_fields and value is not None:
                decrypted[key] = decrypt(value, key)
            else:
                decrypted[key] = value

        return decrypted