// Life As STEM Game JavaScript

class LifeGame {
    constructor() {
        this.currentEvent = null;
        this.player = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCurrentEvent();
    }

    bindEvents() {
        // Next Event Button
        document.getElementById('nextEventBtn').addEventListener('click', () => {
            // Show loading state when manually loading next event
            document.getElementById('eventChoices').innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading next event...</div>';
            this.loadCurrentEvent();
        });

        // Get Recommendation Button
        document.getElementById('getRecommendationBtn').addEventListener('click', () => {
            this.getSTEMRecommendation();
        });

        // Reset Game Button
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to start over? This will reset all your progress.')) {
                this.resetGame();
            }
        });

        // Modal close button
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('recommendationModal');
            if (event.target === modal) {
                this.closeModal();
            }
        });
    }

    async loadCurrentEvent() {
        try {
            console.log('Loading current event...'); // Debug logging
            const response = await fetch('/get-current-event/');
            console.log('Response status:', response.status); // Debug logging
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data); // Debug logging

            if (data.error) {
                this.showEventContent('No more events available for this stage. Try aging up!');
                // Show a message that the game is waiting for the next stage
                document.getElementById('eventChoices').innerHTML = '<div class="loading-state"><i class="fas fa-clock"></i> Waiting for next life stage...</div>';
                return;
            }

            if (!data.event || !data.player) {
                throw new Error('Invalid response format - missing event or player data');
            }

            this.currentEvent = data.event;
            this.player = data.player;
            this.updatePlayerStats();
            this.showEventContent(data.event.description, data.event.choices, data.event.category);
        } catch (error) {
            console.error('Error loading event:', error);
            this.showEventContent('Error loading life event. Please try again.');
        }
    }

    showEventContent(description, choices = null, category = null) {
        const eventContent = document.getElementById('eventContent');
        const eventChoices = document.getElementById('eventChoices');
        const eventCategory = document.getElementById('eventCategory');

        // Add fade-in effect for event content
        eventContent.style.opacity = '0';
        eventContent.innerHTML = `<p>${description}</p>`;
        
        // Display event category if available
        if (category) {
            const categoryDisplay = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            eventCategory.innerHTML = `<span class="category-badge" data-category="${category}">${categoryDisplay}</span>`;
        } else {
            eventCategory.innerHTML = '';
        }
        
        // Fade in the content
        setTimeout(() => {
            eventContent.style.transition = 'opacity 0.5s ease';
            eventContent.style.opacity = '1';
        }, 100);

        if (choices && choices.length > 0) {
            // Clear previous choices with fade out
            eventChoices.style.opacity = '0';
            eventChoices.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                eventChoices.innerHTML = choices.map((choice, index) => `
                    <button class="choice-btn" data-choice="${index}">
                        <i class="fas fa-arrow-right"></i>
                        ${choice.text}
                    </button>
                `).join('');

                // Add event listeners to choice buttons
                eventChoices.querySelectorAll('.choice-btn').forEach((btn, index) => {
                    btn.addEventListener('click', (e) => {
                        const choiceIndex = parseInt(e.target.closest('.choice-btn').dataset.choice);
                        this.makeChoice(choiceIndex);
                    });
                    
                    // Stagger the appearance of choice buttons
                    btn.style.opacity = '0';
                    btn.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        btn.style.transition = 'all 0.4s ease';
                        btn.style.opacity = '1';
                        btn.style.transform = 'translateY(0)';
                    }, index * 150);
                });

                // Fade in the choices container
                eventChoices.style.transition = 'all 0.5s ease';
                eventChoices.style.opacity = '1';
                eventChoices.style.transform = 'translateY(0)';
            }, 300);
        } else {
            // Show loading state when no choices (transitioning to next event)
            if (description.includes('Choice made!')) {
                eventChoices.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading next event...</div>';
            } else {
                eventChoices.innerHTML = '<p style="color: #6b7280; font-style: italic;">No choices available for this event.</p>';
            }
            eventChoices.style.opacity = '1';
            eventChoices.style.transform = 'translateY(0)';
        }
    }

    async makeChoice(choiceIndex) {
        try {
            const response = await fetch('/make-choice/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({ choice_index: choiceIndex })
            });

            const data = await response.json();

            if (data.success) {
                this.player = data.player;
                this.updatePlayerStats();
                
                // Show brief result message
                this.showEventContent(`Choice made! You're now ${this.player.age} years old.`);
                
                // Check if STEM recommendation is available
                if (data.stem_recommendation) {
                    this.showSTEMRecommendation(data.stem_recommendation);
                }
                
                // Clear choices
                document.getElementById('eventChoices').innerHTML = '';
                
                // Show transition message
                setTimeout(() => {
                    this.showEventContent(`Choice made! You're now ${this.player.age} years old.`, null, null);
                    document.getElementById('eventChoices').innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading next event...</div>';
                }, 1000);
                
                // Automatically load the next event after a short delay
                setTimeout(() => {
                    this.loadCurrentEvent();
                }, 2500); // 2.5 second total delay for better user experience
            } else {
                this.showEventContent(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error making choice:', error);
            this.showEventContent('Error processing choice. Please try again.');
        }
    }

    updatePlayerStats() {
        if (!this.player) return;

        // Update stat values
        document.getElementById('playerAge').textContent = this.player.age;
        document.getElementById('playerHealth').textContent = this.player.health;
        document.getElementById('playerIntelligence').textContent = this.player.intelligence;
        document.getElementById('playerCreativity').textContent = this.player.creativity;
        document.getElementById('playerLogic').textContent = this.player.logic;
        document.getElementById('playerSocial').textContent = this.player.social_skills;

        // Update STEM interest bars
        document.getElementById('scienceProgress').style.width = `${this.player.science_interest}%`;
        document.getElementById('technologyProgress').style.width = `${this.player.technology_interest}%`;
        document.getElementById('engineeringProgress').style.width = `${this.player.engineering_interest}%`;
        document.getElementById('mathProgress').style.width = `${this.player.math_interest}%`;

        // Enable/disable recommendation button based on age
        const recBtn = document.getElementById('getRecommendationBtn');
        if (this.player.age >= 18) {
            recBtn.disabled = false;
            recBtn.classList.remove('disabled');
        } else {
            recBtn.disabled = true;
            recBtn.classList.add('disabled');
        }
    }

    async getSTEMRecommendation() {
        try {
            const response = await fetch('/get-stem-recommendation/');
            const data = await response.json();

            if (data.recommendation) {
                this.showSTEMRecommendation(data.recommendation, data.interests);
            } else {
                this.showEventContent('Error getting recommendation. Please try again.');
            }
        } catch (error) {
            console.error('Error getting recommendation:', error);
            this.showEventContent('Error getting recommendation. Please try again.');
        }
    }

    showSTEMRecommendation(recommendation, interests = null) {
        const modal = document.getElementById('recommendationModal');
        const content = document.getElementById('recommendationContent');

        let contentHTML = `
            <div class="recommendation-result">
                <div class="recommendation-main">
                    <i class="fas fa-star"></i>
                    <h2>${recommendation}</h2>
                    <p>Based on your life choices and interests, we recommend pursuing a career in <strong>${recommendation}</strong>!</p>
                </div>
        `;

        if (interests) {
            contentHTML += `
                <div class="interests-breakdown">
                    <h3>Your Interest Breakdown:</h3>
                    <div class="interest-breakdown-item">
                        <span>Science: ${interests.science}%</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${interests.science}%"></div>
                        </div>
                    </div>
                    <div class="interest-breakdown-item">
                        <span>Technology: ${interests.technology}%</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${interests.technology}%"></div>
                        </div>
                    </div>
                    <div class="interest-breakdown-item">
                        <span>Engineering: ${interests.engineering}%</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${interests.engineering}%"></div>
                        </div>
                    </div>
                    <div class="interest-breakdown-item">
                        <span>Mathematics: ${interests.math}%</span>
                        <div class="mini-progress">
                            <div class="mini-progress-fill" style="width: ${interests.math}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        contentHTML += `
                <div class="recommendation-actions">
                    <button class="btn-primary" onclick="this.closeModal()">
                        <i class="fas fa-check"></i>
                        Got it!
                    </button>
                </div>
            </div>
        `;

        content.innerHTML = contentHTML;
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('recommendationModal').style.display = 'none';
    }

    async resetGame() {
        try {
            const response = await fetch('/reset-game/');
            const data = await response.json();

            if (data.success) {
                // Reload the page to start fresh
                window.location.reload();
            } else {
                alert('Error resetting game. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting game:', error);
            alert('Error resetting game. Please try again.');
        }
    }

    getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LifeGame();
}); 