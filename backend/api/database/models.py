from django.db import models
from datetime import date

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