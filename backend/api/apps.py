from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Untermodul laden, damit Modelle im stats-Paket registriert werden
        from .stats import models
