from rest_framework.permissions import BasePermission

# Basis Benutzer
class IsBaseUser(BasePermission):
    def has_permission(self, request, view):
        # Es wird geprüft ob der Nutzer angemeldet ist und ob er zu einer der 3 zugelassenen Gruppen gehört.
        return request.user.is_authenticated and request.user.groups.filter(
            name__in=["base_user", "extended_user", "admin_user"]
        ).exists()

# Erweiterter Benuter
class IsExtendedUser(BasePermission):
    def has_permission(self, request, view):
        # Es wird geprüft ob der Nutzer angemeldet ist und ob er zu einer der 2 zugelassenen Gruppe gehört.
        return request.user.is_authenticated and request.user.groups.filter(
            name__in=["extended_user", "admin_user"]
        ).exists()

# Admin
class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False
        
        # Superuser darf Immer
        if user.is_superuser:
            return True

        # Normale Admins
        return user.groups.filter(name="admin_user").exists()