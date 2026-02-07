from django.contrib import admin
from .models import StatsPreset

@admin.register(StatsPreset)
class StatsPresetAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "updated_at", "created_at")
    search_fields = ("title",)
    readonly_fields = ("created_at", "updated_at")