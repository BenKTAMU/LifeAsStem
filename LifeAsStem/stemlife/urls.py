from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('register/', views.register, name='register'),
    
    # Game routes
    path('create-character/', views.create_character, name='create_character'),
    path('game/', views.game_view, name='game'),
    path('get-current-event/', views.get_current_event, name='get_current_event'),
    path('make-choice/', views.make_choice, name='make_choice'),
    path('get-stem-recommendation/', views.get_stem_recommendation, name='get_stem_recommendation'),
    path('reset-game/', views.reset_game, name='reset_game'),

    # Data
    path("question/", views.get_questions, name='question')
]