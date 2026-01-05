from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

# Muss mit "python manage.py create_roles" ausgeführt werden, um die Rollen zu erstellen.
class Command(BaseCommand):
    help = "Erstellt die Standard-Benutzerrollen"

    def handle(self, *args, **options):
        roles = ["base_user", "extended_user", "admin_user"]

        for role in roles:
            Group.objects.get_or_create(name=role)

        self.stdout.write(self.style.SUCCESS("Rollen erfolgreich erstellt"))