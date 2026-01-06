import csv
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..database.models import *
from ..database.serializers import *

@api_view(["GET"])
def export(request, type):
    """
    Exportiert Anfragen oder Fälle als CSV (MVP).
    """

    if type == "anfrage":
        queryset = Anfrage.objects.all()
        serializer = AnfrageSerializer(queryset, many=True)
        filename = "anfragen_export.csv"

    elif type == "fall":
        queryset = Fall.objects.all()
        serializer = FallSerializer(queryset, many=True)
        filename = "faelle_export.csv"

    else:
        return Response(
            {"error": "Ungültiger Typ"},
            status=status.HTTP_400_BAD_REQUEST
        )

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    writer = csv.writer(response)

    data = serializer.data
    if not data:
        return response

    # Header
    writer.writerow(data[0].keys())

    # Daten
    for row in data:
        writer.writerow(row.values())

    return response
