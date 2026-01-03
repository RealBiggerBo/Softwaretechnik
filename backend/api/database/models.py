from django.db import models
from datetime import date

#Aufzählungen für Wahl-Felder
class Beratungsstelle(models.TextChoices):
    STADT = "S", "Stadt Leipzig"
    LAND = "L", "Landkreis Leipzig"
    NORDSACHSEN = "N", "Landkreis Nordsachsen"

class Ort(models.TextChoices):
    STADT = "S", "Stadt Leipzig"
    LAND = "L", "Landkreis Leipzig"
    NORDSACHSEN = "N", "Landkreis Nordsachsen"
    SACHSEN = "B", "Sachsen"
    ANDERES = "A", "Anderes"

class RolleAnfrage(models.TextChoices):
    FACHKRAFT = "F", "Fachkraft"
    ANGEHÖRIG = "A", "Angehörige:r"
    BETROFFEN = "B", "Betroffene:r"
    ANONYM = "U", "anonym"
    BETROFFEN_QUEER = "qB", "queer Betroffene:r"
    FACHKRAFT_QUEER = "qF", "queer Fachkraft"
    ANGEHÖRIG_QUEER = "qA", "queer Angehörige:r"
    ANONYM_QUEER = "qU", "queer anonym"
    FACHKRAFT_FÜR_BETROFFEN = "FfB", "Fachkraft für Betroffene:r"
    ANGEHÖRIG_FÜR_BETROFFEN = "AfB", "Angehörige:r für Betroffene:r"
    FACHKRAFT_FÜR_BETROFFEN_QUEER = "FfqB", "Fachkraft für queere Betroffene:r"
    ANGEHÖRIG_FÜR_BETROFFEN_QUEER = "AfqB", "Angehörige:r für queere Betroffene:r"

class ArtAnfrage(models.TextChoices):
    MEDIZINISCHE_HILFE = "MSH", "medizinische Soforthilfe"
    SPURENSICHERUNG = "VSS", "Vertrauliche Spurensicherung"
    BERATUNG = "B", "Beratungsbedarf"
    BERATUNG_RECHT = "BR", "Beratungsbedarf zu Rechtlichem"
    SONSTIGES = "S", "Sonstiges"

class RolleFall(models.TextChoices):
    BETROFFEN = "B", "Betroffene:r"
    ANGEHÖRIG = "A", "Angehörige:r"
    FACHKRAFT = "F", "Fachkraft"

# Create your models here.
class Anfrage(models.Model):
    wie = models.CharField(max_length=200)
    datum = models.DateField(default=date.today)
    ort = models.CharField(max_length=1, choices=Ort)
    rolle = models.CharField(max_length=4, choices=RolleAnfrage)
    art = models.CharField(max_length=3, choices=ArtAnfrage)
    termin = models.BooleanField()
    termin_ort = models.CharField(max_length=1, choices=Beratungsstelle)
    termin_datum = models.DateField(default=date.today)

    def __str__(self):
        return self.wie

class Fall(models.Model):
    alias = models.CharField(max_length=50)
    rolle = models.CharField(max_length=1, choices=RolleFall)
    alter = models.IntegerField(blank=True)
    # identität = 
    # sexualität =
    # wohnort =
    # staatsangehörigkeit =
    # beruf = 
    # schwerbehinderung =
    # schwerbehinderung_form =
    # schwerbehinderung_grad = 
    # notizen =

    def __str__(self):
        return self.alias

# year_in_school = models.CharField(max_length=2, choices=YearInSchool, default=YearInSchool.FRESHMAN,)