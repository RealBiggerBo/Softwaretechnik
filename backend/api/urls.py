from django.urls import path
from .views import hello_world, ping
from .views_stats import case_stats
from .views_export import export_cases_csv

urlpatterns = [
    path('hello/', hello_world, name='hello-world'),
    path('stats/cases/', case_stats, name='case-stats'),
    path('export/cases/', export_cases_csv, name='case-export'),
    path('auth/ping/', ping),
]

