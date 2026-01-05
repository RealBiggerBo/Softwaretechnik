from api.models import Case
from django.utils import timezone

# EDITABLE: passe hier die Testfälle an oder ergänze weitere
cases = [
    {
        "date_occurred": "2025-12-01T12:00:00Z",
        "category": "physical",
        "severity": 3,
        "victim_age": 28,
        "victim_gender": "female",
        "city": "Berlin",
        "region": "Berlin",
        "status": "open",
        "notes": "Testfall A"
    },
    {
        "date_occurred": "2025-12-05T09:30:00Z",
        "category": "psychological",
        "severity": 2,
        "victim_age": 34,
        "victim_gender": "male",
        "city": "Hamburg",
        "region": "Hamburg",
        "status": "open",
        "notes": "Testfall B"
    },
    {
        "date_occurred": "2025-12-10T20:00:00Z",
        "category": "physical",
        "severity": 4,
        "victim_age": 41,
        "victim_gender": "female",
        "city": "Berlin",
        "region": "Berlin",
        "status": "closed",
        "notes": "Testfall C"
    },
]

created_ids = []
for c in cases:
    # date_occurred als ISO String wird vom ORM konvertiert; falls Probleme, verwende timezone.datetime(...)
    obj = Case.objects.create(
        date_occurred=c["date_occurred"],
        category=c["category"],
        severity=c["severity"],
        victim_age=c["victim_age"],
        victim_gender=c["victim_gender"],
        city=c["city"],
        region=c["region"],
        status=c["status"],
        notes=c["notes"],
    )
    created_ids.append(obj.id)

print("Erzeugte Testfälle:", created_ids)
print("Aktuelle Anzahl Case-Objekte:", Case.objects.count())