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
5. Erstellen der Rollen `python manage.py create_roles` (aktuell noch manuell, später wharscheinlich als script)
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

### GET

Gibt einen Datensatz zurück.

URL: [/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/fall?id=1)

Rückgabewert:

    Format III

### POST

Speichert einen Datensatz.

URL: [/api/data/data/%T](http://127.0.0.1:8000/api/data/data/fall)

Parameter:
            
    Format III

### PUT

Überschreibt einen Datensatz.

URL: [/api/data/data/%T?id=%N](http://127.0.0.1:8000/api/data/data/fall?id=1)

Parameter:
            
    Format III

## DataRecordAPI

### GET

Gibt die Struktur eines DataRecords zurück.

URL: [/api/data/data_record/%T?id=%N](http://127.0.0.1:8000/api/data/data_record)

Rückgabewert:

    Format II

## ListAPI

### GET

Gibt alle Datensätze eines Types zurück.

URL: [/api/data/list/%T](http://127.0.0.1:8000/api/data/list/fall)

Rückgabewert:

    [Format III]

## SearchAPI

noch nicht vorhanden (URL: /api/data/search/%T)

# Kommunikations-Formate

### Format I

    {
        noch zu entscheiden
    }

### Format II

    {
        noch zu entscheiden
    }

### Format III

    {
        noch zu entscheiden
    }

# DataRecords

im vorläufigen Format II

## Anfrage

-> [backend/api/database/anfrage.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/anfrage.json)

## Fall

-> [backend/api/database/fall.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/fall.json)

## Beratung

-> [backend/api/database/beratung.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/beratung.json)

## Gewalttat

-> [backend/api/database/gewalttat.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/gewalttat.json)

## Taeter

-> [backend/api/database/taeter.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/taeter.json)
