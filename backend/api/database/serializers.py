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
