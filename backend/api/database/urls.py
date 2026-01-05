from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("get_list/<str:type>", views.get_list),
    path("save/<str:type>", views.save),
    path("get/<str:type>/<int:pk>/", views.get),
    path("update/<str:type>/<int:pk>/", views.update),
    path("delete/<str:type>/<int:pk>/", views.delete),
    path("search/<str:type>", views.search),
]

urlpatterns = format_suffix_patterns(urlpatterns)
