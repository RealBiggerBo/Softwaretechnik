from django.db import models
from datetime import date

#Aufzählungen für Wahl-Felder
class Beratungsstelle(models.TextChoices):
    "Stadt Leipzig"
    "Landkreis Leipzig"
    "Landkreis Nordsachsen"

class Ort(models.TextChoices):
    "Stadt Leipzig"
    "Landkreis Leipzig"
    "Landkreis Nordsachsen"
    "Sachsen"
    "Sonstiges"

class Rolle(models.TextChoices):
    "Betroffene:r"
    "Fachkraft"
    "Angehörige:r"
    "anonym"

class AnfrageArt(models.TextChoices):
    "medizinische Soforthilfe"
    "Vertrauliche Spurensicherung"
    "Beratungsbedarf"
    "Beratungsbedarf zu Rechtlichem"
    "Sonstiges"

class GeschlechtsIdentität(models.TextChoices):
    "cis weiblich"
    "trans weiblich"
    "trans männlich"
    "trans nicht binär"
    "inter"
    "agender"
    "divers"

class Sexualitaet(models.TextChoices):
    "lesbisch"
    "schwul"
    "bisexuell"
    "asexuell"
    "heterosexuell"

class BeruflicheSituation(models.TextChoices):
    "arbeitslos"
    "studierend"
    "berufstätig"
    "berentet"
    "Azubi"
    "berufsunfähig"

class BehinderungsForm(models.TextChoices):
    "kognitiv"
    "körperlich"

class BeratungsArt(models.TextChoices):
    "persönlich"
    "video"
    "telefon"
    "aufsuchend"
    "schriftlich"

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

class Quelle(models.TextChoices):
    "Selbstmeldung über Polizei"
    "Private Kontakte"
    "Beratungsstellen"
    "Internet"
    "Ämter"
    "Gesundheitswesen (Arzt/Ärztin)"
    "Rechtsanwälte/-anwältinnen"

class Geschlecht(models.TextChoices):
    M = "M", "männlich"
    W = "W", "weiblich"
    D = "D", "divers"

#Modelle
class Anfrage(models.Model):
    """Anfrage Data-Record"""
    sende_art = models.CharField(max_length=100)
    sende_datum = models.DateField()
    sende_ort = models.CharField(max_length=100, choices=Ort)
    sender_rolle = models.CharField(max_length=100, choices=Rolle)
    im_auftrag = models.BooleanField()
    ist_queer = models.BooleanField()
    anfrage_art = models.CharField(max_length=100, choices=AnfrageArt)
    mit_termin = models.BooleanField()
    termin_ort = models.CharField(max_length=100, choices=Beratungsstelle, blank=True)
    termin_datum = models.DateField(blank=True)

    def __str__(self):
        return self.sende_art

class Fall(models.Model):
    """Fall Data-Record"""

    #Personendaten
    alias = models.CharField(max_length=50)
    rolle = models.CharField(max_length=100, choices=Rolle)
    alter = models.IntegerField(blank=True)
    geschlechts_identitaet = models.CharField(max_length=100, choices=GeschlechtsIdentität, blank=True)
    sexualitaet = models.CharField(max_length=100, choices=Sexualitaet, blank=True)
    wohnort = models.CharField(max_length=100, choices=Ort, blank=True)
    staatsangehoerigkeit = models.CharField(max_length=100, default="Deutschland", blank=True)
    berufssituation = models.CharField(max_length=100, choices=BeruflicheSituation, blank=True)
    schwerbehinderung = models.BooleanField()
    schwerbehinderung_form = models.CharField(max_length=100, choices=BehinderungsForm, blank=True)
    schwerbehinderung_grad = models.CharField(max_length=100, blank=True)
    notizen = models.CharField(max_length=200, blank=True)

    #Beratungsdaten
    beratungsstelle = models.CharField(max_length=100, choices=Beratungsstelle)
    anzahl_beratungen = models.IntegerField(default=0)

    #Daten zur Gewalt

    #Daten zu den Gewaltfolgen
    depression = models.BooleanField()
    angststoerung = models.BooleanField()
    ptbs = models.BooleanField()
    anderes = models.BooleanField()
    burn_out = models.BooleanField()
    schlafstoerung = models.BooleanField()
    sucht = models.BooleanField()
    kommunikationsschwierigkeiten = models.BooleanField()
    vernachlaessigung_alltäglicher_dinge = models.BooleanField()
    schmerzen = models.BooleanField()
    laehmungen = models.BooleanField()
    krankheit = models.BooleanField()
    dauerhafte_beeintraechtigung = models.CharField(max_length=200, blank=True)
    finanzielle_folgen = models.BooleanField()
    arbeits_einschraenkung = models.BooleanField()
    verlust_arbeit = models.BooleanField()
    soziale_isolation = models.BooleanField()
    suizidalität = models.BooleanField()
    weiteres = models.CharField(max_length=200, blank=True)
    notizen_folgen = models.CharField(max_length=200, blank=True)

    #Daten zu Begleitungen
    begleitungen_gesamt = models.IntegerField(default=0)
    begleitungen_gerichte = models.IntegerField(default=0)
    begleitungen_polizei = models.IntegerField(default=0)
    begleitungen_rechtsanwaelte = models.IntegerField(default=0)
    begleitungen_aerzte = models.IntegerField(default=0)
    begleitungen_rechtsmedizin = models.IntegerField(default=0)
    begleitungen_jugendamt = models.IntegerField(default=0)
    begleitungen_sozialamt = models.IntegerField(default=0)
    begleitungen_jobcenter = models.IntegerField(default=0)
    begleitungen_beratungstellen = models.IntegerField(default=0)
    begleitungen_schutzeinrichtungen = models.IntegerField(default=0)
    begleitungen_schutzeinrichtungen_spezialisiert = models.IntegerField(default=0)
    begleitungen_interventionsstellen = models.IntegerField(default=0)
    begleitungen_sonstige = models.CharField(max_length=200, blank=True)

    #Daten zu Verweisen
    verweise_gesamt = models.IntegerField(default=0)
    verweise_gerichte = models.IntegerField(default=0)
    verweise_polizei = models.IntegerField(default=0)
    verweise_rechtsanwaelte = models.IntegerField(default=0)
    verweise_aerzte = models.IntegerField(default=0)
    verweise_rechtsmedizin = models.IntegerField(default=0)
    verweise_jugendamt = models.IntegerField(default=0)
    verweise_sozialamt = models.IntegerField(default=0)
    verweise_jobcenter = models.IntegerField(default=0)
    verweise_beratungstellen = models.IntegerField(default=0)
    verweise_schutzeinrichtungen = models.IntegerField(default=0)
    verweise_schutzeinrichtungen_spezialisiert = models.IntegerField(default=0)
    verweise_interventionsstellen = models.IntegerField(default=0)
    verweise_sonstige = models.CharField(max_length=200, blank=True)

    #Weitere Daten
    quelle = models.CharField(max_length=1, choices=Quelle, blank=True)
    andere_quelle = models.CharField(max_length=100, blank=True)
    dolmetsch_zeit = models.IntegerField(default=0)
    dolmetsch_sprache = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.alias

#Submodelle
class Beratung(models.Model):
    fall = models.ForeignKey(Fall, on_delete=models.CASCADE)
    datum = models.DateField(default=date.today)
    art = models.CharField(max_length=100, choices=BeratungsArt)
    stelle = models.CharField(max_length=100, choices=Beratungsstelle)
    notizen = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.fall}:{self.datum}"

class Gewalttat(models.Model):
    fall = models.ForeignKey(Fall, on_delete=models.CASCADE)
    alter = models.IntegerField(blank=True)
    zeitraum = models.IntegerField(blank=True)
    anzahl_vorfaelle = models.IntegerField(blank=True)
    anzahl_taeter = models.IntegerField(blank=True)
    sexuelle_belaestigung_oeffentlich = models.BooleanField(default=False)
    sexuelle_belaestigung_arbeit = models.BooleanField(default=False)
    sexuelle_belaestigung_privat = models.BooleanField(default=False)
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
    weitere = models.CharField(max_length=200, blank=True)
    tatort = models.CharField(max_length=1, choices=TatOrt)
    anzeige = models.CharField(max_length=1, choices=JaNeinUnentschieden)
    med_versorgung = models.BooleanField(blank=True)
    betroffene_kinder = models.IntegerField(blank=True)
    betroffene_kinder_direkt = models.IntegerField(blank=True)
    notizen = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.fall}"

class Taeter(models.Model):
    gewalttat = models.ForeignKey(Gewalttat, on_delete=models.CASCADE)
    geschlecht = models.CharField(max_length=1, choices=Geschlecht)
    beziehung = models.CharField(max_length=1, choices=Beziehung)

    def __str__(self):
        return f"{self.geschlecht}"

class DataRecord(models.Model):
    """
    Definiert die Struktur, das heißt die Felder
    mit Name, Erforderlichkeit und allen weiteren Werten,
    eines DataRecords.
    """
    name = models.CharField(max_length=100)
    structure = models.JSONField()
