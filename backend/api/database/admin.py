from django.contrib import admin

# Register your models here.
from .models import Anfrage, Fall

admin.site.register(Anfrage)
admin.site.register(Fall)