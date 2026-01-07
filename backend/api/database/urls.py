from django.urls import path
# from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("list/<str:type>", views.ListAPI.as_view()),
    path("data/<str:type>/<int:pk>/", views.DataAPI.as_view()),
    path("search/<str:type>", views.SearchAPI.as_view()),
]

# urlpatterns = format_suffix_patterns(urlpatterns)
