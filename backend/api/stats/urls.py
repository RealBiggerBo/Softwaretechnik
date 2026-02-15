from django.urls import path
from .views import stats_execute, stats_execute_csv
from .presets_views import (
    presets_create,
    presets_list,
    presets_get,
    presets_get_by_title,
    presets_update,
    presets_delete,
)

urlpatterns = [
    path("statistic", stats_execute, name="stats-statistic"),
    path("presets", presets_list, name="stats-presets-list"),
    path("presets/create", presets_create, name="stats-presets-create"),
    path("presets/<int:preset_id>", presets_get, name="stats-presets-get"),
    path("presets/<int:preset_id>/update", presets_update, name="stats-presets-update"),
    path("presets/<int:preset_id>/delete", presets_delete, name="stats-presets-delete"),
    path("presets/by-title/<str:title>", presets_get_by_title, name="stats-presets-get-by-title"),
    path("statistic-csv", stats_execute_csv, name="stats-statistic-csv"),
]