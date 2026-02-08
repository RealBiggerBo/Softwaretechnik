from django.conf import settings
from django.db import models

class StatsPreset(models.Model):
    title = models.CharField(max_length=200, unique=True)
    payload = models.JSONField()  # kompletter Stats-Payload (PresetTitle, GlobalFilterOptions, Queries, globalRecordType/recordType)
    created_by = models.ForeignKey(
        getattr(settings, "AUTH_USER_MODEL", "auth.User"),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "api"
        ordering = ["-updated_at", "title"]

    def __str__(self):
        return self.title