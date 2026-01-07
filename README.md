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

T: Typ des DataRecords (anfrage, fall)

N: Index des DataRecords

## DataAPI

URL: /api/data/data/T/N

Methoden: DELETE, GET, POST, PUT

## DataRecordAPI

-> [/api/data/data_record](http://127.0.0.1:8000/api/data/data_record)

Methoden: GET, POST

## ListAPI

URL: /api/data/list/T

Methoden: GET


## SearchAPI

noch nicht vorhanden (URL: /api/data/search/T)

# DataRecords

## Anfrage

-> [backend/api/database/anfrage.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/anfrage.json)


## Fall

-> [backend/api/database/fall.json](https://github.com/RealBiggerBo/Softwaretechnik/blob/master/backend/api/database/fall.json)

## Weitere

#### Beratung

```
{
    "fall": int (Index des Falls),
    "datum": "YYYY-MM-DD",
    "art": "-> AnfrageArt",
    "stelle": "-> Beratungsstelle",
    "notizen": "string optional (maxLänge: 200)"
}
```

#### Gewalttat

```
{
    "fall": int (Index des Falls),
    "alter": int optional,
    "zeitraum": int optional,
    "anzahl_vorfaelle": int optional,
    "anzahl_taeter": int optional,
    "sexuelle_belaestigung_oeffentlich": bool,
    "sexuelle_belaestigung_arbeit": bool,
    "sexuelle_belaestigung_privat": bool,
    "vergewaltigung": bool,
    "versuchte_vergewaltigung": bool,
    "sexueller_missbrauch": bool,
    "sexueller_missbrauch_kindheit": bool,
    "sexuelle_noetigung": bool,
    "rituelle_gewalt": bool,
    "zwangsprostitution": bool,
    "sexuelle_ausbeutung": bool,
    "upskirting": bool,
    "catcalling": bool,
    "digitale_sexuelle_gewalt": bool,
    "spiking": bool,
    "weitere": "string optional (maxLänge: 200)",
    "tatort": "-> TatOrt",
    "anzeige": "-> JaNeinUnentschieden",
    "med_versorgung": bool,
    "betroffene_kinder": int optional,
    "betroffene_kinder_direkt": int optional,
    "notizen": "string optional (maxLänge: 200)"
}
```

#### Taeter

```
{
    "gewalttat": int (Index der Gewalttat),
    "geschlecht": "-> Geschlecht",
    "beziehung": "-> Beziehung"
}
```

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
