from rest_framework import serializers
from api.database.models import DataSet
from .models import *
import logging

logger = logging.getLogger(__name__)

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
    values = serializers.JSONField() 
    decrypted_values = serializers.SerializerMethodField()
    class Meta:
        model = DataSet
        fields = ["pk",
                    "data_record",
                    "version",
                    "values",
                    "decrypted_values"]
        
    def get_decrypted_values(self, obj):
      return obj.get_decrypted_values()

def datarecord_validation(data):
    field_names = data["structure"]
    for field_name in field_names:
        field = field_names[field_name]
        field_type = field["type"]

        for attribute in field:
            if attribute not in ["name", "type", "required", "sensitive", "possibleValues", "element"]:
                field.pop(attribute)

        if "name" not in field:
            raise serializers.ValidationError("Erforderliches Feld, name, wurde nicht übergeben.")
        elif not isinstance(field["name"], str):
            raise serializers.ValidationError("Wert mit falschen Typ für name übergeben. Der richtige Typ ist String.")
        
        if "type" not in field:
            raise serializers.ValidationError("Erforderliches Feld, type, wurde nicht übergeben.")
        elif not isinstance(field_type, str):
            raise serializers.ValidationError("Wert mit falschen Typ für type übergeben. Der richtige Typ ist String.")
        elif field_type not in ["Boolean", "Date", "Group", "Integer", "List", "String"]:
            raise serializers.ValidationError("Wert für type darf nur Boolean, Date, Group, Integer, List oder String sein.")
        
        if "required" not in field:
            raise serializers.ValidationError("Erforderliches Feld, required, wurde nicht übergeben.")
        elif not isinstance(field["required"], bool):
            raise serializers.ValidationError("Wert mit falschen Typ für required übergeben. Der richtige Typ ist Boolean.")
        
        if "sensitive" not in field:
            raise serializers.ValidationError("Erforderliches Feld, sensitive, wurde nicht übergeben.")
        elif not isinstance(field["required"], bool):
            raise serializers.ValidationError("Wert mit falschen Typ für sensitive übergeben. Der richtige Typ ist Boolean.")
        
        if "possibleValues" in field and field_type != "String":
            field.pop("possibleValue")
        
        if field_type == "Group" or field_type == "List":
            if "element" not in field:
                raise serializers.ValidationError("Für Group und List erforderliches Feld, element, wurde nicht übergeben.")
            else:
                pass #TODO
        else:
            if "element" in field:
                field.pop("element")

    return data
