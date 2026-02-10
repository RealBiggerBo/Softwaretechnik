from rest_framework import serializers
from .models import *

class AnfrageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anfrage
        fields = ["structure"]

class FallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fall
        fields = ["structure"]

class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSet
        fields = ["data_record",
                    "version",
                    "values"]

    def validate(self, data):
        """
        Prüft DataSet auf Korrektheit
        """

        def type_string_to_type(type_string):
            """
            Bildet Typ-String auf den entsprechenden Python Datentyp ab
            """

            mapping = {
                "String": str,
                "Integer": int,
                "Date": str,
                "Boolean": bool
            }

            return mapping.get(type_string, None)

        data_record = data["data_record"]
        version = data["version"]
        structure = data["data_record"]
        data_set = data["values"]

        field_names = (structure, data_set)

        for field_name in field_names:
            if field_name not in structure:
                raise serializers.ValidationError("Unbekanntes Feld wurde übergeben.")

            structure_field = structure[field_name]

            if structure_field["required"] and not field_name in data_set:
                raise serializers.ValidationError("Erforderliches Feld wurde nicht übergeben.")
            
            field = data_set[field_name]

            if not isinstance(field, type_string_to_type(structure_field["type"])):
                raise serializers.ValidationError("Feld hat falschen Typ.")

            if isinstance(field, str):
                if len(field) > structure_field["max_length"]:
                    raise serializers.ValidationError("Feld hat die maximale Zeichenzahl überschritten.")

                if field not in structure_field["possible_values"]:
                    raise serializers.ValidationError("Feld hat einen ungültigen Wert.")

        return data
