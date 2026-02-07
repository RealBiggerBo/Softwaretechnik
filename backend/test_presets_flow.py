import json
from django.test import Client
from django.urls import reverse, resolve

client = Client()
client.defaults["HTTP_HOST"] = "localhost"

# Sanity: URL-Mapping prüfen
print("reverse('stats-presets-create'):", reverse('stats-presets-create'))
print("reverse('stats-presets-list'):", reverse('stats-presets-list'))
print("reverse('stats-statistic'):", reverse('stats-statistic'))
print("resolve('/api/stats/presets'):", resolve('/api/stats/presets'))
print("resolve('/api/stats/statistic'):", resolve('/api/stats/statistic'))

# 1) Preset anlegen (wir schicken den kompletten Statistik-Payload; Titel kommt aus PresetTitle)
preset_payload = {
  "PresetTitle": "Leipzig_Alter_Stats",
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

resp = client.post("/api/stats/presets/create", data=json.dumps(preset_payload), content_type="application/json")
print("CREATE Status:", resp.status_code)
preset_create = resp.json()
print(json.dumps(preset_create, ensure_ascii=False, indent=2))
preset_id = preset_create.get("id")
assert preset_id, "Kein Preset 'id' in Create-Response"

# 2) Liste abrufen
resp = client.get("/api/stats/presets")
print("LIST Status:", resp.status_code)
print(json.dumps(resp.json(), ensure_ascii=False, indent=2))

# 3) Preset per ID abrufen
resp = client.get(f"/api/stats/presets/{preset_id}")
print("GET Status:", resp.status_code)
preset_obj = resp.json()
print(json.dumps(preset_obj, ensure_ascii=False, indent=2))
payload_from_preset = preset_obj["payload"]

# 4) Statistik ausführen mit dem gespeicherten Payload
resp = client.post("/api/stats/statistic", data=json.dumps(payload_from_preset), content_type="application/json")
print("EXECUTE Status:", resp.status_code)
print(json.dumps(resp.json(), ensure_ascii=False, indent=2))

# 5) Preset aktualisieren: wir ändern z. B. die Altersrange in Query 1 (minValue von 20 auf 25)
updated_payload = payload_from_preset.copy()
updated_payload["Queries"] = [q.copy() for q in payload_from_preset["Queries"]]
updated_payload["Queries"][0] = updated_payload["Queries"][0].copy()
updated_payload["Queries"][0]["filterOptions"] = [
  { "type": "IntegerRangeFilter", "fieldId": 3, "minValue": 25, "maxValue": 30 }
]

resp = client.put(
    f"/api/stats/presets/{preset_id}/update",
    data=json.dumps({ "payload": updated_payload }),
    content_type="application/json",
)
print("UPDATE Status:", resp.status_code)
print(json.dumps(resp.json(), ensure_ascii=False, indent=2))

# 6) Mit dem aktualisierten Payload erneut ausführen
resp = client.post("/api/stats/statistic", data=json.dumps(updated_payload), content_type="application/json")
print("EXECUTE (updated) Status:", resp.status_code)
print(json.dumps(resp.json(), ensure_ascii=False, indent=2))

# 7) Preset löschen
resp = client.delete(f"/api/stats/presets/{preset_id}/delete")
print("DELETE Status:", resp.status_code, resp.json())

# 8) Liste erneut prüfen
resp = client.get("/api/stats/presets")
print("LIST (after delete) Status:", resp.status_code)
print(json.dumps(resp.json(), ensure_ascii=False, indent=2))