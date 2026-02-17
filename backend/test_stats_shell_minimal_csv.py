import json
import csv
from io import StringIO
from django.test import Client
from django.urls import reverse, resolve

print("reverse('stats-statistic'):", reverse('stats-statistic'))
print("resolve('/api/stats/statistic'):", resolve('/api/stats/statistic'))

client = Client()
client.defaults["HTTP_HOST"] = "localhost"

payload = {
    "PresetTitle": "TestPreset_Fall",
    "globalRecordType": "Fall",
    "GlobalFilterOptions": [],
    "Queries": [
        {
            "QueryTitle": "Anzahl je Geschlechtsidentität (Alter 20-30)",
            "displayActions": [
                { "DisplayActionTitle": "Anzahl Geschlechtsidentitäten", "type": "CountCategorized", "fieldId": 4 }
            ],
            "filterOptions": [
                { "type": "IntegerRangeFilter", "fieldId": 3, "minValue": 20, "maxValue": 30 }
            ]
        },
        {
            "QueryTitle": "Durchschnittsalter in Stadt Leipzig",
            "displayActions": [
                { "DisplayActionTitle": "Durchschnittsalter", "type": "Average", "fieldId": 3 }
            ],
            "filterOptions": [
                { "type": "EnumValueFilter", "fieldId": 6, "value": ["Stadt Leipzig"] }
            ]
        },
        {
            "QueryTitle": "Maximales Alter in Stadt Leipzig",
            "displayActions": [
                { "DisplayActionTitle": "Max Alter", "type": "Max", "fieldId": 3 }
            ],
            "filterOptions": [
                { "type": "EnumValueFilter", "fieldId": 6, "value": ["Stadt Leipzig"] }
            ]
        }
    ]
}

# Erst der übliche JSON-Test
resp = client.post("/api/stats/statistic", data=json.dumps(payload), content_type="application/json")
print("Status (json):", resp.status_code)
try:
    print(json.dumps(resp.json(), ensure_ascii=False, indent=2))
except Exception:
    print(resp.content.decode("utf-8"))

# Jetzt der CSV-Test (einziger Unterschied: der Pfad)
resp_csv = client.post("/api/stats/statistic-csv", data=json.dumps(payload), content_type="application/json")
print("Status (csv):", resp_csv.status_code)
csv_content = resp_csv.content.decode("utf-8")

with open("test.csv", "w", encoding="utf-8", newline="") as f:
    f.write(csv_content)
print("CSV wurde als test.csv gespeichert.")


print("---CSV Output---")
print(csv_content)

# Optional: Header, QueryTitles oder bestimmte Werte prüfen (für automatisierte Tests)
reader = csv.reader(StringIO(csv_content))
rows = list(reader)
assert rows[0] == ["QueryTitle", "DisplayAction", "DisplayActionTitle", "Key", "Value"], "CSV-Header stimmt nicht!"
assert any("Anzahl je Geschlechtsidentität (Alter 20-30)" in row for row in rows[1:]), "QueryTitle fehlt in CSV-Ausgabe"




print("CSV Test erfolgreich!")