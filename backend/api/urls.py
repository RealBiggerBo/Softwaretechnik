from django.urls import path, include
from .views import hello_world

urlpatterns = [
    path('hello/', hello_world, name='hello-world'),
    path("stats/", include("api.stats.urls")),
]