# Generated by Django 5.0.1 on 2024-01-28 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stemlife', '0007_alter_questions_answer1_alter_questions_answer2'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='engineering',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='mathematics',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='science',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='technology',
            field=models.IntegerField(default=0),
        ),
    ]
