from django.urls import path
from . import views

urlpatterns = [
    path("data/<str:type>", views.DataAPI.as_view()),
    path("data_record", views.DataRecordAPI.as_view()),
    path("list/<str:type>", views.ListAPI.as_view()),
    path("search/<str:type>", views.SearchAPI.as_view()),
]
