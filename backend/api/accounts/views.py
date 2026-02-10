from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ChangePasswordSerializer
from api.accounts.permissions import IsBaseUser, IsExtendedUser

# API für den Login.
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        # Die Login-Daten werden ausgelesen.
        username = request.data.get('username')
        password = request.data.get('password')

        # Der Benutzer wird Authentifiziert.
        user = authenticate(username=username, password=password)
        if user:
            # Es wird ein Token für den Benutzer erstellt/geholt.
            token, created = Token.objects.get_or_create(user=user)
            
            # Das Token wird an den Client zurückgegeben.
            return Response({"token": token.key})
        
        # Schlägt der Login fehl gibt es eine Fehlermeldung.
        return Response({"error": "Login fehlgeschlagen"}, status=status.HTTP_401_UNAUTHORIZED)

# API für den Logout.    
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Die aktuelle Session wird beendet und es gibt eine Bestätigung.
        request.user.auth_token.delete()
        return Response({"debug": "Logout erfolgreich"})
    
class MeAPIView(APIView):
    # Der Endpoint darf nur von eingeloggten Benutzern verwendet werden.
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = list(request.user.groups.values_list("name", flat=True))
        # Die Basisinformationen des Nutzers werden zurückgegeben.
        return Response({
            "id": request.user.id, 
            "username": request.user.username, 
            "roles": roles,
            "is_staff": request.user.is_staff,
            })

# API für Passwort ändern.
class ChangePasswordAPI(APIView):
    # Nur angemeldete Benutzer dürfen ihr Passwort ändern.
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Holt die Daten aus der Anfrage und übergibt sie an den Serializer
        serializer = ChangePasswordSerializer(data=request.data)

        # Wenn die Daten nicht stimmen, Fehlermeldung zurückgeben.
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Benutzer ist aktuell eingeloggt.
        user = request.user

        # überprüft ob das alte PW korrekt ist. Wenn nicht gibt es eine Fehlermeldung
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"error": "Aktuelles Passwort ist falsch"}, status=status.HTTP_400_BAD_REQUEST)

        # Das neue PW wird gesetzt und in der Datenbank gespeichert
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # Gibt eine Erfolgsmeldung zurück.
        return Response({"debug": "Passwort erfolgreich geändert"}, status=status.HTTP_200_OK)

# # API's für die Rollen Permissions:

# # Aktuell noch nicht fertig/im Aufbau!

# API für Datensätze anlegen
class CreateDatasetAPI(APIView):
    permission_classes = [IsBaseUser]

    def post(self, request):
        # Beispiel-Datenverarbeitung
        data = request.data
        # dataset = Dataset.objects.create(...)
        return Response({"debug": "Datensatz angelegt"}, status=status.HTTP_201_CREATED)

# API für Datensätze bearbeiten
class UpdateDatasetAPI(APIView):
    permission_classes = [IsBaseUser]

    def put(self, request, dataset_id):
        # dataset = Dataset.objects.get(id=dataset_id)
        # dataset.update(...)
        return Response({"debug": "Datensatz aktualisiert"})

# API für Statistik abrufen
class StatisticsAPI(APIView):
    permission_classes = [IsBaseUser]

    def get(self, request):
        stats = {
            "count": 42,
            "avg": 12.3
        }
        return Response(stats)
    
# API um eigene Presets zu speichern/löschen
class UserPresetAPI(APIView):
    permission_classes = [IsBaseUser]

    def post(self, request):
        # Preset speichern
        return Response({"debug": "Preset gespeichert"})

    def delete(self, request, preset_id):
        # Preset löschen
        return Response({"debug": "Preset gelöscht"})

# API um geteilte Presets zuerstellen
class SharedPresetCreateAPI(APIView):
    permission_classes = [IsBaseUser]

    def post(self, request):
        return Response({"debug": "Geteiltes Preset erstellt"})

# API um geteilte Presets zulöschen
class SharedPresetDeleteAPI(APIView):
    permission_classes = [IsExtendedUser]

    def delete(self, request, preset_id):
        return Response({"debug": "Geteiltes Preset gelöscht"})

# API um Formularfelder zuerweitern
class CreateFormFieldAPI(APIView):
    permission_classes = [IsExtendedUser]

    def post(self, request):
        return Response({"debug": "Formularfeld erstellt"})