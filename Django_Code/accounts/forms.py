from django import forms
from django.contrib.auth.models import User # Das ist das User-Model von Django
from django.core.validators import RegexValidator

# Sorgt dafür, dass nur Buchstaben und Zahlen für den Nutzername verwendet werden können.
alnum_validator = RegexValidator(
    regex=r'^[A-Za-z0-9]+$',
    message="Es können nur Buchstaben und Zahlen verwendet werden."
)

class RegistrationForm(forms.ModelForm):
    # Verbirgt die Eingabe im Passwortfeld
    password = forms.CharField(widget=forms.PasswordInput)
    # Um Tippfehler im Passwort abzufangen
    password2 = forms.CharField(widget=forms.PasswordInput, label="Passwort wiederholen")

    # Begrenzt Nutzername auf 30 Stellen, Buchstaben und Zahlen
    username = forms.CharField(max_length=30, validators=[alnum_validator]) 

    class Meta:
        model = User
        fields = ("username", "password")

    # Überprüft ob der Nutzername schon vergeben ist
    def clean_username(self):
        u = self.cleaned_data["username"]
        if User.objects.filter(username_iexact=u).exists():
            raise forms.ValidationError("Benutzername ist bereits vergeben.")
        return u
    
    # Überprüft ob die Passwöter übereinstimmen
    def clean(self):
        cleaned_data = super().clean()
        pw1 = cleaned_data.get("password")
        pw2 = cleaned_data.get("password2")
        if pw1 != pw2:
            raise forms.ValidationError("Passwörter stimmen nicht überein.")
        return cleaned_data