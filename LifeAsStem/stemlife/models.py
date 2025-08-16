from django.db import models
from django.contrib.auth.models import AbstractUser
import random

# Create your models here.
class User(AbstractUser):
    pass

class Player(models.Model):
    name = models.CharField(max_length=50)
    users = models.ManyToManyField('User', blank=True)
    creator = models.ForeignKey('User', on_delete=models.CASCADE, blank=False, null=False, related_name="maker")
    
    # Life simulation attributes
    age = models.IntegerField(default=0)
    health = models.IntegerField(default=100)
    intelligence = models.IntegerField(default=50)
    creativity = models.IntegerField(default=50)
    logic = models.IntegerField(default=50)
    social_skills = models.IntegerField(default=50)
    current_stage = models.CharField(max_length=50, default="infant")
    is_alive = models.BooleanField(default=True)
    
    # STEM interests tracking
    science_interest = models.IntegerField(default=0)
    technology_interest = models.IntegerField(default=0)
    engineering_interest = models.IntegerField(default=0)
    math_interest = models.IntegerField(default=0)
    
    def __str__(self):
        return f'{self.name} (Age: {self.age})'
    
    def get_stem_recommendation(self):
        """Calculate STEM field recommendation based on player's interests and stats"""
        interests = {
            'Science': self.science_interest,
            'Technology': self.technology_interest,
            'Engineering': self.engineering_interest,
            'Mathematics': self.math_interest
        }
        
        # Sort by interest level
        sorted_interests = sorted(interests.items(), key=lambda x: x[1], reverse=True)
        
        # Consider other stats for final recommendation
        if self.logic > 70 and self.math_interest > 60:
            return "Mathematics"
        elif self.creativity > 70 and self.science_interest > 60:
            return "Science"
        elif self.intelligence > 70 and self.technology_interest > 60:
            return "Technology"
        elif self.logic > 60 and self.engineering_interest > 60:
            return "Engineering"
        else:
            return sorted_interests[0][0]

class LifeEvent(models.Model):
    STAGE_CHOICES = [
        ('infant', 'Infant (0-2)'),
        ('toddler', 'Toddler (3-5)'),
        ('child', 'Child (6-12)'),
        ('teen', 'Teen (13-19)'),
        ('young_adult', 'Young Adult (20-29)'),
        ('adult', 'Adult (30+)'),
    ]
    
    CATEGORY_CHOICES = [
        ('development', 'Development'),
        ('education', 'Education'),
        ('social', 'Social'),
        ('health', 'Health'),
        ('play', 'Play'),
        ('technology', 'Technology'),
        ('career', 'Career'),
        ('fun', 'Fun'),
        ('family', 'Family'),
        ('hobby', 'Hobby'),
        ('adventure', 'Adventure'),
        ('friendship', 'Friendship'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    # Event progression settings
    min_age = models.IntegerField(default=0)  # Minimum age for this event
    max_age = models.IntegerField(default=100)  # Maximum age for this event
    frequency = models.CharField(max_length=20, choices=[
        ('once', 'Once per stage'),
        ('multiple', 'Multiple times per stage'),
        ('rare', 'Rare event'),
        ('common', 'Common event')
    ], default='once')
    
    # Choice options
    choice1_text = models.CharField(max_length=200)
    choice1_science = models.IntegerField(default=0)
    choice1_technology = models.IntegerField(default=0)
    choice1_engineering = models.IntegerField(default=0)
    choice1_math = models.IntegerField(default=0)
    choice1_health = models.IntegerField(default=0)
    choice1_intelligence = models.IntegerField(default=0)
    choice1_creativity = models.IntegerField(default=0)
    choice1_logic = models.IntegerField(default=0)
    choice1_social = models.IntegerField(default=0)
    choice1_age_increment = models.IntegerField(default=0)  # How much to age after this choice
    
    choice2_text = models.CharField(max_length=200)
    choice2_science = models.IntegerField(default=0)
    choice2_technology = models.IntegerField(default=0)
    choice2_engineering = models.IntegerField(default=0)
    choice2_math = models.IntegerField(default=0)
    choice2_health = models.IntegerField(default=0)
    choice2_intelligence = models.IntegerField(default=0)
    choice2_creativity = models.IntegerField(default=0)
    choice2_logic = models.IntegerField(default=0)
    choice2_social = models.IntegerField(default=0)
    choice2_age_increment = models.IntegerField(default=0)  # How much to age after this choice
    
    choice3_text = models.CharField(max_length=200, blank=True, null=True)
    choice3_science = models.IntegerField(default=0)
    choice3_technology = models.IntegerField(default=0)
    choice3_engineering = models.IntegerField(default=0)
    choice3_math = models.IntegerField(default=0)
    choice3_health = models.IntegerField(default=0)
    choice3_intelligence = models.IntegerField(default=0)
    choice3_creativity = models.IntegerField(default=0)
    choice3_logic = models.IntegerField(default=0)
    choice3_social = models.IntegerField(default=0)
    choice3_age_increment = models.IntegerField(default=0)  # How much to age after this choice
    
    def __str__(self):
        return f'{self.title} ({self.stage})'
    
    def get_choices(self):
        choices = [
            {
                'text': self.choice1_text,
                'effects': {
                    'science': self.choice1_science,
                    'technology': self.choice1_technology,
                    'engineering': self.choice1_engineering,
                    'math': self.choice1_math,
                    'health': self.choice1_health,
                    'intelligence': self.choice1_intelligence,
                    'creativity': self.choice1_creativity,
                    'logic': self.choice1_logic,
                    'social': self.choice1_social,
                    'age_increment': self.choice1_age_increment,
                }
            },
            {
                'text': self.choice2_text,
                'effects': {
                    'science': self.choice2_science,
                    'technology': self.choice2_technology,
                    'engineering': self.choice2_engineering,
                    'math': self.choice2_math,
                    'health': self.choice2_health,
                    'intelligence': self.choice2_intelligence,
                    'creativity': self.choice2_creativity,
                    'logic': self.choice2_logic,
                    'social': self.choice2_social,
                    'age_increment': self.choice2_age_increment,
                }
            }
        ]
        
        if self.choice3_text:
            choices.append({
                'text': self.choice3_text,
                'effects': {
                    'science': self.choice3_science,
                    'technology': self.choice3_technology,
                    'engineering': self.choice3_engineering,
                    'math': self.choice3_math,
                    'health': self.choice3_health,
                    'intelligence': self.choice3_intelligence,
                    'creativity': self.choice3_creativity,
                    'logic': self.choice3_logic,
                    'social': self.choice3_social,
                    'age_increment': self.choice3_age_increment,
                }
            })
        
        return choices

class PlayerProgress(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    current_event = models.ForeignKey(LifeEvent, on_delete=models.CASCADE, null=True, blank=True)
    completed_events = models.ManyToManyField(LifeEvent, related_name='completed_by')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.player.name} - Progress'

# Keep the old Questions model for backward compatibility
class Questions(models.Model):
    text = models.CharField(max_length=250)
    age = models.CharField(max_length=250)
    category = models.CharField(max_length=250)
    answer1 = models.CharField(max_length=256, default="")
    answer2 = models.CharField(max_length=256, default="")
    answer3 = models.CharField(max_length=256, default="", blank=True)
    answer4 = models.CharField(max_length=256, default="", blank=True)
    
    def __str__(self):
        return f'{self.age}'
    
    def serialize(self):
        return {
            "text": self.text,
            "age": self.age,
            "category": self.category,
            "answer1": self.answer1,
            "answer2": self.answer2,
            "answer3": self.answer3,
            "answer4": self.answer4
        }