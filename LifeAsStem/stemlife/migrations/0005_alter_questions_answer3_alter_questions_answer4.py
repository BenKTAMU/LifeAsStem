# Generated by Django 5.0.1 on 2024-01-28 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stemlife', '0004_questions_age_questions_answer1_questions_answer2_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questions',
            name='answer3',
            field=models.CharField(blank=True, default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='questions',
            name='answer4',
            field=models.CharField(blank=True, default='', max_length=256),
        ),
    ]