# Anleitung zum Bauen

## Benötigte Pakete

- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/en/download

## adminuser

```
Username: superuser
Passwort: 0UsQzBB1
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
5. Erstellen der Rollen `python manage.py create_roles` (aktuell noch manuell, später wahrscheinlich als script)
6. Entwicklung starten: `python manage.py runserver` (läuft unter http://127.0.0.1:8000)

## Frontend (Vite + React)

1. Ein neues zweites Konsolenfenster öffnen
2. `cd frontend`
3. Dependencies holen: `npm install`
4. Entwicklung: `npm run dev` (öffnet http://127.0.0.1:5173)

Bei sonstigen Fehlermeldungen kann ChatGPT/Gemini helfen.

# API's

%T: Typ des DataRecords (anfrage, fall)

%N: Index des DataRecords

## DataAPI

### DELETE

Löscht einen Datensatz.

URL: [/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/fall?id=1)

Zugriffsrecht: Standard

### GET

Gibt einen Datensatz zurück.

URL: [/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/fall?id=1)

Zugriffsrecht: Standard

Rückgabe:

```json
{
    "pk": Integer,
    "data_record": "Anfrage"/"Fall",
    "version": Integer,
    "values": {
        "Name": Wert,
        ...
    }
}
```

### POST

Speichert einen Datensatz.

URL: [/api/data/data/%T](http://127.0.0.1:8000/api/data/data/fall)

Zugriffsrecht: Standard

Parameter:

```json
{
    "data_record": "Anfrage"/"Fall",
    "version": Integer,
    "values": {
        "Name": Wert,
        ...
    }
}
```

Rückgabe:

```json
{
    "pk": Integer,
    "data_record": "Anfrage"/"Fall",
    "version": Integer,
    "values": {
        "Name": Wert,
        ...
    }
}
```

### PUT

Überschreibt einen Datensatz.

URL: [/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/fall?id=1)

Zugriffsrecht: Standard

Parameter:

```json
{
    "data_record": "Anfrage"/"Fall",
    "version": Integer,
    "values": {
        "Name": Wert,
        ...
    }
}
```

## DataRecordAPI

### GET

Gibt die Struktur eines DataRecords zurück.

URL: [/api/data/data_record/%T?id=%N](http://127.0.0.1:8000/api/data/data_record)

Zugriffsrecht: Standard

Rückgabe:

```json
{   "structure": {
        "1": {
            "name": String,
            "type": String,
            "required": Boolean,
            "element": {} (wie "structure", für "type"="List"),
            "maxLength": Integer (für "type"="String"),
            "possibleValues": [String] (für "type"="String"),
        },

        ...
    }
}
```

## DataRecordAdminAPI

### POST

Erstellt eine neue Version eines DataRecords.

URL: [/api/data/data_record_admin/%T](http://127.0.0.1:8000/api/data/data_record)

Zugriffsrecht: Erweitert

Rückgabe:

```json
{   "structure": {
        "1": {
            "name": String,
            "type": String,
            "required": Boolean,
            "element": {} (wie "structure", für "type"="List"),
            "maxLength": Integer (für "type"="String"),
            "possibleValues": [String] (für "type"="String"),
        },

        ...
    }
}
```

## SearchAPI

noch nicht vorhanden (URL: /api/data/search/%T)

## Projekt lokal mit Docker starten

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
