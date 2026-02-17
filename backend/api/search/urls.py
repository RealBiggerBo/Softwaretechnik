from django.urls import path
from .views import search_execute

urlpatterns = [
    path("execute", search_execute, name="search-execute"),
]