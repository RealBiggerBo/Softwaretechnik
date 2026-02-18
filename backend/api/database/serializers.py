from rest_framework import serializers
from .models import *

class AnfrageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anfrage
        fields = ["pk",
                    "structure"]
    
    def validate(self, data):
        """
        Prüft Anfrage auf Korrektheit
        """

        return datarecord_validation(data)

class FallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fall
        fields = ["pk",
                    "structure"]
    
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
        elif not isinstance(field["name"], str):
            raise serializers.ValidationError("Wert mit falschen Typ für name übergeben. Der richtige Typ ist String.")
        
        if "type" not in field:
            raise serializers.ValidationError("Erforderliches Feld, type, wurde nicht übergeben.")
        elif not isinstance(field["type"], str):
            raise serializers.ValidationError("Wert mit falschen Typ für type übergeben. Der richtige Typ ist String.")
        elif field["type"] not in ["Boolean", "Date", "Integer", "List", "String"]:
            raise serializers.ValidationError("Wert für type darf nur Boolean, Date, Integer, List oder String sein.")
        
        if "required" not in field:
            raise serializers.ValidationError("Erforderliches Feld, required, wurde nicht übergeben.")
        elif not isinstance(field["required"], bool):
            raise serializers.ValidationError("Wert mit falschen Typ für required übergeben. Der richtige Typ ist Boolean.")
        
        if field["type"] == "String" and "maxLength" not in field:
            raise serializers.ValidationError("Für String erforderliches Feld, maxLength, wurde nicht übergeben.")
        
        if field["type"] == "List" and "element" not in field:
            raise serializers.ValidationError("Für Liste erforderliches Feld, element, wurde nicht übergeben.")

    return data
