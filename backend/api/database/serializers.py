from rest_framework import serializers
from .models import *

class DataRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataRecord
        exclude = ["id"]

class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSet
        fields = ["data_record",
                    "data"]
        depth = 1
