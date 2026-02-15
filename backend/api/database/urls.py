from django.urls import path
from . import views

urlpatterns = [
    path("data/<str:type>", views.DataAPI.as_view()),
    path("data_record/<str:type>", views.DataRecordAPI.as_view()),
    path("data_record_admin/<str:type>", views.DataRecordAdminAPI.as_view()),
    path("search/<str:type>", views.SearchAPI.as_view()),
]
