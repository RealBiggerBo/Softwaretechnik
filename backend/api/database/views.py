from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

class DataAPI(APIView):
    permission_classes = [IsAuthenticated]

    def type_is_valid(self, type):
        return type in ["anfrage", "fall"]
    
    def get_data(self, type, pk):
        if not self.type_is_valid(type):
            return Response({"Error": "ungültiger Typ"}, status=status.HTTP_400_BAD_REQUEST)

        if type == "anfrage":
            try:
                data = Anfrage.objects.get(pk=pk)
            except Anfrage.DoesNotExist:
                raise Http404
        elif type == "fall":
            try:
                data = Fall.objects.get(pk=pk)
            except Fall.DoesNotExist:
                raise Http404

        if data == None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        return data
        
    def delete(self, request, type):
        """
        Löscht einen Datensatz.
        """

        data = self.get_data(type, request.DELETE.get("id", None))

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

        if type == "anfrage":
            serializer = AnfrageSerializer(data)
        elif type == "fall":
            serializer = FallSerializer(data)

        return Response(serializer.data)

    def post(self, request, type):
        """
        Erstellt einen neuen Datensatz.
        """

        if not self.type_is_valid(type):
            return Response({"Error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)

        if type == "anfrage":
            serializer = AnfrageSerializer(data=request.data)
        elif type == "fall":
            serializer = FallSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def put(self, request, type):
        """
        Überschreibt einen Datensatz.
        """

        data = self.get_data(type, request.PUT.get("id", None))

        if isinstance(data, Response):
            return data

        if type == "anfrage":
            return AnfrageSerializer(data, data=request.data)
        elif type == "fall":
            return FallSerializer(data, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)

class DataRecordAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Gibt die Struktur eines DataRecords zurück.
        """

        try:
            data_record = DataRecord.objects.get(pk=request.GET.get("id", None))
        except DataRecord.DoesNotExist:
            Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DataRecordSerializer(data_record)

        return Response(serializer.data["structure"], status=status.HTTP_201_CREATED)
    
class ListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(request, type):
        """
        Listet DataRecords auf.
        """
        if type == "anfrage":
            data_record_list = Anfrage.objects.all()
            serializer = AnfrageSerializer(data_record_list, many=True)
        elif type == "fall":
            data_record_list = Fall.objects.all()
            serializer = FallSerializer(data_record_list, many=True)
        elif type == "beratung":
            data_record_list = Beratung.objects.all()
            serializer = BeratungSerializer(data_record_list, many=True)
        elif type == "gewalttat":
            data_record_list = Gewalttat.objects.all()
            serializer = GewalttatSerializer(data_record_list, many=True)
        elif type == "taeter":
            data_record_list = Taeter.objects.all()
            serializer = TaeterSerializer(data_record_list, many=True)
        else:
            return Response({"Error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

class SearchAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(request):
        return Response({"message": "Hello from Django API"})
