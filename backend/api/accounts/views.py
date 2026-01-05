from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import ChangePasswordSerializer

# API für die Registrierung.
class RegisterAPIView(APIView):
    def post(self, request):
        # Die Angefragten Daten werden an den Serializer übergeben.
        serializer = RegisterSerializer(data=request.data)
        
        # Prüfen ob die Daten stimmen, falls nicht gibt es eine Fehlermeldung.
        if serializer.is_valid():
            # Der Benutzer wird erstellt und es gibt eine Erfolgsmeldung.
            serializer.save()
            return Response({"message": "Benutzer erfolgreich angelegt"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API für den Login.
class LoginAPIView(APIView):
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
    
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Die aktuelle Session wird beendet und es gibt eine Bestätigung.
        request.user.auth_token.delete()
        return Response({"message": "Logout erfolgreich"})
    
class MeAPIView(APIView):
    # Der Endpoint darf nur von eingeloggten Benutzern verwendet werden.
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Die Basisinformationen des Nutzers werden zurückgegeben.
        return Response({
            "id": request.user.id, 
            "username": request.user.username, 
            "is_staff": request.user.is_staff,
            })

class ChangePasswordAPI(APIView):
    # Nur angemeldete Benutzer dürfen ihr Passwort ändern.
    permission_classes = [permissions.IsAuthenticated]

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
        return Response({"message": "Passwort erfolgreich geändert"}, status=status.HTTP_200_OK)
