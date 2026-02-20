# Anleitung zum Bauen

## Benötigte Pakete

- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/en/download

## adminuser

Username:

```
superuser
```

Passwort:

```
0UsQzBB1
```

## Backend (Django)

1. `cd backend`
2. Virtuelle Umgebung erstellen und aktivieren
   - Linux (Bash):
     - Erstellen: `python3 -m venv name` (name ist der Name für die venv)
     - Aktivieren: `source name/bin/activate`
     - Deaktivieren: `deactivate`
   - Windows PowerShell: `python -m venv venv; .\venv\Scripts\Activate.ps1` (Bei Fehler vorher: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`(permanent); `powershell -ExecutionPolicy Bypass`(temporär) ausführen)
3. Abhängigkeiten installieren: `pip install -r requirements.txt`
4. Datenbank migrieren (legt SQLite-DB an/aktualisiert sie): `python manage.py migrate`
5. Entwicklung starten: `python manage.py runserver` (läuft unter http://127.0.0.1:8000)

## Frontend (Vite + React)

1. Ein neues zweites Konsolenfenster öffnen
2. `cd frontend`
3. Dependencies holen: `npm install`
4. Entwicklung: `npm run dev` (öffnet http://127.0.0.1:5173)

Bei sonstigen Fehlermeldungen kann ChatGPT/Gemini helfen.

# API's

%T: Typ des DataRecords (anfrage, fall)

%N: Index des DataRecords

|Beschreibung|Berechtigung|URL|Methode|Parameter|Rückgabe|
|------------|------------|---|-------|---------|--------|
|Datensatz anfragen|Standard|[/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/anfrage?id=1)|Get||DataSet|
|Datensatz speichern|Standard|[/api/data/data/%T](http://127.0.0.1:8000/api/data/data/anfrage)|Post|DataSet|DataSet|
|Datensatz überschreiben|Standard|[/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/anfrage?id=1)|Put|DataSet|DataSet|
|Datensatz löschen|Standard|[/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/anfrage?id=1)|Delete|||
|DataRecord anfragen|Standard|[/api/data/data_record/%T?id=%N](http://127.0.0.1:8000/api/data/data_record/anfrage?id=1)|Get||DataRecord|
|Letztes DataRecord anfragen|Standard|[/api/data/data_record/%T](http://127.0.0.1:8000/api/data/data_record/anfrage)|Get||DataRecord|
|Alle DataRecords anfragen|Standard|[/api/data/data_record_list/%T](http://127.0.0.1:8000/api/data/data_record_list/anfrage)|Get||DataRecord|
|DataRecord speichern|Erweitert|[/api/data/data_record_admin/%T](http://127.0.0.1:8000/api/data/data_record_admin/anfrage)|Post|DataRecord|DataRecord|

# DataSet

|Attribut|Typ|Schreibzugriff|Erlaubte Werte|
|--------|---|--------------|--------------|
|pk|Integer|Nein||
|data_record|String|Ja|"Anfrage", "Fall"|
|version|Integer|Ja|ID einer DataRecord-Version|
|values|Object|Ja|Schlüssel-Werte Paare für alle im DataRecord definierten Felder|

# DataRecord

|Attribut|Typ|Schreibzugriff|Erlaubte Werte|
|--------|---|--------------|--------------|
|pk|Integer|Nein||
|structure|Object|Ja|-> structure|

### structure

Besteht aus Objekten mit folgenden Attributen.

|Attribut|Typ|Erforderlich für|Optional für|Erlaubte Werte|
|--------|---|----------------|------------|--------------|
|name|String|alle Felder|||
|type|String|alle Felder||"Boolean", "Date, "Group", "Integer", "List", "String"|
|required|Boolean|alle Felder|||
|sensitive|Boolean|alle Felder|||
|element|Object|Group, List||-> structure|
|possibleValues|[String]||String||


# Projekt lokal mit Docker starten

### Voraussetzungen

- Docker Desktop

### Schritte

1. Repository lokal öffnen
2. Docker Image bauen:
   ```bash
   docker build -t softwaretechnik .
   ```
3. Container starten:
   ```bash
   docker run -p 8080:80 softwaretechnik
   ```
4. Anwendung im Browser öffnen: http://localhost:8080
