from django.contrib import admin
from .models import Case

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "severity", "victim_age", "victim_gender", "city", "region", "date_occurred", "status")
    list_filter = ("category", "victim_gender", "region", "status")
    search_fields = ("city", "region", "notes")