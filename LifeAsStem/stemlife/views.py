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
from django.db.models import Q

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
        
        print(f"Debug: Player age: {player.age}, Stage: {stage}")  # Debug logging
        
        # Get available events for current stage and age range
        available_events = LifeEvent.objects.filter(
            stage=stage,
            min_age__lte=player.age,
            max_age__gte=player.age
        )
        
        print(f"Debug: Found {available_events.count()} available events")  # Debug logging
        
        if available_events.exists():
            # Filter out events that have been completed too many times
            filtered_events = []
            
            for event in available_events:
                # Check how many times this event has been completed
                completed_count = progress.completed_events.filter(id=event.id).count()
                
                # Allow events based on frequency
                if event.frequency == 'once' and completed_count >= 1:
                    continue  # Skip once events that are already completed
                elif event.frequency == 'rare' and completed_count >= 1:
                    continue  # Skip rare events that are already completed
                elif event.frequency == 'multiple' and completed_count >= 3:
                    continue  # Skip multiple events that have been done 3+ times
                elif event.frequency == 'common' and completed_count >= 5:
                    continue  # Skip common events that have been done 5+ times
                
                # If we get here, the event is available
                filtered_events.append(event)
            
            if filtered_events:
                # Prioritize 'once' events if available and not completed
                once_events = [e for e in filtered_events if e.frequency == 'once']
                if once_events:
                    event = random.choice(once_events)
                else:
                    # If no 'once' events, get 'multiple' or 'common' events
                    other_events = [e for e in filtered_events if e.frequency in ['multiple', 'common']]
                    if other_events:
                        event = random.choice(other_events)
                    else:
                        # Fallback if no events are found for the current stage
                        return JsonResponse({'error': 'No events available for this stage.'}, status=404)
                
                progress.current_event = event
                progress.save()
                
                return JsonResponse({
                    "event": {
                        "id": event.id,
                        "title": event.title,
                        "description": event.description,
                        "choices": event.get_choices(),
                        "category": event.category
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
                # All events for this stage/age completed, age up naturally
                player.age += 1
                player.save()
                
                # Try to get events for the new age
                return get_current_event(request)
        else:
            # No events available for current stage, age up to next stage
            if stage == "infant" and player.age >= 2:
                player.age = 3  # Move to toddler stage
            elif stage == "toddler" and player.age >= 5:
                player.age = 6  # Move to child stage
            elif stage == "child" and player.age >= 12:
                player.age = 13  # Move to teen stage
            elif stage == "teen" and player.age >= 19:
                player.age = 20  # Move to young adult stage
            elif stage == "young_adult" and player.age >= 29:
                player.age = 30  # Move to adult stage
            else:
                player.age += 1  # Default aging
            
            player.save()
            
            # Try to get events for the new age
            return get_current_event(request)
            
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
            
            # Age the player based on choice (not always by 1)
            age_increment = effects.get("age_increment", 0)
            if age_increment > 0:
                player.age += age_increment
            else:
                # Always age a little bit (0.5 years) even if no specific increment
                player.age += 0.5
            
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
            
            response_data = {
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
            }
            return JsonResponse(response_data)
            
        except (Player.DoesNotExist, PlayerProgress.DoesNotExist) as e:
            return JsonResponse({"error": "Player not found"}, status=404)
        except json.JSONDecodeError as e:
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
