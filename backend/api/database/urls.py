from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import api

urlpatterns = [
    path("anfrage/get_liste", api.get_anfrage_liste),
    path("anfrage/save", api.save_anfrage),
    path("anfrage/get/<int:pk>/", api.get_anfrage),
    path("anfrage/update/<int:pk>/", api.update_anfrage),
    path("anfrage/delete/<int:pk>/", api.delete_anfrage),
    # path("anfrage/search", api.search_anfrage),
    path("fall/get_liste", api.get_fall_liste),
    path("fall/save", api.save_fall),
    path("fall/get/<int:pk>/", api.get_fall),
    path("fall/update/<int:pk>/", api.update_fall),
    path("fall/delete/<int:pk>/", api.delete_fall),
    # path("fall/search", api.search_fall),
]

urlpatterns = format_suffix_patterns(urlpatterns)