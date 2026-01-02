from rest_framework import serializers
from django.contrib.auth.models import User
from django.config.validators import RegexValidator

alnum_validator = RegexValidator(
    regex=r'[A-Za-z0-9]+$',
    #message="Nur Buchstaben und Zahlen erlaubt." #kann man machen, muss man nicht
)

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    username = serializers.CharField(
        max_lenght=30, #kann man noch höher setzen
        validators=[alnum_validator]
    )

    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwörter stimmen nicht überein.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user