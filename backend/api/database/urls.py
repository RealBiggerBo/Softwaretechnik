from django.urls import path
from . import views

urlpatterns = [
    path("list/<str:type>", views.ListAPI.as_view()),
    path("data/<str:type>/<int:pk>/", views.DataAPI.as_view()),
    path("search/<str:type>", views.SearchAPI.as_view()),
    path("data_record", views.DataRecordAPI.as_view()),
]
