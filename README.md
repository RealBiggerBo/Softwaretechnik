# Anleitung zum Bauen

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
   - Windows PowerShell: `python -m venv venv; .\venv\Scripts\Activate.ps1`
3. Abhängigkeiten installieren: `pip install -r requirements.txt`
4. Datenbank migrieren (legt SQLite-DB an/aktualisiert sie): `python manage.py migrate`
5. Entwicklung starten: `python manage.py runserver` (läuft unter http://127.0.0.1:8000)

## Frontend (Vite + React)

1. Ein neues zweites Konsolenfenster öffnen
2. `cd frontend`
3. Dependencies holen: `npm install`
4. Entwicklung: `npm run dev` (öffnet http://127.0.0.1:5173)

## API

### Data

- GetDataRecords
   - URL: /api/data/get_list
- Save
   - URL: /api/data/save
- Load
   - URL: /api/data/get/N (N: Index des DataRecords)
- Search
   - noch nicht vorhanden (URL: /api/data/search)
- Update
   - URL: /api/data/update/N (N: Index des DataRecords)
- Delete
   - URL: /api/data/get/N (N: Index des DataRecords)