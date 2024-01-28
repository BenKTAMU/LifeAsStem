from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from .models import User, Questions
from django.contrib.auth import authenticate, login, logout
# Create your views here.

def index(request):
    return render(request, "stemlife/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "calendars/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "stemlife/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "calendars/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "calendars/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "stemlife/register.html")
    

#data
    
def questions(request):
    questions = Questions.objects.all()
    return JsonResponse([question.serialize() for question in questions],safe=False)

def update(request, age, cat_number):
    user = request.user
    question = Questions.objects.get(age=age)
    if question.category == "Science":
        if cat_number == 1:
            user.science += 1
    elif question.category == "Technology":
        if cat_number == 1:
            user.technology += 1
    elif question.category == "Engineering":
        if cat_number == 1:
            user.engineering += 1
    elif question.category == "Mathematics":
        if cat_number == 1:
            user.mathematics += 1
    else:
        if cat_number == 1:
            user.science += 1
        elif cat_number == 2:
            user.technology += 1
        elif cat_number == 3:    
            user.engineering += 1
        elif cat_number == 4:
            user.mathematics += 1
    user.save()
    return JsonResponse({"message": "Score updated successfully."}, status=201)