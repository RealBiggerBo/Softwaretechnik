from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

def type_is_valid(type):
    return type in ["anfrage", "fall", "beratung", "gewalttat", "taeter"]

def get_serializer(request, type):
    if type == "anfrage":
        return AnfrageSerializer(data=request.data)
    elif type == "fall":
        return FallSerializer(data=request.data)
    elif type == "beratung":
        return BeratungSerializer(data=request.data)
    elif type == "gewalttat":
        return GewalttatSerializer(data=request.data)
    elif type == "taeter":
        return TaeterSerializer(data=request.data)

def get_data_record(type, pk):
    if type == "anfrage":
        try:
            return Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            raise Http404
    elif type == "fall":
        try:
            return Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            raise Http404
    elif type == "beratung":
        try:
            return Beratung.objects.get(pk=pk)
        except Beratung.DoesNotExist:
            raise Http404
    elif type == "gewalttat":
        try:
            return Gewalttat.objects.get(pk=pk)
        except Gewalttat.DoesNotExist:
            raise Http404
    elif type == "taeter":
        try:
            return Taeter.objects.get(pk=pk)
        except Taeter.DoesNotExist:
            raise Http404

class DataAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, type):
        """
        Erstellt ein neues DataRecord.
        """

        if not type_is_valid(type):
            return Response({"Error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = get_serializer(request, type)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get(self, request, type, pk):
        """
        Gibt ein DataRecord zurück.
        """

        if not type_is_valid(type):
            return Response({"Error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)
        
        data_record = get_data_record(type, pk)
        if data_record == None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if type == "anfrage":
            serializer = AnfrageSerializer(data_record)
        elif type == "fall":
            serializer = FallSerializer(data_record)
        elif type == "beratung":
            serializer = BeratungSerializer(data_record)
        elif type == "gewalttat":
            serializer = GewalttatSerializer(data_record)
        elif type == "taeter":
            serializer = TaeterSerializer(data_record)

        return Response(serializer.data)
    
    def put(self, request, type, pk):
        """
        Überschreibt ein DataRecord.
        """

        if not type_is_valid(type):
            return Response({"Error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)
        
        data_record = get_data_record(type, pk)
        if data_record == None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if type == "anfrage":
            return AnfrageSerializer(data_record, data=request.data)
        elif type == "fall":
            return FallSerializer(data_record, data=request.data)
        elif type == "beratung":
            return BeratungSerializer(data_record, data=request.data)
        elif type == "gewalttat":
            return GewalttatSerializer(data_record, data=request.data)
        elif type == "taeter":
            return TaeterSerializer(data_record, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)
    
    def delete(self, request, type, pk):
        """
        Löscht ein DataRecord.
        """
        
        if not type_is_valid(type):
            return Response({"Error": "ungültiges DataRecord"}, status=status.HTTP_400_BAD_REQUEST)
        
        data_record = get_data_record(type, pk)
        if data_record == None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data_record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
