from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import RegistrationForm
from django.contrib import messages

# Registrierung
def register_view(request):
    if request.method == 'POST':  # Formular wurde abgeschickt
        form = RegistrationForm(request.POST)  # Daten aus POST übernehmen
        if form.is_valid():  # Formulareingaben validieren
            user = form.save(commit=False)  # Objekt erzeugen, aber noch nicht speichern
            user.set_password(form.cleaned_data['password'])  # Passwort hashen (Argon2)
            user.save()  # in DB speichern
            messages.success(request, "Benutzer erfolgreich registriert!")
            return redirect('login')  # weiter zum Login
    else:
        form = RegistrationForm()  # leeres Formular für GET
    return render(request, 'accounts/register.html', {'form': form})  # Template anzeigen

# Login
def login_view(request):
    if request.method == 'POST':  # Formular wurde abgeschickt
        username = request.POST['username']
        password = request.POST['password']
        # prüfen, ob Benutzer existiert und Passwort stimmt
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Benutzer einloggen (Session speichern)
            messages.success(request, f"Willkommen {user.username}!")
            return redirect('/')  # z. B. Startseite
        else:
            messages.error(request, "Benutzername oder Passwort falsch")
    return render(request, 'accounts/login.html')  # Template anzeigen

# Logout
def logout_view(request):
    logout(request)  # Session löschen
    messages.success(request, "Du wurdest ausgeloggt")
    return redirect('login')  # zurück zum Login