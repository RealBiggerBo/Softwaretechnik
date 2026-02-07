import json
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

resp = client.post("/api/stats/statistic", data=json.dumps(payload), content_type="application/json")
print("Status:", resp.status_code)
try:
    print(json.dumps(resp.json(), ensure_ascii=False, indent=2))
except Exception:
    print(resp.content.decode("utf-8"))