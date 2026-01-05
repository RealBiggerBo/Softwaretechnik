from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Anfrage, Fall
from .serializers import AnfrageSerializer, FallSerializer

@api_view(["GET"])
def get_list(request, type):
    if type == "anfrage":
        """
        Listet alle Anfragen auf.
        """
        anfragen = Anfrage.objects.all()
        serializer = AnfrageSerializer(anfragen, many=True)
    else:
        """
        Listet alle Fälle auf.
        """
        fall_liste = Fall.objects.all()
        serializer = FallSerializer(fall_liste, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def save(request, type):
    if type == "anfrage":
        """
        Erstellt eine neue Anfrage.
        """
        serializer = AnfrageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        """
        Erstellt einen neuen Fall.
        """
        serializer = FallSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get(request, type, pk):
    if type == "anfrage":
        """
        Gibt eine Anfrage zurück.
        """
        try:
            anfrage = Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AnfrageSerializer(anfrage)
        return Response(serializer.data)
    else:
        """
        Gibt einen Fall zurück.
        """
        try:
            fall = Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = FallSerializer(fall)
        return Response(serializer.data)

@api_view(["PUT"])
def update(request, type, pk):
    if type == "anfrage":
        """
        Überschreibt eine Anfrage.
        """
        try:
            anfrage = Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AnfrageSerializer(anfrage, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        """
        Überschreibt einen Fall.
        """
        try:
            fall = Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = FallSerializer(fall, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
def delete(request, type, pk):
    if type == "anfrage":
        """
        Löscht eine Anfrage.
        """
        try:
            anfrage = Anfrage.objects.get(pk=pk)
        except Anfrage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        anfrage.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        """
        Löscht einen Fall.
        """
        try:
            fall = Fall.objects.get(pk=pk)
        except Fall.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        fall.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def search(request):
    return Response({"message": "Hello from Django API"})
