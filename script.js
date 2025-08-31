class JeopardyGame {
    constructor() {
        this.currentGroup = 1;
        this.groupElement = document.getElementById('current-group');
        this.modal = document.getElementById('question-modal');
        this.questionText = document.getElementById('question-text');
        this.closeModalBtn = document.getElementById('close-modal');
        this.lightbulbBtn = document.getElementById('lightbulb-btn');
        this.jesusBtn = document.getElementById('jesus-btn');
        
        this.currentQuestionValue = 0;
        this.currentTile = null;
        this.questionsData = null;
        
        this.loadQuestions();
    }
    
    async loadQuestions() {
        try {
            // For static deployment, skip file loading and use embedded questions
            console.log('Static deployment mode: using embedded questions');
            this.questionsData = this.getEmbeddedQuestions();
            this.createGameBoard();
            this.initializeGame();
        } catch (error) {
            console.error('Error loading questions:', error);
            // Use embedded questions as fallback
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
                            question: "Elder Wirthlin said, ```Do you love the Lord? Spend time with Him.``` Why do you think it matters to spend time with the Lord? What is one way that you have found that works for you to spend time with Him?",
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
                            question: "https://www.youtube.com/watch?v=01mbbpO2RjE\nWhich way sounds like it could work for you? How would you do that? Have you ever seen the gospel being shared this way? When or what was it that was shared? Who would be brave enough to do one of these right now?",
                            answer: "---"
                        },
                        {
                            value: 200,
                            question: "Look up Hymn 223. Read through the verses and share with us how it fits the topic of Share.",
                            answer: "Personal testimony and sharing experiences"
                        },
                        {
                            value: 300,
                            question: "Elder Nash (GC 2021) said: ```When we were baptized, each of us entered into a perpetual covenant with God to \"serve him and keep his commandments,\" which includes \"to stand as witnesses of [Him] at all times and in all things, and in all places.\" As we \"abide in\" Him by keeping this covenant, the enlivening, sustaining, sanctifying power of godliness flows into our lives from Christ, just as a branch receives nourishment from the vine.``` What could that power look like in our daily lives?",
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
                            question: "[video](./InviteStories.mp4) How can you relate? Or, what's your story?",
                            answer: "---"
                        },
                        {
                            value: 200,
                            question: "[Jesus at the door](./JesusDoor.jpeg)\nHow does this relate to inviting others to come unto Christ?",
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
        
        // Add event listener to close button
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
        // Simple markdown parser for basic formatting and media
        let html = text
            // Handle video links with [video](path) syntax FIRST (before general links)
            .replace(/\[video\]\(([^)]+)\)/g, (match, url) => {
                if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
                    return `<video controls style="max-width: 100%; margin: 10px 0;"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
                } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    // Convert YouTube URLs to embedded format
                    let videoId = url.includes('youtu.be') ? 
                        url.split('youtu.be/')[1].split('?')[0] : 
                        url.split('v=')[1].split('&')[0];
                    return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="margin: 10px 0;"></iframe>`;
                }
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">video</a>`;
            })
            // Handle simple image syntax [./filename.ext] 
            .replace(/\[\.\/(.*?\.(?:jpg|jpeg|png|gif|webp|bmp|svg))\]/gi, '<img src="./$1" alt="Image" style="max-width: 100%; margin: 10px 0; border-radius: 8px;" onerror="console.error(\'Failed to load image: ./$1\')">')
            // Handle full path image syntax [filename.ext] 
            .replace(/\[([^[\]]*\.(?:jpg|jpeg|png|gif|webp|bmp|svg))\]/gi, '<img src="$1" alt="Image" style="max-width: 100%; margin: 10px 0; border-radius: 8px;" onerror="console.error(\'Failed to load image: $1\')">')
            // Handle markdown image syntax [alt](path.ext)
            .replace(/\[([^[\]]*)\]\(([^)]+\.(?:jpg|jpeg|png|gif|webp|bmp|svg))\)/gi, '<img src="$2" alt="$1" style="max-width: 100%; margin: 10px 0; border-radius: 8px;" onerror="console.error(\'Failed to load image: $2\')">')
            // Regular links (after video and image processing to avoid conflicts)
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
        
        // Show modal
        this.modal.style.display = 'block';
        
        // Add a small delay for better UX
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        if (this.currentTile) {
            this.markTileAnswered();
            this.nextGroup();
        }
        this.currentTile = null;
        this.currentQuestionValue = 0;
    }
    
    markTileAnswered() {
        if (this.currentTile) {
            this.currentTile.classList.add('answered');
            this.currentTile.textContent = '✓';
        }
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
        window.open('https://youtu.be/cKkbIZtqhyQ', '_blank');
    }
    
    openJesusPicture() {
        // Open local Jesus picture in new tab
        window.open('./JesusWater.jpg', '_blank');
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
