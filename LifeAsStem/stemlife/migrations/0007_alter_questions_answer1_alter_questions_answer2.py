# Generated by Django 5.0.1 on 2024-01-28 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stemlife', '0006_player_engineering_player_mathematics_player_science_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questions',
            name='answer1',
            field=models.CharField(blank=True, default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='questions',
            name='answer2',
            field=models.CharField(blank=True, default='', max_length=256),
        ),
    ]