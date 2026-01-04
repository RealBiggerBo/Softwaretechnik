from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("anfragen/", views.anfrage_liste),
    path("anfragen/<int:pk>/", views.anfrage_detail),
    path("faelle/", views.fall_liste),
    path("faelle/<int:pk>/", views.fall_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)