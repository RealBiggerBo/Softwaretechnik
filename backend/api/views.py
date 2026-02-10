from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django API"})

@api_view(['GET']) 
def ping(request): 
    return Response({"status": "ok"})