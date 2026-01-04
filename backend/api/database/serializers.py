from rest_framework import serializers
from .models import Anfrage, Fall

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
                    "geschlecht",
                    "sexualitaet",
                    "wohnort",
                    "staatsangehoerigkeit",
                    "berufssituation",
                    "schwerbehinderung",
                    "schwerbehinderung_form",
                    "schwerbehinderung_grad",
                    "quelle",
                    "dolmetsch_zeit",
                    "dolmetsch_sprache",
                    "notizen"]