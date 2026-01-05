from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  # empfehlenswert
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils.dateparse import parse_datetime
from .models import Case

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def case_stats(request):
    """
    Query-Parameter:
      - start: ISO datetime (z.B. 2026-01-01T00:00:00)
      - end: ISO datetime
      - preset: welcher Report (siehe Presets)
      - top: int (für Top-N)
    Presets (Beispiele):
      - cases_per_month
      - by_category
      - gender_distribution
      - age_distribution (nur roh, Histogram im Frontend)
      - top_regions
      - severity_distribution
    """
    start = request.GET.get('start')
    end = request.GET.get('end')
    preset = request.GET.get('preset', 'cases_per_month')
    top = int(request.GET.get('top', 10))

    qs = Case.objects.all()
    if start:
        dt = parse_datetime(start)
        if dt:
            qs = qs.filter(date_occurred__gte=dt)
    if end:
        dt = parse_datetime(end)
        if dt:
            qs = qs.filter(date_occurred__lte=dt)

    if preset == 'cases_per_month':
        # Gruppiert nach Monat
        series = (
            qs.annotate(month=TruncMonth('date_occurred'))
              .values('month')
              .annotate(count=Count('id'))
              .order_by('month')
        )
        data = [{"month": s["month"].date().isoformat(), "count": s["count"]} for s in series]
        return Response({"preset": preset, "data": data})

    if preset == 'by_category':
        series = qs.values('category').annotate(count=Count('id')).order_by('-count')
        return Response({"preset": preset, "data": list(series)})

    if preset == 'gender_distribution':
        series = qs.values('victim_gender').annotate(count=Count('id')).order_by('-count')
        return Response({"preset": preset, "data": list(series)})

    if preset == 'top_regions':
        series = qs.values('region').annotate(count=Count('id')).order_by('-count')[:top]
        return Response({"preset": preset, "data": list(series)})

    if preset == 'severity_distribution':
        series = qs.values('severity').annotate(count=Count('id')).order_by('severity')
        return Response({"preset": preset, "data": list(series)})

    if preset == 'age_distribution':
        # Rückgabe: rohe Altersliste, Frontend erstellt Histogramm/Buckets
        ages = list(qs.values_list('victim_age', flat=True))
        ages = [a for a in ages if a is not None]
        return Response({"preset": preset, "data": ages})

    return Response({"preset": preset, "data": []})