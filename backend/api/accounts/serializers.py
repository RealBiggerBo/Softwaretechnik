from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.core.validators import RegexValidator

# Der Validator erlaubt es nur Buchstaben und Zahlen im Username zu verwenden.
alnum_validator = RegexValidator(
    regex=r'[A-Za-z0-9]+$',
    #message="Nur Buchstaben und Zahlen erlaubt." # Kann man machen.. muss man nicht.
)

class RegisterSerializer(serializers.ModelSerializer):
    # Zweites Passwortfeld zur Bestätigung, ist nur bei der Registrierung relevant.
    password2 = serializers.CharField(write_only=True)

    # Die Maxiamlelänge des Benuternamens, aktuell auf 30 Zeichen begrenzt.
    username = serializers.CharField(max_length=30, validators=[alnum_validator])

    class Meta:
        # Es wird das intergrierte Django-User-Modell verwendet.
        model = User

        # Diese Felder müssen vom Client gesendet werden.
        fields = ['username', 'password', 'password2']

        # Sicherheitsmaßnahme: Passwörter dürfen nicht über die API ausgegeben werden.
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        # Prüfen ob die Passwörter ungleich sind, wenn ja gibt es eine Fehlermeldung.
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwörter stimmen nicht überein.")
        return data

    def create(self, validated_data):
        # Password2 wird entfernt, da es nicht im User-Modell existiert und nur für die Registrierung relevant ist.
        validated_data.pop('password2')

        # Es wird ein neuer Nuter erstellt, dabei wird das PW direkt gehasht.
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )

        # Setzte neuen Nutzer automatisch auf base_user.
        base_group = Group.objects.get(name="base_user")
        # Durch set() wird garantiert das es genau eine Rolle gibt.
        user.groups.set([base_group])
        return user
    
class ChangePasswordSerializer(serializers.Serializer):
    # Altes PW prüfen, wird nur geschrieben und nicht zurückgegeben.
    old_password = serializers.CharField(write_only=True)

    # Prüft das neue PW (und das Kontroll PW), wird auch nur geschrieben und nicht zurückgegeben. 
    new_password = serializers.CharField(write_only=True)
    new_password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        # Wenn die PW's nicht übereinstimmen, gibt es eine Fehlermeldung.
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError("Passwörter stimmen nicht überein.")
        return data
    
class LastCaseRequestSerializer(serializers.Serializer):
    last_request_id = serializers.IntegerField(required=False)
    last_case_id = serializers.IntegerField(required=False)