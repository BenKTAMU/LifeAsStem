# Life As STEM - BitLife-Style STEM Simulation Game

A Django-based life simulation game that helps young players discover their interests in STEM fields through interactive life choices.

## Features

- **Life Simulation**: Start as an infant and progress through different life stages
- **Interactive Choices**: Make decisions that affect your character's development
- **STEM Interest Tracking**: Build interest in Science, Technology, Engineering, and Mathematics
- **Personalized Recommendations**: Get STEM field recommendations based on your choices
- **Progressive Storytelling**: Experience different events at each life stage
- **Modern UI**: Beautiful, responsive interface with smooth animations

## Life Stages

1. **Infant (0-2 years)**: Early development and first experiences
2. **Toddler (3-5 years)**: Exploration and basic learning
3. **Child (6-12 years)**: School experiences and skill development
4. **Teen (13-19 years)**: High school choices and career exploration
5. **Young Adult (20-29 years)**: College and first career decisions
6. **Adult (30+ years)**: Career advancement and mentoring

## STEM Fields

The game tracks your interest in four main STEM areas:

- **Science**: Biology, Chemistry, Physics, Research
- **Technology**: Programming, Computer Science, Software Development
- **Engineering**: Mechanical, Electrical, Civil, Aerospace
- **Mathematics**: Pure Math, Applied Math, Statistics, Data Science

## Setup Instructions

### Prerequisites

- Python 3.8+
- Django 3.2+
- PostgreSQL (recommended) or SQLite

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LifeAsStem
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Populate the database with life events:
```bash
python manage.py populate_events
```

7. Run the development server:
```bash
python manage.py runserver
```

8. Visit http://localhost:8000 in your browser

## How to Play

1. **Register/Login**: Create an account or sign in
2. **Create Character**: Choose a name for your character
3. **Start Life Journey**: Begin experiencing life events from infancy
4. **Make Choices**: Each event presents choices that affect your stats and interests
5. **Progress Through Life**: Age up and experience new events at each stage
6. **Get Recommendations**: Once you reach age 18, get personalized STEM field recommendations
7. **Start Over**: Reset your progress to try different life paths

## Game Mechanics

### Stats System

Your character has several attributes that change based on your choices:

- **Health**: Physical well-being
- **Intelligence**: Academic and cognitive abilities
- **Creativity**: Artistic and innovative thinking
- **Logic**: Problem-solving and analytical skills
- **Social Skills**: Communication and interpersonal abilities

### Choice Effects

Every choice you make affects:
- Your character's stats
- Your interest levels in different STEM fields
- The progression of your life story

### STEM Recommendations

The game analyzes your choices and interests to recommend the most suitable STEM field based on:
- Highest interest levels
- Complementary stat combinations
- Life choices that align with specific fields

## Customization

### Adding New Events

You can add new life events by:

1. Using the Django admin interface
2. Creating new `LifeEvent` objects programmatically
3. Modifying the `populate_events.py` management command

### Modifying Recommendations

Adjust the recommendation algorithm in the `Player.get_stem_recommendation()` method in `models.py`.

### Styling

Customize the game's appearance by modifying the CSS in `static/stemlife/style.css`.

## Technical Details

### Models

- **User**: Extended Django user model
- **Player**: Character with stats and STEM interests
- **LifeEvent**: Life events with choices and effects
- **PlayerProgress**: Tracks player's progress through events

### Views

- **Game Views**: Handle game logic and player interactions
- **API Endpoints**: JSON responses for game state and choices
- **Authentication**: Login required for game features

### Frontend

- **Vanilla JavaScript**: Game logic and interactions
- **Responsive CSS**: Modern design with CSS Grid and Flexbox
- **Font Awesome**: Icons for visual elements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by life simulation games like BitLife
- Designed to encourage STEM education and career exploration
- Built with Django and modern web technologies

## Support

For questions or support, please open an issue on the GitHub repository. 