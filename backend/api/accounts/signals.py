from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group


# Erstellt die Rollen automatisch nach dem Migrate
@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    roles = ["base_user", "extended_user", "admin_user"]

    for role in roles:
        Group.objects.get_or_create(name=role)