from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Anfrage, Fall
from .serializers import AnfrageSerializer, FallSerializer

@api_view(["GET", "POST"])
def anfrage_liste(request):
    """
    Listet alle Anfragen auf, oder erstellt eine neue Anfrage.
    """
    if request.method == "GET":
        anfragen = Anfrage.objects.all()
        serializer = AnfrageSerializer(anfragen, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = AnfrageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
def anfrage_detail(request, pk):
    """
    Liest, überschreibt oder löscht eine Anfrage.
    """
    try:
        anfrage = Anfrage.objects.get(pk=pk)
    except Anfrage.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = AnfrageSerializer(anfrage)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = AnfrageSerializer(anfrage, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        anfrage.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET", "POST"])
def fall_liste(request):
    """
    Listet alle Fälle auf, oder erstellt einen neuen Fall.
    """
    if request.method == "GET":
        liste = Fall.objects.all()
        serializer = FallSerializer(liste, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = FallSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "DELETE"])
def fall_detail(request, pk):
    """
    Liest, überschreibt oder löscht einen Fall.
    """
    try:
        fall = Fall.objects.get(pk=pk)
    except Fall.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = FallSerializer(fall)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = FallSerializer(fall, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        fall.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)