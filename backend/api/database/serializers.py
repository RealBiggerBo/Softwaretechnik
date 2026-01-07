from rest_framework import serializers
from .models import *

class AnfrageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anfrage
        fields = ["sende_art",
                    "sende_datum",
                    "sende_ort",
                    "sender_rolle",
                    "im_auftrag",
                    "ist_queer",
                    "anfrage_art",
                    "mit_termin",
                    "termin_ort",
                    "termin_datum"]

class FallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fall
        fields = ["alias",
                    "rolle",
                    "alter",
                    "geschlechts_indentitaet",
                    "sexualitaet",
                    "wohnort",
                    "staatsangehoerigkeit",
                    "berufssituation",
                    "schwerbehinderung",
                    "schwerbehinderung_form",
                    "schwerbehinderung_grad",
                    "beratungsstelle",
                    "anzahl_beratungen",
                    "depression",
                    "angststoerung",
                    "ptbs",
                    "anderes",
                    "burn_out",
                    "schlafstoerung",
                    "sucht",
                    "kommunikationsschwierigkeiten",
                    "vernachlaessigung_alltäglicher_dinge",
                    "schmerzen",
                    "laehmungen",
                    "krankheit",
                    "dauerhafte_beeintraechtigung",
                    "finanzielle_folgen",
                    "arbeits_einschraenkung",
                    "verlust_arbeit",
                    "soziale_isolation",
                    "suizidalität",
                    "weiteres",
                    "notizen_folgen",
                    "begleitungen_gesamt",
                    "begleitungen_gerichte",
                    "begleitungen_polizei",
                    "begleitungen_rechtsanwaelte",
                    "begleitungen_aerzte",
                    "begleitungen_rechtsmedizin",
                    "begleitungen_jugendamt",
                    "begleitungen_sozialamt",
                    "begleitungen_jobcenter",
                    "begleitungen_beratungstellen",
                    "begleitungen_schutzeinrichtungen",
                    "begleitungen_schutzeinrichtungen_spezialisiert",
                    "begleitungen_interventionsstellen",
                    "begleitungen_sonstige",
                    "verweise_gesamt",
                    "verweise_gerichte",
                    "verweise_polizei",
                    "verweise_rechtsanwaelte",
                    "verweise_aerzte",
                    "verweise_rechtsmedizin",
                    "verweise_jugendamt",
                    "verweise_sozialamt",
                    "verweise_jobcenter",
                    "verweise_beratungstellen",
                    "verweise_schutzeinrichtungen",
                    "verweise_schutzeinrichtungen_spezialisiert",
                    "verweise_interventionsstellen",
                    "verweise_sonstige",
                    "quelle",
                    "andere_quelle",
                    "dolmetsch_zeit",
                    "dolmetsch_sprache",
                    "notizen"]

class BeratungSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beratung
        fields = ["fall",
                    "datum",
                    "art",
                    "stelle",
                    "notizen"]

class GewalttatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gewalttat
        fields = ["fall",
                    "alter",
                    "zeitraum",
                    "anzahl_vorfaelle",
                    "anzahl_taeter",
                    "sexuelle_belaestigung_oeffentlich",
                    "sexuelle_belaestigung_arbeit",
                    "sexuelle_belaestigung_privat",
                    "vergewaltigung",
                    "versuchte_vergewaltigung",
                    "sexueller_missbrauch",
                    "sexueller_missbrauch_kindheit",
                    "sexuelle_noetigung",
                    "rituelle_gewalt",
                    "zwangsprostitution",
                    "sexuelle_ausbeutung",
                    "upskirting",
                    "catcalling",
                    "digitale_sexuelle_gewalt",
                    "spiking",
                    "weitere",
                    "tatort",
                    "anzeige",
                    "med_versorgung",
                    "betroffene_kinder",
                    "betroffene_kinder_direkt",
                    "notizen"]

class TaeterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taeter
        fields = ["gewalttat",
                    "geschlecht",
                    "beziehung"]

class DataRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataRecord
        fields = ["name",
                    "structure"]
