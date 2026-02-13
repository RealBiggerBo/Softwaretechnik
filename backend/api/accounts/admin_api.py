from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.accounts.permissions import IsAdminUser
from django.contrib.auth.models import User, Group
from .serializers import RegisterSerializer

# API für die Registrierung.
class AdminUserRegisterAPI(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        # Die Angefragten Daten werden an den Serializer übergeben.
        serializer = RegisterSerializer(data=request.data)
        
        # Prüfen ob die Daten stimmen, falls nicht gibt es eine Fehlermeldung.
        if serializer.is_valid():
            # Der Benutzer wird erstellt und es gibt eine Erfolgsmeldung.
            serializer.save()
            return Response({"debug": "Benutzer erfolgreich angelegt"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Liste aller Benutzer:
class AdminUserListAPI(APIView):
    # Zugriff nur für Admins.
    permission_classes = [IsAdminUser]

    def get(self, request):
        users_data = [] 
        # Es werden alle Benutzer aus der Datenbank geholt. Dabei werden diese Felder zurückgegeben.
        for user in User.objects.all():
            if request.user.is_superuser:
                role = "admin_user"
            else:
                role = user.groups.values_list("name", flat=True).first()

            users_data.append({
                "id": user.id,
                "username": user.username,
                "is_active": user.is_active,
                "date_joined": user.date_joined,
                "role": role,
            })
        return Response(users_data)

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
            return Response({"debug": "Benutzer gelöscht"})
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
            return Response({"debug": "Passwort zurückgesetzt"})
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

        # # Löscht alle aktuellen Gruppen des Benutzers.
        # user.groups.clear()
        
        # # Fügt die neue Rolle als Gruppe hinzu.
        # user.groups.add(Group.objects.get(name=role))

        # Löscht alle alten Gruppen, setzt die neue und sorgt dafür, dass es nur eine Rolle
        group = Group.objects.get(name=role) 
        user.groups.set([group])

        # is_staff wird True gesetzt, wenn es eine Admin ist, wenn nicht auf False
        user.is_staff = (role == "admin_user")
        user.save()

        # Erfolgreich die Rolle geändert
        return Response({"debug": f"Rolle geändert zu {role}"})