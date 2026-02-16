from rest_framework import serializers
from .models import *

class AnfrageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anfrage
        fields = ["structure"]
    
    def validate(self, data):
        """
        Prüft Anfrage auf Korrektheit
        """

        return datarecord_validation(data)

class FallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fall
        fields = ["structure"]
    
    def validate(self, data):
        """
        Prüft Fall auf Korrektheit
        """

        return datarecord_validation(data)

class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSet
        fields = ["pk",
                    "data_record",
                    "version",
                    "values"]

def datarecord_validation(data):
    field_names = data["structure"]
    for field_name in field_names:
        field = field_names[field_name]

        if "name" not in field:
            raise serializers.ValidationError("Erforderliches Feld, name, wurde nicht übergeben.")
        
        if "type" not in field:
            raise serializers.ValidationError("Erforderliches Feld, type, wurde nicht übergeben.")
        
        if "required" not in field:
            raise serializers.ValidationError("Erforderliches Feld, required, wurde nicht übergeben.")
        
        if field["type"] == "String" and "maxLength" not in field:
            raise serializers.ValidationError("Für String erforderliches Feld, maxLength, wurde nicht übergeben.")
        
        if field["type"] == "List" and "element" not in field:
            raise serializers.ValidationError("Für Liste erforderliches Feld, element, wurde nicht übergeben.")

    return data
