from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated

class RegisterAPI(APIView):
    # Es darf sich jeder Registrieren.
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Die gesendeten Daten werden an den Serializer übergeben.
        serializer = RegisterSerializer(data=request.data)
        
        # Diese Anweisung prüft alle Validierungen im Serializer.
        if serializer.is_valid():
            # Der Benutzer wird in der Datenbank erstellt/angelegt.
            serializer.save()

            return Response(
                {"message": "Registrierung erfolgreich"},
                status=status.HTTP_201_CREATED
            )
        # Sollte die Validierung fehlschlagen wird ein Error zurückgegeben.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(APIView):
    # Jeder darf sich versuchen sich einzulogen.
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Aus der Anfrage werden Nutzername und Passwort gelesen.
        username = request.data.get('username')
        password = request.data.get('password')

        # Es wird überprüft ob Benutzername und Passwort übereinstimmen.
        user = authenticate(request, username=username, password=password)
        
        # Schlägt der Login fehl gibt es einen Fehlermeldung.
        if user is None:
            return Response(
                {"error": "Login fehlgeschlagen"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Der Benutzer wird eingelogt und es gibt eine Bestätigung.
        login(request, user)
        return Response({"message": "Login erfolgreich"})


class LogoutAPI(APIView):
    def post(self, request):
        # Die aktuelle Session wird beendet und es gibt eine Bestätigung.
        logout(request)
        return Response({"message": "Logout erfolgreich"})


class MeAPI(APIView):
    # Der Endpoint darf nur von eingeloggten Benutzern verwendet werden.
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Dies ist der aktuell eingeloggte Nutzer.
        user = request.user
        
        # Rolle aus Django Groups lesen
        group = user.groups.first()
        role = group.name if group else "base_user"

        # Die Basisinformationen des Nutzers werden zurückgegeben.
        return Response({
            "id": user.id,
            "username": user.username,
            "role": role,
            "is_admin": user.is_staff,
        })