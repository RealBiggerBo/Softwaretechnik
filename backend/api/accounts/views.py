from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ChangePasswordSerializer, LastRequestSerializer
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
        if request.user.is_superuser:
            role = "admin_user"
        else:
            role = request.user.groups.values_list("name", flat=True).first()
        # Die Basisinformationen des Nutzers werden zurückgegeben.
        return Response({
            "id": request.user.id, 
            "username": request.user.username, 
            "role": role,
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

class LastRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Letzte Anfrage/Fall-ID abrufen"""
        last_id = getattr(request.user.profile, "last_request_id", None)
        return Response({"last_request_id": last_id})

    def post(self, request):
        """Letzte Anfrage/Fall-ID speichern"""
        serializer = LastRequestSerializer(data=request.data)
        if serializer.is_valid():
            request.user.profile.last_request_id = serializer.validated_data['last_request_id']
            request.user.profile.save()
            return Response({"debug": "Last request ID gespeichert"})
        return Response(serializer.errors, status=400)