from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
import csv
from django.utils.dateparse import parse_datetime
from .models import Case

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_cases_csv(request):
    start = request.GET.get('start')
    end = request.GET.get('end')
    qs = Case.objects.all()
    if start:
        dt = parse_datetime(start)
        if dt: qs = qs.filter(date_occurred__gte=dt)
    if end:
        dt = parse_datetime(end)
        if dt: qs = qs.filter(date_occurred__lte=dt)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="cases_export.csv"'
    writer = csv.writer(response)
    header = ['id','date_occurred','reported_at','category','severity','victim_age','victim_gender','city','region','status','anonymized','notes']
    writer.writerow(header)
    for c in qs:
        writer.writerow([
            c.id,
            c.date_occurred.isoformat(),
            c.reported_at.isoformat() if c.reported_at else '',
            c.category,
            c.severity,
            c.victim_age if c.victim_age is not None else '',
            c.victim_gender,
            c.city,
            c.region,
            c.status,
            int(c.anonymized),
            c.notes.replace('\n', ' ') if c.notes else '',
        ])
    return response