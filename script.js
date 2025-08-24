class JeopardyGame {
    constructor() {
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.answerText = document.getElementById('answer-text');
        this.showAnswerBtn = document.getElementById('show-answer');
        this.correctBtn = document.getElementById('correct');
        this.incorrectBtn = document.getElementById('incorrect');
        this.closeModalBtn = document.getElementById('close-modal');
        this.correctAmountSpan = document.getElementById('correct-amount');
        this.incorrectAmountSpan = document.getElementById('incorrect-amount');
        
        this.currentQuestionValue = 0;
        this.currentTile = null;
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Add event listeners to all question tiles
        const questionTiles = document.querySelectorAll('.question-tile');
        questionTiles.forEach(tile => {
            tile.addEventListener('click', () => this.openQuestion(tile));
        });
        
        // Add event listeners to modal buttons
        this.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        this.correctBtn.addEventListener('click', () => this.markCorrect());
        this.incorrectBtn.addEventListener('click', () => this.markIncorrect());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    openQuestion(tile) {
        // Check if tile has already been answered
        if (tile.classList.contains('answered')) {
            return;
        }
        
        this.currentTile = tile;
        this.currentQuestionValue = parseInt(tile.dataset.value);
        
        // Set question text
        this.questionText.textContent = tile.dataset.question;
        
        // Set answer text (hidden initially)
        this.answerText.textContent = tile.dataset.answer;
        
        // Set button amounts
        this.correctAmountSpan.textContent = this.currentQuestionValue;
        this.incorrectAmountSpan.textContent = this.currentQuestionValue;
        
        // Reset modal state
        this.showAnswerBtn.style.display = 'inline-block';
        this.correctBtn.style.display = 'none';
        this.incorrectBtn.style.display = 'none';
        this.closeModalBtn.style.display = 'none';
        this.answerText.style.display = 'none';
        
        // Show modal
        this.modal.style.display = 'block';
        
        // Add a small delay for better UX
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }
    
    showAnswer() {
        // Hide show answer button
        this.showAnswerBtn.style.display = 'none';
        
        // Show answer text
        this.answerText.style.display = 'block';
        
        // Show correct/incorrect buttons
        this.correctBtn.style.display = 'inline-block';
        this.incorrectBtn.style.display = 'inline-block';
        this.closeModalBtn.style.display = 'inline-block';
    }
    
    markCorrect() {
        this.updateScore(this.currentQuestionValue);
        this.markTileAnswered();
        this.closeModal();
        this.celebrateCorrectAnswer();
    }
    
    markIncorrect() {
        this.updateScore(-this.currentQuestionValue);
        this.markTileAnswered();
        this.closeModal();
    }
    
    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score.toLocaleString();
        
        // Add visual feedback for score change
        this.scoreElement.parentElement.classList.add('score-change');
        setTimeout(() => {
            this.scoreElement.parentElement.classList.remove('score-change');
        }, 500);
    }
    
    markTileAnswered() {
        if (this.currentTile) {
            this.currentTile.classList.add('answered');
            this.currentTile.textContent = '✓';
        }
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        this.currentTile = null;
        this.currentQuestionValue = 0;
    }
    
    celebrateCorrectAnswer() {
        // Add a simple celebration effect
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉';
        celebration.style.position = 'fixed';
        celebration.style.top = '50%';
        celebration.style.left = '50%';
        celebration.style.transform = 'translate(-50%, -50%)';
        celebration.style.fontSize = '4rem';
        celebration.style.zIndex = '1001';
        celebration.style.animation = 'celebrationPop 1s ease-out forwards';
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 1000);
    }
    
    // Method to check if all questions have been answered
    isGameComplete() {
        const questionTiles = document.querySelectorAll('.question-tile');
        const answeredTiles = document.querySelectorAll('.question-tile.answered');
        return questionTiles.length === answeredTiles.length;
    }
    
    // Method to reset the game
    resetGame() {
        this.score = 0;
        this.scoreElement.textContent = '0';
        
        const questionTiles = document.querySelectorAll('.question-tile');
        questionTiles.forEach(tile => {
            tile.classList.remove('answered');
            tile.textContent = '$' + tile.dataset.value;
            tile.style.fontSize = '2rem';
        });
    }
}

// Add CSS animation for celebration
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrationPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
    
    .score-change {
        animation: scoreFlash 0.5s ease-in-out;
    }
    
    @keyframes scoreFlash {
        0%, 100% {
            background: rgba(255, 255, 255, 0.1);
        }
        50% {
            background: rgba(255, 215, 0, 0.3);
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new JeopardyGame();
    
    // Make the game object globally accessible for debugging
    window.jeopardyGame = game;
    
    console.log('Church Jeopardy Game initialized! 🎉');
    console.log('Categories: Love, Share, Invite');
    console.log('Click on any dollar amount to start playing!');
});
