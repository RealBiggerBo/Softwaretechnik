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

class BeratungsArt(models.TextChoices):
    P = "P", "persönlich"
    V = "V", "video"
    T = "T", "telefon"
    A = "A", "aufsuchend"
    S = "S", "schriftlich"

class Beziehung(models.TextChoices):
    U = "U", "Unbekannte:r"
    B = "B", "Bekannte:r"
    P = "P", "Partner:in"
    A = "A", "Partner:in ehemalig"
    E = "E", "Ehepartner:in oder eingetragene:r Lebenspartner:in"
    F = "F", "andere:r Familienangehörige:r"
    X = "X", "Sonstige:r"

class TatOrt(models.TextChoices):
    S = "S", "Stadt Leipzig"
    L = "L", "Landkreis Leipzig"
    N = "N", "Landkreis Nordsachsen"
    B = "B", "Sachsen"
    D = "D", "Deutschland"
    A = "A", "Ausland"
    F = "F", "auf der Flucht"
    H = "H", "im Herkunftsland"

class JaNeinUnentschieden(models.TextChoices):
    J = "J", "Ja"
    N = "N", "Nein"
    U = "U", "noch nicht entschieden"

# Create your models here.
class Anfrage(models.Model):
    """Anfrage Data-Record"""
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
    """Fall Data-Record"""
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
    quelle = models.CharField(max_length=50)
    dolmetsch_zeit = models.IntegerField(default=0)
    dolmetsch_sprache = models.CharField(max_length=50, blank=True)
    notizen = models.CharField(max_length=50)

    def __str__(self):
        return self.alias

class Beratungen(models.Model):
    fall = models.OneToOneField(Fall, on_delete=models.CASCADE)
    beratungsstelle = models.CharField(max_length=1, choices=Beratungsstelle)
    anzahl_beratungen = models.IntegerField(default=0)

class Beratung(models.Model):
    fall = models.OneToOneField(Beratungen, on_delete=models.CASCADE)
    datum = models.DateField(default=date.today)
    art = models.CharField(max_length=1, choices=BeratungsArt)
    ort = models.CharField(max_length=1, choices=Beratungsstelle)
    notizen = models.CharField(max_length=50)

class Gewalttat(models.Model):
    alter = models.IntegerField(blank=True)
    zeitraum = models.IntegerField(blank=True)
    anzahl_vorfaelle = models.IntegerField(blank=True)
    anzahl_taeter = models.IntegerField(blank=True)
    tatort = models.CharField(max_length=1, choices=TatOrt)
    anzeige = models.CharField(max_length=1, choices=JaNeinUnentschieden)
    med_versorgung = models.BooleanField(blank=True)
    betroffene_kinder = models.IntegerField(blank=True)
    betroffene_kinder_direkt = models.IntegerField(blank=True)
    notizen = models.CharField(max_length=50)

class Taeter(models.Model):
    tat = models.ForeignKey(Gewalttat, on_delete=models.CASCADE)
    geschlecht = models.CharField(max_length=50)
    beziehung = models.CharField(max_length=1, choices=Beziehung)

class GewaltArt(models.Model):
    tat = models.ForeignKey(Gewalttat, on_delete=models.CASCADE)
    sexueller_belaestigung_oeffentlich = models.BooleanField(default=False)
    sexueller_belaestigung_arbeit = models.BooleanField(default=False)
    sexueller_belaestigung_privat = models.BooleanField(default=False)
    vergewaltigung = models.BooleanField(default=False)
    versuchte_vergewaltigung = models.BooleanField(default=False)
    sexueller_missbrauch = models.BooleanField(default=False)
    sexueller_missbrauch_kindheit = models.BooleanField(default=False)
    sexuelle_noetigung = models.BooleanField(default=False)
    rituelle_gewalt = models.BooleanField(default=False)
    zwangsprostitution = models.BooleanField(default=False)
    sexuelle_ausbeutung = models.BooleanField(default=False)
    upskirting = models.BooleanField(default=False)
    catcalling = models.BooleanField(default=False)
    digitale_sexuelle_gewalt = models.BooleanField(default=False)
    spiking = models.BooleanField(default=False)
    weitere = models.CharField(max_length=200)

class GewaltFolgen(models.Model):
    depression = models.BooleanField(default=False)
    angststoerung = models.BooleanField(default=False)
    ptbs = models.BooleanField(default=False)
    anderes = models.BooleanField(default=False)
    burn_out = models.BooleanField(default=False)
    schlafstoerung = models.BooleanField(default=False)
    sucht = models.BooleanField(default=False)
    kommunikationsschwierigkeiten = models.BooleanField(default=False)
    vernachlaessigung_alltäglicher_dinge = models.BooleanField(default=False)
    schmerzen = models.BooleanField(default=False)
    laehmungen = models.BooleanField(default=False)
    krankheit = models.BooleanField(default=False)
    dauerhafte_beeintraechtigung = models.CharField(max_length=50, blank=True)
    finanzielle_folgen = models.BooleanField(default=False)
    arbeits_einschraenkung = models.BooleanField(default=False)
    verlust_arbeit = models.BooleanField(default=False)
    soziale_isolation = models.BooleanField(default=False)
    suizidalität = models.BooleanField(default=False)
    sonstiges = models.BooleanField(default=False)
    notizen = models.CharField(max_length=50)

class Begleitungen(models.Model):
    anzahl = models.IntegerField()
    # wo

class Verweise(models.Model):
    anzahl = models.IntegerField()
    # wo