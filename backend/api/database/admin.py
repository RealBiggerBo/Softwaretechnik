from django.contrib import admin
from .models import Anfrage, Fall, Beratung, Gewalttat, Taeter

admin.site.register(Anfrage)
admin.site.register(Fall)
admin.site.register(Beratung)
admin.site.register(Gewalttat)
admin.site.register(Taeter)
