from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path('login', views.login_view, name="login"),
    path('logout', views.logout_view, name="logout"),
    path('register', views.register, name='register'),


    #API
    path("questions", views.questions, name="questions"),
    path("update/<int:cat_number>/<int:age>", views.update, name="update")
]