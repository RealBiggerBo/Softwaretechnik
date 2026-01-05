from django.urls import path
from .api import RegisterAPI, LoginAPI, LogoutAPI, MeAPI

urlpatterns = [
    path('register/', RegisterAPI.as_view()),
    path('login/', LoginAPI.as_view()),
    path('logout/', LogoutAPI.as_view()),
    path('me/', MeAPI.as_view()),
]