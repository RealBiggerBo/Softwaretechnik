from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("get_liste", views.get_liste),
    path("save", views.save),
    path("get/<int:pk>/", views.get),
    path("update/<int:pk>/", views.update),
    path("delete/<int:pk>/", views.delete),
    # path("search", views.search),
]

urlpatterns = format_suffix_patterns(urlpatterns)
