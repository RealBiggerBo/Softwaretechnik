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

### DataRecords

#### Anfrage

```
{
   "sende_art": "string (maxLänge: 200)",
   "sende_datum": "YYYY-MM-DD",
   "sende_ort": "-> Aufzählungen",
   "sender_rolle": "-> Aufzählungen",
   "im_auftrag": bool,
   "ist_queer": bool,
   "anfrage_art": "-> Aufzählungen",
   "mit_termin": bool,
   "termin_ort": "-> Aufzählungen",
   "termin_datum": "YYYY-MM-DD"
    }
```

#### Fall

```
{
   "alias": "string (maxLänge: 50)",
   "rolle": "-> Aufzählungen",
   "alter": int,
   "geschlecht": "-> Aufzählungen",
   "sexualitaet": "-> Aufzählungen",
   "wohnort": "-> Aufzählungen",
   "staatsangehoerigkeit": "string (maxLänge: 50)",
   "berufssituation": "-> Aufzählungen",
   "schwerbehinderung": bool,
   "schwerbehinderung_form": "-> Aufzählungen",
   "schwerbehinderung_grad": "string optional (maxLänge: 50)",
   "beratungsstelle": "-> Aufzählungen",
   "anzahl_beratungen": int,
   "depression": bool,
   "angststoerung": bool,
   "ptbs": bool,
   "anderes": bool,
   "burn_out": bool,
   "schlafstoerung": bool,
   "sucht": bool,
   "kommunikationsschwierigkeiten": bool,
   "vernachlaessigung_alltäglicher_dinge": bool,
   "schmerzen": bool,
   "laehmungen": bool,
   "krankheit": bool,
   "dauerhafte_beeintraechtigung": "string optional (maxLänge: 200)",
   "finanzielle_folgen": bool,
   "arbeits_einschraenkung": bool,
   "verlust_arbeit": bool,
   "soziale_isolation": bool,
   "suizidalität": bool,
   "weiteres": "string optional (maxLänge: 200)",
   "notizen_folgen": "string optional (maxLänge: 200)",
   "begleitungen_gesamt": int,
   "begleitungen_gerichte": int,
   "begleitungen_polizei": int,
   "begleitungen_rechtsanwaelte": int,
   "begleitungen_aerzte": int,
   "begleitungen_rechtsmedizin": int,
   "begleitungen_jugendamt": int,
   "begleitungen_sozialamt": int,
   "begleitungen_jobcenter": int,
   "begleitungen_beratungstellen": int,
   "begleitungen_schutzeinrichtungen": int,
   "begleitungen_schutzeinrichtungen_spezialisiert": int,
   "begleitungen_interventionsstellen": int,
   "begleitungen_sonstige": "string optional (maxLänge: 200)",
   "verweise_gesamt": int,
   "verweise_gerichte": int,
   "verweise_polizei": int,
   "verweise_rechtsanwaelte": int,
   "verweise_aerzte": int,
   "verweise_rechtsmedizin": int,
   "verweise_jugendamt": int,
   "verweise_sozialamt": int,
   "verweise_jobcenter": int,
   "verweise_beratungstellen": int,
   "verweise_schutzeinrichtungen": int,
   "verweise_schutzeinrichtungen_spezialisiert": int,
   "verweise_interventionsstellen": int,
   "verweise_sonstige": "string optional (maxLänge: 200)",
   "quelle": "-> Aufzählungen",
   "andere_quelle": "string optional (maxLänge: 50)",
   "dolmetsch_zeit": int,
   "dolmetsch_sprache": "string optional (maxLänge: 50)",
   "notizen": "string optional (maxLänge: 200)"
}
```

#### Beratung

#### Gewalttat

#### Taeter

### Aufzählungen

#### Beratungsstelle
      "S": "Stadt Leipzig"
      "L": "Landkreis Leipzig"
      "N": "Landkreis Nordsachsen"

#### Ort
      "S": "Stadt Leipzig"
      "L": "Landkreis Leipzig"
      "N": "Landkreis Nordsachsen"
      "B": "Sachsen"
      "X": "Sonstiges"

#### Rolle
      "B": "Betroffene:r"
      "F": "Fachkraft"
      "A": "Angehörige:r"
      "U": "anonym"

#### AnfrageArt
      "M": "medizinische Soforthilfe"
      "S": "Vertrauliche Spurensicherung"
      "B": "Beratungsbedarf"
      "R": "Beratungsbedarf zu Rechtlichem"
      "X": "Sonstiges"

#### GeschlechtsIdentität
      "C": "cis weiblich"
      "T": "trans weiblich"
      "M": "trans männlich"
      "N": "trans nicht binär"
      "I": "inter"
      "A": "agender"
      "D": "divers"

#### Sexualitaet
      "L": "lesbisch"
      "S": "schwul"
      "B": "bisexuell"
      "A": "asexuell"
      "H": "heterosexuell"

#### BeruflicheSituation
      "L": "arbeitslos"
      "S": "studierend"
      "B": "berufstätig"
      "R": "berentet"
      "A": "Azubi"
      "U": "berufsunfähig"

#### BehinderungsForm
      "P": "kognitiv"
      "K": "körperlich"

#### BeratungsArt
      "P": "persönlich"
      "V": "video"
      "T": "telefon"
      "A": "aufsuchend"
      "S": "schriftlich"

#### Beziehung
      "U": "Unbekannte:r"
      "B": "Bekannte:r"
      "P": "Partner:in"
      "A": "Partner:in ehemalig"
      "E": "Ehepartner:in oder eingetragene:r Lebenspartner:in"
      "F": "andere:r Familienangehörige:r"
      "X": "Sonstige:r"

#### TatOrt
      "S": "Stadt Leipzig"
      "L": "Landkreis Leipzig"
      "N": "Landkreis Nordsachsen"
      "B": "Sachsen"
      "D": "Deutschland"
      "A": "Ausland"
      "F": "auf der Flucht"
      "H": "im Herkunftsland"

#### JaNeinUnentschieden
      "J": "Ja"
      "N": "Nein"
      "U": "noch nicht entschieden"

#### Quelle
      "S": "Selbstmeldung über Polizei"
      "P": "Private Kontakte"
      "B": "Beratungsstellen"
      "I": "Internet"
      "A": "Ämter"
      "G": "Gesundheitswesen (Arzt/Ärztin)"
      "R": "Rechtsanwälte/-anwältinnen"

#### Geschlecht
      "M": "männlich"
      "W": "weiblich"
      "D": "divers"
