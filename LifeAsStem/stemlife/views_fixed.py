from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from .models import User, Questions, Player, LifeEvent, PlayerProgress
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.contrib.auth.decorators import login_required
import json
import random

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        # Check if user has a player profile
        try:
            player = Player.objects.get(users=request.user)
            return render(request, "stemlife/game.html", {"player": player})
        except Player.DoesNotExist:
            return render(request, "stemlife/create_character.html")
    return render(request, "stemlife/index.html")

@login_required
def create_character(request):
    if request.method == "POST":
        name = request.POST.get("name")
        if name:
            player = Player.objects.create(
                name=name,
                creator=request.user
            )
            player.users.add(request.user)
            
            # Create progress tracking
            PlayerProgress.objects.create(player=player)
            
            return HttpResponseRedirect(reverse("game"))
    return render(request, "stemlife/create_character.html")

@login_required
def game_view(request):
    try:
        player = Player.objects.get(users=request.user)
        return render(request, "stemlife/game.html", {"player": player})
    except Player.DoesNotExist:
        return HttpResponseRedirect(reverse("create_character"))

@login_required
def get_current_event(request):
    """Get the current life event for the player"""
    try:
        player = Player.objects.get(users=request.user)
        progress = PlayerProgress.objects.get(player=player)
        
        # Get current stage based on age
        if player.age < 3:
            stage = "infant"
        elif player.age < 6:
            stage = "toddler"
        elif player.age < 13:
            stage = "child"
        elif player.age < 20:
            stage = "teen"
        elif player.age < 30:
            stage = "young_adult"
        else:
            stage = "adult"
        
        player.current_stage = stage
        player.save()
        
        # Get available events for current stage
        available_events = LifeEvent.objects.filter(stage=stage)
        
        if available_events.exists():
            # Select random event
            event = random.choice(available_events)
            progress.current_event = event
            progress.save()
            
            return JsonResponse({
                "event": {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "choices": event.get_choices()
                },
                "player": {
                    "age": player.age,
                    "health": player.health,
                    "intelligence": player.intelligence,
                    "creativity": player.creativity,
                    "logic": player.logic,
                    "social_skills": player.social_skills,
                    "science_interest": player.science_interest,
                    "technology_interest": player.technology_interest,
                    "engineering_interest": player.engineering_interest,
                    "math_interest": player.math_interest
                }
            })
        else:
            return JsonResponse({"error": "No events available for this stage"})
            
    except (Player.DoesNotExist, PlayerProgress.DoesNotExist):
        return JsonResponse({"error": "Player not found"}, status=404)

@login_required
def make_choice(request):
    """Process player choice and update stats"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            choice_index = data.get("choice_index")
            
            player = Player.objects.get(users=request.user)
            progress = PlayerProgress.objects.get(player=player)
            
            if not progress.current_event:
                return JsonResponse({"error": "No current event"})
            
            event = progress.current_event
            choices = event.get_choices()
            
            if choice_index >= len(choices):
                return JsonResponse({"error": "Invalid choice"})
            
            choice = choices[choice_index]
            effects = choice["effects"]
            
            # Apply effects to player
            player.science_interest += effects.get("science", 0)
            player.technology_interest += effects.get("technology", 0)
            player.engineering_interest += effects.get("engineering", 0)
            player.math_interest += effects.get("math", 0)
            player.health += effects.get("health", 0)
            player.intelligence += effects.get("intelligence", 0)
            player.creativity += effects.get("creativity", 0)
            player.logic += effects.get("logic", 0)
            player.social_skills += effects.get("social", 0)
            
            # Age the player
            player.age += 1
            
            # Ensure stats stay within reasonable bounds
            for attr in ['health', 'intelligence', 'creativity', 'logic', 'social_skills']:
                setattr(player, attr, max(0, min(100, getattr(player, attr))))
            
            for attr in ['science_interest', 'technology_interest', 'engineering_interest', 'math_interest']:
                setattr(player, attr, max(0, min(100, getattr(player, attr))))
            
            player.save()
            
            # Mark event as completed
            progress.completed_events.add(event)
            progress.current_event = None
            progress.save()
            
            # Check if player should get STEM recommendation
            stem_recommendation = None
            if player.age >= 18:
                stem_recommendation = player.get_stem_recommendation()
            
            return JsonResponse({
                "success": True,
                "player": {
                    "age": player.age,
                    "health": player.health,
                    "intelligence": player.intelligence,
                    "creativity": player.creativity,
                    "logic": player.logic,
                    "social_skills": player.social_skills,
                    "science_interest": player.science_interest,
                    "technology_interest": player.technology_interest,
                    "engineering_interest": player.engineering_interest,
                    "math_interest": player.math_interest
                },
                "stem_recommendation": stem_recommendation
            })
            
        except (Player.DoesNotExist, PlayerProgress.DoesNotExist):
            return JsonResponse({"error": "Player not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@login_required
def get_stem_recommendation(request):
    """Get STEM field recommendation for the player"""
    try:
        player = Player.objects.get(users=request.user)
        recommendation = player.get_stem_recommendation()
        
        return JsonResponse({
            "recommendation": recommendation,
            "interests": {
                "science": player.science_interest,
                "technology": player.technology_interest,
                "engineering": player.engineering_interest,
                "math": player.math_interest
            }
        })
    except Player.DoesNotExist:
        return JsonResponse({"error": "Player not found"}, status=404)

@login_required
def reset_game(request):
    """Reset player progress and start over"""
    try:
        player = Player.objects.get(users=request.user)
        progress = PlayerProgress.objects.get(player=player)
        
        # Reset player stats
        player.age = 0
        player.health = 100
        player.intelligence = 50
        player.creativity = 50
        player.logic = 50
        player.social_skills = 50
        player.current_stage = "infant"
        player.is_alive = True
        player.science_interest = 0
        player.technology_interest = 0
        player.engineering_interest = 0
        player.math_interest = 0
        player.save()
        
        # Reset progress
        progress.current_event = None
        progress.completed_events.clear()
        progress.save()
        
        return JsonResponse({"success": True})
    except (Player.DoesNotExist, PlayerProgress.DoesNotExist):
        return JsonResponse({"error": "Player not found"}, status=404)

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
            return render(request, "stemlife/login.html", {
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
            return render(request, "stemlife/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "stemlife/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "stemlife/register.html")

# Data
def get_questions(request):
    questions = Questions.objects.filter().all()
    return JsonResponse([question.serialize() for question in questions], safe=False) 