// Life As STEM - Interactive Learning Game
class LifeAsStemGame {
    constructor() {
        this.playerAge = 10;
        this.plantHeight = 0;
        this.score = 0;
        this.currentQuestion = null;
        this.questionsAnswered = 0;
        this.gameState = 'idle'; // idle, growing, questioning, completed
        
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.plantSegments = [];
        this.animationId = null;
        
        // Question bank
        this.questions = [
            {
                id: 1,
                question: "What is the chemical formula for water?",
                options: ["H2O", "CO2", "O2", "N2"],
                correct: 0,
                explanation: "Water is composed of two hydrogen atoms and one oxygen atom."
            },
            {
                id: 2,
                question: "Which planet is closest to the Sun?",
                options: ["Venus", "Mercury", "Earth", "Mars"],
                correct: 1,
                explanation: "Mercury is the first planet from the Sun in our solar system."
            },
            {
                id: 3,
                question: "What is the square root of 144?",
                options: ["10", "11", "12", "13"],
                correct: 2,
                explanation: "12 × 12 = 144, so the square root of 144 is 12."
            },
            {
                id: 4,
                question: "What type of energy does a moving object have?",
                options: ["Potential", "Kinetic", "Thermal", "Chemical"],
                correct: 1,
                explanation: "Kinetic energy is the energy of motion."
            },
            {
                id: 5,
                question: "How many sides does a hexagon have?",
                options: ["4", "5", "6", "7"],
                correct: 2,
                explanation: "A hexagon is a six-sided polygon."
            },
            {
                id: 6,
                question: "What is the main component of air?",
                options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
                correct: 1,
                explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
            },
            {
                id: 7,
                question: "What is 2^3 equal to?",
                options: ["4", "6", "8", "10"],
                correct: 2,
                explanation: "2^3 = 2 × 2 × 2 = 8."
            },
            {
                id: 8,
                question: "Which element has the chemical symbol 'Fe'?",
                options: ["Iron", "Fluorine", "Francium", "Fermium"],
                correct: 0,
                explanation: "Fe is the chemical symbol for Iron, from the Latin 'ferrum'."
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStats();
        this.drawPlant();
        this.startAnimation();
    }
    
    setupEventListeners() {
        // Grow button
        document.getElementById('growBtn').addEventListener('click', () => {
            this.growPlant();
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.performSearch();
        });
        
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // Canvas click for interactive elements
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
    }
    
    growPlant() {
        if (this.gameState === 'growing') return;
        
        this.gameState = 'growing';
        this.playerAge++;
        this.plantHeight += Math.floor(Math.random() * 3) + 1;
        this.score += 10;
        
        // Add new plant segment
        this.addPlantSegment();
        
        // Update display
        this.updateStats();
        
        // Show question after a short delay
        setTimeout(() => {
            this.showQuestion();
        }, 1000);
        
        // Add visual feedback
        this.addGrowEffect();
    }
    
    addPlantSegment() {
        const segment = {
            x: this.canvas.width / 2 + (Math.random() - 0.5) * 100,
            y: this.canvas.height - 50 - this.plantSegments.length * 30,
            width: Math.random() * 20 + 10,
            height: Math.random() * 30 + 20,
            color: `hsl(${120 + Math.random() * 40}, 70%, ${40 + Math.random() * 20}%)`
        };
        this.plantSegments.push(segment);
    }
    
    addGrowEffect() {
        const growEffect = document.createElement('div');
        growEffect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: #10b981;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            animation: growEffect 1s ease-out forwards;
        `;
        growEffect.textContent = '+1';
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes growEffect {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(2) translateY(-50px); }
            }
        `;
        document.head.appendChild(style);
        
        this.canvas.parentElement.appendChild(growEffect);
        
        setTimeout(() => {
            growEffect.remove();
        }, 1000);
    }
    
    showQuestion() {
        if (this.questionsAnswered >= this.questions.length) {
            this.showCompletion();
            return;
        }
        
        this.gameState = 'questioning';
        this.currentQuestion = this.questions[this.questionsAnswered];
        
        const questionContent = document.getElementById('questionContent');
        const questionActions = document.getElementById('questionActions');
        
        questionContent.innerHTML = `<p>${this.currentQuestion.question}</p>`;
        
        // Create answer options
        questionActions.innerHTML = '';
        this.currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-option';
            button.textContent = option;
            button.addEventListener('click', () => {
                this.handleAnswer(index);
            });
            questionActions.appendChild(button);
        });
        
        // Show question panel with animation
        document.getElementById('questionPanel').classList.add('fade-in');
        document.getElementById('questionPanel').style.display = 'block';
    }
    
    handleAnswer(selectedIndex) {
        const isCorrect = selectedIndex === this.currentQuestion.correct;
        const answerButtons = document.querySelectorAll('.answer-option');
        
        // Disable all buttons
        answerButtons.forEach(btn => btn.style.pointerEvents = 'none');
        
        // Show correct/incorrect feedback
        answerButtons.forEach((btn, index) => {
            if (index === this.currentQuestion.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Update score
        if (isCorrect) {
            this.score += 20;
            this.addScoreEffect();
        }
        
        // Show explanation
        const questionContent = document.getElementById('questionContent');
        questionContent.innerHTML = `
            <p><strong>${isCorrect ? 'Correct!' : 'Incorrect!'}</strong></p>
            <p>${this.currentQuestion.explanation}</p>
        `;
        
        // Continue after delay
        setTimeout(() => {
            this.continueGame();
        }, 2000);
    }
    
    addScoreEffect() {
        const scoreEffect = document.createElement('div');
        scoreEffect.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 1.5rem;
            color: #10b981;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            animation: scoreEffect 1s ease-out forwards;
        `;
        scoreEffect.textContent = '+20';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scoreEffect {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.5) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(scoreEffect);
        
        setTimeout(() => {
            scoreEffect.remove();
        }, 1000);
    }
    
    continueGame() {
        this.questionsAnswered++;
        this.gameState = 'idle';
        
        // Hide question panel
        document.getElementById('questionPanel').style.display = 'none';
        
        // Update stats
        this.updateStats();
        
        // Check if game is complete
        if (this.questionsAnswered >= this.questions.length) {
            this.showCompletion();
        }
    }
    
    showCompletion() {
        this.gameState = 'completed';
        
        const questionContent = document.getElementById('questionContent');
        const questionActions = document.getElementById('questionActions');
        
        questionContent.innerHTML = `
            <h3>🎉 Congratulations! 🎉</h3>
            <p>You've completed all the STEM questions!</p>
            <p>Final Score: ${this.score}</p>
            <p>Plant Height: ${this.plantHeight} units</p>
        `;
        
        questionActions.innerHTML = `
            <button class="control-btn primary" onclick="game.resetGame()">
                <i class="fas fa-redo"></i>
                <span>Play Again</span>
            </button>
        `;
        
        document.getElementById('questionPanel').style.display = 'block';
        document.getElementById('questionPanel').classList.add('fade-in');
    }
    
    resetGame() {
        this.playerAge = 10;
        this.plantHeight = 0;
        this.score = 0;
        this.questionsAnswered = 0;
        this.gameState = 'idle';
        this.plantSegments = [];
        
        // Reset question panel
        document.getElementById('questionPanel').style.display = 'none';
        document.getElementById('questionContent').innerHTML = '<p>Ready to learn? Click "Grow & Learn" to start!</p>';
        document.getElementById('questionActions').innerHTML = '';
        
        // Update display
        this.updateStats();
        this.drawPlant();
        
        // Add reset effect
        this.addResetEffect();
    }
    
    addResetEffect() {
        const resetEffect = document.createElement('div');
        resetEffect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(16, 185, 129, 0.1);
            pointer-events: none;
            z-index: 999;
            animation: resetEffect 0.5s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes resetEffect {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(resetEffect);
        
        setTimeout(() => {
            resetEffect.remove();
        }, 500);
    }
    
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (!query) return;
        
        // Simulate search functionality
        const searchResults = this.searchQuestions(query);
        
        if (searchResults.length > 0) {
            this.showSearchResults(searchResults);
        } else {
            this.showSearchResults([{ question: "No results found for '" + query + "'", explanation: "Try searching for different STEM topics like 'water', 'planet', 'math', etc." }]);
        }
        
        searchInput.value = '';
    }
    
    searchQuestions(query) {
        const lowerQuery = query.toLowerCase();
        return this.questions.filter(q => 
            q.question.toLowerCase().includes(lowerQuery) ||
            q.explanation.toLowerCase().includes(lowerQuery)
        );
    }
    
    showSearchResults(results) {
        const questionContent = document.getElementById('questionContent');
        const questionActions = document.getElementById('questionActions');
        
        questionContent.innerHTML = `
            <h3>🔍 Search Results</h3>
            ${results.map(result => `
                <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 10px;">
                    <p><strong>${result.question}</strong></p>
                    <p style="font-size: 0.9rem; color: #6b7280;">${result.explanation}</p>
                </div>
            `).join('')}
        `;
        
        questionActions.innerHTML = `
            <button class="control-btn secondary" onclick="game.hideSearchResults()">
                <i class="fas fa-times"></i>
                <span>Close</span>
            </button>
        `;
        
        document.getElementById('questionPanel').style.display = 'block';
        document.getElementById('questionPanel').classList.add('fade-in');
    }
    
    hideSearchResults() {
        document.getElementById('questionPanel').style.display = 'none';
        if (this.gameState === 'idle') {
            document.getElementById('questionContent').innerHTML = '<p>Ready to learn? Click "Grow & Learn" to start!</p>';
            document.getElementById('questionActions').innerHTML = '';
        }
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is on a plant segment
        this.plantSegments.forEach((segment, index) => {
            if (x >= segment.x - segment.width/2 && 
                x <= segment.x + segment.width/2 &&
                y >= segment.y - segment.height &&
                y <= segment.y) {
                this.showSegmentInfo(segment, index);
            }
        });
    }
    
    showSegmentInfo(segment, index) {
        const questionContent = document.getElementById('questionContent');
        const questionActions = document.getElementById('questionActions');
        
        questionContent.innerHTML = `
            <h3>🌱 Plant Segment #${index + 1}</h3>
            <p><strong>Height:</strong> ${segment.height.toFixed(1)} units</p>
            <p><strong>Width:</strong> ${segment.width.toFixed(1)} units</p>
            <p><strong>Color:</strong> ${segment.color}</p>
        `;
        
        questionActions.innerHTML = `
            <button class="control-btn secondary" onclick="game.hideSegmentInfo()">
                <i class="fas fa-times"></i>
                <span>Close</span>
            </button>
        `;
        
        document.getElementById('questionPanel').style.display = 'block';
        document.getElementById('questionPanel').classList.add('fade-in');
    }
    
    hideSegmentInfo() {
        document.getElementById('questionPanel').style.display = 'none';
        if (this.gameState === 'idle') {
            document.getElementById('questionContent').innerHTML = '<p>Ready to learn? Click "Grow & Learn" to start!</p>';
            document.getElementById('questionActions').innerHTML = '';
        }
    }
    
    updateStats() {
        document.getElementById('playerAge').textContent = this.playerAge;
        document.getElementById('plantHeight').textContent = this.plantHeight;
        document.getElementById('score').textContent = this.score;
    }
    
    drawPlant() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        
        // Draw plant segments
        this.plantSegments.forEach(segment => {
            this.ctx.fillStyle = segment.color;
            this.ctx.fillRect(
                segment.x - segment.width/2,
                segment.y - segment.height,
                segment.width,
                segment.height
            );
            
            // Add some texture
            this.ctx.strokeStyle = '#2d5016';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                segment.x - segment.width/2,
                segment.y - segment.height,
                segment.width,
                segment.height
            );
        });
        
        // Draw leaves on segments
        this.plantSegments.forEach(segment => {
            this.drawLeaves(segment);
        });
    }
    
    drawLeaves(segment) {
        this.ctx.fillStyle = '#228B22';
        
        // Left leaf
        this.ctx.beginPath();
        this.ctx.ellipse(
            segment.x - segment.width/2 - 10,
            segment.y - segment.height/2,
            8, 15, Math.PI/4, 0, 2*Math.PI
        );
        this.ctx.fill();
        
        // Right leaf
        this.ctx.beginPath();
        this.ctx.ellipse(
            segment.x + segment.width/2 + 10,
            segment.y - segment.height/2,
            8, 15, -Math.PI/4, 0, 2*Math.PI
        );
        this.ctx.fill();
    }
    
    startAnimation() {
        const animate = () => {
            // Add subtle plant movement
            this.plantSegments.forEach(segment => {
                segment.x += Math.sin(Date.now() * 0.001 + segment.y * 0.01) * 0.5;
            });
            
            this.drawPlant();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new LifeAsStemGame();
    
    // Add some initial visual polish
    document.body.classList.add('fade-in');
    
    // Add particle effect to header
    const header = document.querySelector('.header');
    header.addEventListener('mouseenter', () => {
        header.style.transform = 'scale(1.02)';
        header.style.transition = 'transform 0.3s ease';
    });
    
    header.addEventListener('mouseleave', () => {
        header.style.transform = 'scale(1)';
    });
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (window.game && window.game.gameState === 'idle') {
                window.game.growPlant();
            }
        }
        
        if (e.key === 'r' || e.key === 'R') {
            if (window.game) {
                window.game.resetGame();
            }
        }
    });
    
    // Add tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width/2 - tooltip.offsetWidth/2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            e.target.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
});








