from django.contrib import admin
from .models import User, Questions, Player
# Register your models here.
admin.site.register(User)
admin.site.register(Questions)
admin.site.register(Player)