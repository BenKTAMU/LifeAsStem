from django.contrib import admin
from .models import User, Player, LifeEvent, PlayerProgress, Questions

admin.site.register(User)
admin.site.register(Player)
admin.site.register(LifeEvent)
admin.site.register(PlayerProgress)
admin.site.register(Questions)