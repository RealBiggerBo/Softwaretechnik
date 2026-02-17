from django.urls import path
from .views import (
    stats_execute,
    presets_export_file,  # NEU: statischer Export per PresetTitle und Format
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

    # Preset statisch per Titel
    path("presets", presets_list, name="stats-presets-list"),
    path("presets/create", presets_create, name="stats-presets-create"),
    path("presets/get", presets_get_by_title_post, name="stats-presets-get"),
    path("presets/update", presets_update_by_title, name="stats-presets-update"),
    path("presets/delete", presets_delete_by_title, name="stats-presets-delete"),

    # NEU: Export über statische URL per Format (CSV/XLSX/PDF), ausschließlich PresetTitle
    # POST -> {download_url, filename}, GET -> Datei
    path("presets/export/<str:fileformat>", presets_export_file, name="stats-presets-export"),
]