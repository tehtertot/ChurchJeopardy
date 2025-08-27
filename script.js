class JeopardyGame {
    constructor() {
        this.currentGroup = 1;
        this.groupElement = document.getElementById('current-group');
        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.answerText = document.getElementById('answer-text');
        this.showAnswerBtn = document.getElementById('show-answer');
        this.correctBtn = document.getElementById('correct');
        this.incorrectBtn = document.getElementById('incorrect');
        this.closeModalBtn = document.getElementById('close-modal');
        this.correctAmountSpan = document.getElementById('correct-amount');
        this.incorrectAmountSpan = document.getElementById('incorrect-amount');
        this.lightbulbBtn = document.getElementById('lightbulb-btn');
        this.jesusBtn = document.getElementById('jesus-btn');
        
        this.currentQuestionValue = 0;
        this.currentTile = null;
        this.questionsData = null;
        
        this.loadQuestions();
    }
    
    async loadQuestions() {
        try {
            // Try to load JSON first, then fall back to text file
            let response = await fetch('questions.json');
            if (response.ok) {
                this.questionsData = await response.json();
            } else {
                // Fallback to text file
                response = await fetch('questions.txt');
                if (response.ok) {
                    const textData = await response.text();
                    this.questionsData = this.parseTextFile(textData);
                } else {
                    // Final fallback to embedded questions
                    console.warn('Could not load external files, using embedded questions');
                    this.questionsData = this.getEmbeddedQuestions();
                }
            }
            this.createGameBoard();
            this.initializeGame();
        } catch (error) {
            console.error('Error loading questions:', error);
            console.warn('Using embedded questions as fallback');
            // Use embedded questions as final fallback
            this.questionsData = this.getEmbeddedQuestions();
            this.createGameBoard();
            this.initializeGame();
        }
    }
    
    getEmbeddedQuestions() {
        return {
            categories: [
                {
                    name: "LOVE",
                    id: "love",
                    questions: [
                        {
                            value: 100,
                            question: "Elder Wirthlin said, 'Do you love the Lord? Spend time with Him.' Why do you think it matters to spend time with the Lord? What is one way that you have found that works for you to spend time with Him?",
                            answer: "examples: prayer, meditation, music, art, studying scripture, etc."
                        },
                        {
                            value: 200,
                            question: "Is there anything keeping you from feeling God's and others' love for you when you come to church?",
                            answer: "Did you do it?"
                        },
                        {
                            value: 300,
                            question: "Think of someone in your life you find difficult to love. Ponder on one thing you can do to try to find love for them and commit to doing it this week.",
                            answer: "Did you do it?"
                        }
                    ]
                },
                {
                    name: "SHARE",
                    id: "share",
                    questions: [
                        {
                            value: 100,
                            question: "[Video Link](https://www.youtube.com/watch?v=01mbbpO2RjE) Which way sounds like it could work for you? How would you do that? Have you ever seen the gospel being shared this way? When or what was it that was shared? Who would be brave enough to do one of these right now?",
                            answer: "---"
                        },
                        {
                            value: 200,
                            question: "```While on a flight to Peru a few years ago, I was seated next to a self-proclaimed atheist. He asked me why I believe in God. In the delightful conversation that ensued, I told him that I believed in God because Joseph Smith saw Him—and then I added that my knowledge of God also came from personal, real spiritual experience.``` How does this relate to *sharing*? Has anyone had a similar experience similar to this? If you had been asked, \"Why do you believe in God?\" what would you say?",
                            answer: "Personal testimony and sharing experiences"
                        },
                        {
                            value: 300,
                            question: "Elder Nash (GC 2021) said, ```When we were baptized, each of us entered into a perpetual covenant with God to \"serve him and keep his commandments,\" which includes \"to stand as witnesses of [Him] at all times and in all things, and in all places.\"``` What could that power look like in our daily lives?",
                            answer: "Standing as witnesses in all aspects of life"
                        }
                    ]
                },
                {
                    name: "INVITE",
                    id: "invite",
                    questions: [
                        {
                            value: 100,
                            question: "Church Leaders Share Their First Invitation to Church (video) - How can you relate? Or, what's your story?",
                            answer: "---"
                        },
                        {
                            value: 200,
                            question: "*[image of Christ at the door without a doorknob]* - How does this relate to inviting others to come unto Christ?",
                            answer: "---"
                        },
                        {
                            value: 300,
                            question: "How does inviting our friends honor our covenants?",
                            answer: "---"
                        }
                    ]
                }
            ]
        };
    }
    
    parseTextFile(textData) {
        const lines = textData.split('\n').filter(line => 
            line.trim() && !line.trim().startsWith('#')
        );
        
        const categories = {};
        
        lines.forEach(line => {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length === 4) {
                const [categoryName, value, question, answer] = parts;
                
                if (!categories[categoryName]) {
                    categories[categoryName] = {
                        name: categoryName,
                        id: categoryName.toLowerCase(),
                        questions: []
                    };
                }
                
                categories[categoryName].questions.push({
                    value: parseInt(value),
                    question: question,
                    answer: answer
                });
            }
        });
        
        // Sort questions by value for each category
        Object.values(categories).forEach(category => {
            category.questions.sort((a, b) => a.value - b.value);
        });
        
        return {
            categories: Object.values(categories)
        };
    }
    
    createGameBoard() {
        const categoryHeaders = document.getElementById('category-headers');
        const questionGrid = document.getElementById('question-grid');
        
        // Clear existing content
        categoryHeaders.innerHTML = '';
        questionGrid.innerHTML = '';
        
        // Create category headers
        this.questionsData.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.textContent = category.name;
            categoryHeaders.appendChild(categoryDiv);
        });
        
        // Create question tiles in column order (only 100-300)
        this.questionsData.categories.forEach(category => {
            category.questions.forEach(questionData => {
                if (questionData.value <= 300) { // Only include 100, 200, 300
                    const tile = document.createElement('div');
                    tile.className = 'question-tile';
                    tile.setAttribute('data-category', category.id);
                    tile.setAttribute('data-value', questionData.value);
                    tile.setAttribute('data-question', questionData.question);
                    tile.setAttribute('data-answer', questionData.answer);
                    tile.textContent = `$${questionData.value}`;
                    questionGrid.appendChild(tile);
                }
            });
        });
    }
    
    initializeGame() {
        // Add event listeners to all question tiles
        const questionTiles = document.querySelectorAll('.question-tile');
        questionTiles.forEach(tile => {
            tile.addEventListener('click', () => this.openQuestion(tile));
        });
        
        // Add event listeners to modal buttons
        this.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        this.correctBtn.addEventListener('click', () => this.markAnswered());
        this.incorrectBtn.addEventListener('click', () => this.markAnswered());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Add event listeners to header buttons
        this.lightbulbBtn.addEventListener('click', () => this.openLightbulbVideo());
        this.jesusBtn.addEventListener('click', () => this.openJesusPicture());
        
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
    
    renderMarkdown(text) {
        // Simple markdown parser for basic formatting
        let html = text
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // URLs without markdown syntax
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
            // Bold
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Italics
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Code blocks (triple backticks)
            .replace(/```([^`]+)```/g, '<blockquote class="code-block">$1</blockquote>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Line breaks
            .replace(/\n/g, '<br>');
        
        return html;
    }
    
    openQuestion(tile) {
        // Check if tile has already been answered
        if (tile.classList.contains('answered')) {
            return;
        }
        
        this.currentTile = tile;
        this.currentQuestionValue = parseInt(tile.dataset.value);
        
        // Set question text with markdown rendering
        this.questionText.innerHTML = this.renderMarkdown(tile.dataset.question);
        
        // Set answer text with markdown rendering (hidden initially)
        this.answerText.innerHTML = this.renderMarkdown(tile.dataset.answer);
        
        // Remove dollar amount display from buttons since we're not scoring
        this.correctBtn.innerHTML = 'Done';
        this.incorrectBtn.innerHTML = 'Done';
        
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
    
    markAnswered() {
        this.markTileAnswered();
        this.nextGroup();
        this.closeModal();
    }
    
    nextGroup() {
        this.currentGroup = this.currentGroup === 3 ? 1 : this.currentGroup + 1;
        this.groupElement.textContent = this.currentGroup;
        
        // Add visual feedback for group change
        this.groupElement.parentElement.classList.add('group-change');
        setTimeout(() => {
            this.groupElement.parentElement.classList.remove('group-change');
        }, 500);
    }
    
    openLightbulbVideo() {
        // Open lightbulb video in new tab
        window.open('https://www.youtube.com/watch?v=your-lightbulb-video-id', '_blank');
    }
    
    openJesusPicture() {
        // Open Jesus picture in new tab
        window.open('https://www.churchofjesuschrist.org/media/image/jesus-christ-pictures', '_blank');
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
        this.currentGroup = 1;
        this.groupElement.textContent = '1';
        
        const questionTiles = document.querySelectorAll('.question-tile');
        questionTiles.forEach(tile => {
            tile.classList.remove('answered');
            tile.textContent = '$' + tile.dataset.value;
        });
    }
}

// Add CSS animation for celebration and group changes
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
    
    .group-change {
        animation: groupFlash 0.5s ease-in-out;
    }
    
    @keyframes groupFlash {
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
    console.log('Categories: Love, Share, Invite (Values: $100-$300)');
    console.log('Group rotation: 1 → 2 → 3 → 1...');
    console.log('Click on any dollar amount to start playing!');
});
