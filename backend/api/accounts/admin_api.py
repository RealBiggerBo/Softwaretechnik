from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User, Group

# Liste aller Benutzer
class AdminUserListAPI(APIView):
    # Zugriff nur für Admins.
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Es werden alle Benutzer aus der Datenbank geholt. Dabei werden nur diese Felder zurückgegeben.
        users = User.objects.all().values("id", "username", "is_active", "is_staff", "date_joined")
        return Response(list(users))

# Benutzer löschen
class AdminUserDeleteAPI(APIView):
    # Nur Admins dürfen Konten löschen
    permission_classes = [IsAdminUser]

    def delete(self, request, user_id):
        try:
            # Es wird versucht den Benutzer mit der übergebenen ID zu finden.
            user = User.objects.get(id=user_id)

            # Löscht den Benutzer aus der Datenbank. Dann gibt es eine Erfolgsmeldung.
            user.delete()
            return Response({"message": "Benutzer gelöscht"})
        except User.DoesNotExist:
            # Es gibt keinen Benutzer mit dieser ID -> Fehlermeldung.
            return Response({"error": "Benutzer nicht gefunden"}, status=404)

# Passwort zurücksetzen        
class AdminResetPasswordAPI(APIView):
    # Nur Admins dürfen PW's zurücksetzen.
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        # Das neue Passwort wird aus der Anfrage gelesen.
        new_password = request.data.get("new_password")

        # Wurde kein neues PW übergeben, gibt es eine Fehlermeldung.
        if not new_password:
            return Response({"error": "Neues Passwort fehlt"}, status=400)

        try:
            # Der Benutzer wird anhand seiner ID gesucht.
            user = User.objects.get(id=user_id)

            # Das neue PW wird gesetzt und automatisch gehasht.
            user.set_password(new_password)
            user.save()

            # PW erfolgreich zurück gesetzt.
            return Response({"message": "Passwort zurückgesetzt"})
        except User.DoesNotExist:
            # Sollte der Benutzer nicht existieren, gibt es einen Error.
            return Response({"error": "Benutzer nicht gefunden"}, status=404)

# Nur der Admin darf Rollen ändern.        
class AdminChangeRoleAPI(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        role = request.data.get("role")

        # Prüft ob es eine gültige Rolle gibt.
        if role not in ["base_user", "extended_user", "admin_user"]:
            return Response({"error": "Ungültige Rolle"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Benutzer nicht gefunden"}, status=404)

        # Admin darf sich selbst nicht die rechte nehmen.
        if user == request.user and role != "admin_user":
            return Response({"error": "Du kannst dir selbst keine Adminrechte entziehen"}, status=403)

        # Es muss min. einen Admin geben.
        if (
            user.groups.filter(name="admin_user").exists()
            and role != "admin_user"
            and User.objects.filter(groups__name="admin_user").count() <= 1
        ):
            return Response({"error": "Mindestens ein Admin muss existieren"}, status=403)

        user.groups.clear()
        user.groups.add(Group.objects.get(name=role))

        user.is_staff = (role == "admin_user")
        user.save()

        return Response({"message": f"Rolle geändert zu {role}"})