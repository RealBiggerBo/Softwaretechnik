from django.db import models
from datetime import date

#Aufzählungen für Wahl-Felder
class Beratungsstelle(models.TextChoices):
    S = "S", "Stadt Leipzig"
    L = "L", "Landkreis Leipzig"
    N = "N", "Landkreis Nordsachsen"

class Ort(models.TextChoices):
    S = "S", "Stadt Leipzig"
    L = "L", "Landkreis Leipzig"
    N = "N", "Landkreis Nordsachsen"
    B = "B", "Sachsen"
    X = "X", "Sonstiges"
    #Es fehlt noch eine weitere Auswahl

class Rolle(models.TextChoices):
    B = "B", "Betroffene:r"
    F = "F", "Fachkraft"
    A = "A", "Angehörige:r"
    U = "U", "anonym"

class AnfrageArt(models.TextChoices):
    M = "M", "medizinische Soforthilfe"
    S = "S", "Vertrauliche Spurensicherung"
    B = "B", "Beratungsbedarf"
    R = "R", "Beratungsbedarf zu Rechtlichem"
    X = "X", "Sonstiges"

class Geschlecht(models.TextChoices):
    C = "C", "cis weiblich"
    T = "T", "trans weiblich"
    M = "M", "trans männlich"
    N = "N", "trans nicht binär"
    I = "I", "inter"
    A = "A", "agender"
    D = "D", "divers"

class Sexualitaet(models.TextChoices):
    L = "L", "lesbisch"
    S = "S", "schwul"
    B = "B", "bisexuell"
    A = "A", "asexuell"
    H = "H", "heterosexuell"

class BeruflicheSituation(models.TextChoices):
    L = "L", "arbeitslos"
    S = "S", "studierend"
    B = "B", "berufstätig"
    R = "R", "berentet"
    A = "A", "Azubi"
    U = "U", "berufsunfähig"

class BehinderungsForm(models.TextChoices):
    P = "P", "kognitiv"
    K = "K", "körperlich"

# Create your models here.
class Anfrage(models.Model):
    sende_art = models.CharField(max_length=200)
    sende_datum = models.DateField(default=date.today)
    sende_ort = models.CharField(max_length=1, choices=Ort)
    sender_rolle = models.CharField(max_length=1, choices=Rolle)
    im_auftrag = models.BooleanField()
    ist_queer = models.BooleanField()
    anfrage_art = models.CharField(max_length=1, choices=AnfrageArt)
    mit_termin = models.BooleanField()
    termin_ort = models.CharField(max_length=1, choices=Beratungsstelle, blank=True)
    termin_datum = models.DateField(blank=True)

    def __str__(self):
        return self.sende_art

class Fall(models.Model):
    alias = models.CharField(max_length=50)
    rolle = models.CharField(max_length=1, choices=Rolle)
    alter = models.IntegerField(blank=True)
    geschlecht = models.CharField(max_length=1, choices=Geschlecht, blank=True)
    sexualitaet = models.CharField(max_length=1, choices=Sexualitaet, blank=True)
    wohnort = models.CharField(max_length=1, choices=Ort, blank=True)
    staatsangehoerigkeit = models.CharField(max_length=1, choices=Ort)
    berufssituation = models.CharField(max_length=1, choices=BeruflicheSituation, blank=True)
    schwerbehinderung = models.BooleanField()
    schwerbehinderung_form = models.CharField(max_length=1, choices=BehinderungsForm)
    schwerbehinderung_grad = models.CharField(max_length=50)
    notizen = models.CharField(max_length=50)

    def __str__(self):
        return self.alias