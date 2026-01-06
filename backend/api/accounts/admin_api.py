from rest_framework.views import APIView
from rest_framework.response import Response
from api.accounts.permissions import IsAdminUser
from django.contrib.auth.models import User, Group

# Liste aller Benutzer:
class AdminUserListAPI(APIView):
    # Zugriff nur für Admins.
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Es werden alle Benutzer aus der Datenbank geholt. Dabei werden nur diese Felder zurückgegeben.
        users = User.objects.all().values("id", "username", "is_active", "is_staff", "date_joined")
        return Response(list(users))

# Benutzer löschen:
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

# Passwort zurücksetzen:        
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

# Rollen ändern:       
class AdminChangeRoleAPI(APIView):
    # Nur Admins dürfen die Rollen ändern.
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        # Die Rolle wird ausgelesen.
        role = request.data.get("role")

        # Prüft ob der Benutzer eine gültige Rolle hat, wenn nicht Fehlermeldung.
        if role not in ["base_user", "extended_user", "admin_user"]:
            return Response({"error": "Ungültige Rolle"}, status=400)

        # Es wird versucht den Benutzer über die angegebene ID zu finden, wenn nicht Fehlermeldung.
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Benutzer nicht gefunden"}, status=404)

        # Der Admin darf sich selbst nicht die Adminrechte entziehen.
        if user == request.user and role != "admin_user":
            return Response({"error": "Du kannst dir selbst keine Adminrechte entziehen"}, status=403)

        # Es wird sicher gestellt, dass es min. einen Admin im System gibt.
        # Prüfen:
        # 1. ob Nutzer derzeit ein Admin ist.
        # 2. ob Nutzer Admin ist und ihm die Admin Rolle entzogen werden soll.
        # 3. ob es aktuell nur einen Admin gibt.
        # Wenn etwas davon zutrifft gib es eine Fehlermeldung.
        if (
            user.groups.filter(name="admin_user").exists()  
            and role != "admin_user"                        
            and User.objects.filter(groups__name="admin_user").count() <= 1     
        ):
            return Response({"error": "Mindestens ein Admin muss existieren"}, status=403)

        # Löscht alle aktuellen Gruppen des Benutzers.
        user.groups.clear()
        
        # Fügt die neue Rolle als Gruppe hinzu.
        user.groups.add(Group.objects.get(name=role))

        # is_staff wird True gesetzt, wenn es eine Admin ist, wenn nicht auf False
        user.is_staff = (role == "admin_user")
        user.save()

        # Erfolgreich die Rolle geändert
        return Response({"message": f"Rolle geändert zu {role}"})