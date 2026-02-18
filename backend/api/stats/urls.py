from django.urls import path
from .views import (
    stats_execute,
    presets_export,        # NEU: importieren
)
from .presets_views import (
    presets_create,
    presets_list,
    presets_get_by_title_post,
    presets_update_by_title,
    presets_delete_by_title,
)

urlpatterns = [
    path("statistic", stats_execute, name="stats-statistic"),

    # Preset-CRUD
    path("presets", presets_list, name="stats-presets-list"),
    path("presets/create", presets_create, name="stats-presets-create"),
    path("presets/get", presets_get_by_title_post, name="stats-presets-get"),
    path("presets/update", presets_update_by_title, name="stats-presets-update"),
    path("presets/delete", presets_delete_by_title, name="stats-presets-delete"),

    # NEU: Single POST-URL (PresetTitle + FileFormat im Body) mit unformatierter PDF
    path("presets/export", presets_export, name="stats-presets-export-post"),
]