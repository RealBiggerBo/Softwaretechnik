from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *

@api_view(["GET"])
def get_list(request, type):
    """
    Listet DataRecords auf.
    """
    if type == "anfrage":
        data_record_list = Anfrage.objects.all()
        serializer = AnfrageSerializer(data_record_list, many=True)
    else:
        data_record_list = Fall.objects.all()
        serializer = FallSerializer(data_record_list, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def save(request, type):
    """
    Erstellt ein neues DataRecord.
    """
    if type == "anfrage":
        serializer = AnfrageSerializer(data=request.data)
    else:
        serializer = FallSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get(request, type, pk):
    """
    Gibt ein DataRecord zurück.
    """
    if type == "anfrage":
        try:
            data_record = Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        try:
            data_record = Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = FallSerializer(data_record)
    return Response(serializer.data)

@api_view(["PUT"])
def update(request, type, pk):
    """
    Überschreibt ein DataRecord.
    """
    if type == "anfrage":
        try:
            data_record = Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        try:
            data_record = Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = FallSerializer(data_record, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
def delete(request, type, pk):
    """
    Löscht ein DataRecord.
    """
    if type == "anfrage":
        try:
            data_record = Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        try:
            data_record = Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    data_record.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def search(request):
    return Response({"message": "Hello from Django API"})
