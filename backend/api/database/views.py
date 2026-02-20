from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.accounts.permissions import IsExtendedUser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
from api.database.encryption_utils import decrypt_sensitive_fields, get_sensitive_fields

class DataAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_data(self, type, pk):
        if not type_is_valid(type):
            return Response({"error": "ungültiger Typ"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = DataSet.objects.get(pk=pk)
        except DataSet.DoesNotExist:
            raise Http404

        if data == None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        return data
        
    def delete(self, request, type):
        """
        Löscht einen Datensatz.
        """

        data = self.get_data(type, request.GET.get("id", None))

        if isinstance(data, Response):
            return data

        data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, type):
        """
        Gibt einen Datensatz zurück.
        """

        data = self.get_data(type, request.GET.get("id", None))

        if isinstance(data, Response):
            return data

        serializer = DataSetSerializer(data)

        return Response(serializer.data)

    def post(self, request, type):
        """
        Erstellt einen neuen Datensatz.
        """

        if not type_is_valid(type):
            return Response({"error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DataSetSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        structure = get_data_record(data["version"], data["data_record"].lower()).data["structure"]
        values = data.get("values", {})
        
        dataset_validation(structure, values)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def put(self, request, type):
        """
        Überschreibt einen Datensatz.
        """

        data = self.get_data(type, request.GET.get("id", None))

        if isinstance(data, Response):
            return data

        serializer = DataSetSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        structure = get_data_record(data["version"], data["data_record"].lower()).data["structure"]
        values = data.get("values", {})
        
        dataset_validation(structure, values)

        serializer.save()
        return Response(serializer.data)

class DataRecordAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, type):
        """
        Gibt die Struktur eines DataRecords zurück.
        """

        id = request.GET.get("id", None)
        type_lower = type.lower()

        # Daten aus dem passenden Model holen
        if type_lower == "anfrage":
            try:
                record = Anfrage.objects.get(pk=id) if id else Anfrage.objects.last()
            except Anfrage.DoesNotExist:
                return Response({"error": "Anfrage nicht gefunden"}, status=status.HTTP_404_NOT_FOUND)
        elif type_lower == "fall":
            try:
                record = Fall.objects.get(pk=id) if id else Fall.objects.last()
            except Fall.DoesNotExist:
                return Response({"error": "Fall nicht gefunden"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Ungültiger Typ"}, status=status.HTTP_400_BAD_REQUEST)

        # Serializer auf das Model anwenden
        serializer = AnfrageSerializer(record) if type_lower == "anfrage" else FallSerializer(record)
        serializer_data = serializer.data  # hier sind die Werte noch verschlüsselt

        # Sensible Felder ermitteln (Modelname groß)
        model_name = "Anfrage" if type_lower == "anfrage" else "Fall"
        sensitive_keys = get_sensitive_fields(model_name, id)

        # Entschlüsseln
        decrypted_values = decrypt_sensitive_fields(serializer_data.get("values") or {}, sensitive_keys)

        # Neues Dict für Response
        response_data = {
            "pk": serializer_data.get("pk"),
            "structure": serializer_data.get("structure"),
            "values": decrypted_values
        }

        return Response(response_data, status=status.HTTP_200_OK)

class DataRecordAdminAPI(APIView):
    permission_classes = [IsExtendedUser]

    def post(self, request, type):
        """
        Erstellt eine neue Version eines DataRecords.
        """

        if not type_is_valid(type):
            return Response({"error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AnfrageSerializer(data=request.data) if type == "anfrage" else FallSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DataRecordListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, type):
        """
        Gibt alle Versionen eines DataRecords zurück.
        """

        data_record = Anfrage if type == "anfrage" else Fall
        objekt = data_record.objects.all()
        serializer = AnfrageSerializer(objekt, many=True) if type == "anfrage" else FallSerializer(objekt, many=True)

        return Response(serializer.data)

def type_is_valid(type):
    return type in ["anfrage", "fall"]

def get_data_record(id, type):
    try:
        data_record = Anfrage if type == "anfrage" else Fall
        objekt = data_record.objects.get(pk=id) if id != None else data_record.objects.last()
    except data_record.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = AnfrageSerializer(objekt) if type == "anfrage" else FallSerializer(objekt)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

def dataset_validation(structure, values):
    match = {
            "Boolean": bool,
            "Date": str,
            "Integer": int,
            "Group": object,
            "List": list,
            "String": str
        }
    
    for field_id in structure:
        field = structure[field_id]

        if field_id in values:
            field_type = field["type"]
            value = values[field_id]

            if not isinstance(value, match[field_type]):
                raise serializers.ValidationError(f"Wert mit falschen Typ für {field_id} übergeben. Der richtige Typ ist {match[field_type]}.")
            if field_type == "Date" and not (len(value) == 10 and
                                                value[4] == "-" and
                                                value[7] == "-" and
                                                value[:4].isdigit() and
                                                value[5:7].isdigit() and
                                                value[8:].isdigit()):
                raise serializers.ValidationError(f"Date-Wert in falschem Format übergeben. Das richtige Format ist YYYY-MM-DD.")
            if field_type == "Group":
                dataset_validation(field["element"], value)
            if field_type == "List":
                for element in value:
                    dataset_validation(field["element"], element)

        elif field["required"]:
            raise serializers.ValidationError(f"Erforderliches Feld, {field_id}, wurde nicht übergeben.")
