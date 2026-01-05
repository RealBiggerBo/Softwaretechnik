from django.db import models
from django.conf import settings

class Case(models.Model):

    # EDITABLE: Kategorien anpassen / erweitern
    CATEGORY_CHOICES = [
        ("physical", "Körperlich"),
        ("psychological", "Psychisch"),
        ("sexual", "Sexuell"),
        ("financial", "Finanziell"),
        ("other", "Andere"),
    ]
    

    GENDER_CHOICES = [
        ("female", "weiblich"),
        ("male", "männlich"),
        ("other", "divers"),
        ("unknown", "unbekannt"),
    ]

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )

    # Zeitpunkt / Kategorie
    date_occurred = models.DateTimeField()
    reported_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    
    # weitere Felder
    severity = models.PositiveSmallIntegerField(default=1)
    victim_age = models.PositiveSmallIntegerField(null=True, blank=True)
    victim_gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default="unknown")
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=30, default="open")
    anonymized = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-date_occurred"]

    def __str__(self):
        return f"Case {self.pk} - {self.category} @ {self.date_occurred.date()}"