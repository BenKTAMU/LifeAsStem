from django.db import models
from django.contrib.auth.models import AbstractUser



# Create your models here.
class User(AbstractUser):
    pass

class Player(models.Model):
    name = models.CharField(max_length=50)
    users = models.ManyToManyField('User',  blank="False", null="False")
    creator =  models.ForeignKey('User', on_delete=models.CASCADE, blank='False', default="", null='False', related_name="maker")
    def __str__(self):
        return f'{self.name}'

class Questions(models.Model):
    text = models.CharField(max_length = 250)
    age = models.CharField(max_length=256)
    category = models.CharField(max_length=256)
    answer1 = models.CharField(max_length=256, default="")
    answer2 = models.CharField(max_length=256, default = "")
    answer3 = models.CharField(max_length=256, default="", blank=True)
    answer4 = models.CharField(max_length=256, default="", blank=True)
    def __str__(self):
        return f'{self.name}'
    def serialize(self):
        return{
            "text": self.text,
            "age": self.age,
            "category": self.category,
            "answer1": self.answer1,
            "answer2": self.answer2,
            "answer3": self.answer3,
            "answer4": self.answer4
        }