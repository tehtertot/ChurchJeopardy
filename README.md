# Church Jeopardy Game

An interactive web-based Jeopardy game with a church theme, featuring three categories: **Love**, **Share**, and **Invite**.

## 🎮 Features

- **Interactive Game Board**: Click on dollar amounts to reveal questions
- **Three Categories**: Love, Share, and Invite with biblical themes
- **Score Tracking**: Automatic scoring with visual feedback
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with glass-morphism effects
- **Sound Feedback**: Visual celebrations for correct answers

## 🚀 How to Play

1. Open `index.html` in your web browser
2. Questions are automatically loaded from `questions.json` or `questions.txt`
3. Click on any dollar amount tile to reveal a question
4. Read the question and think of your answer
5. Click "Show Answer" to reveal the correct answer
6. Mark whether you got it correct or incorrect
7. Your score will automatically update
8. Continue until all questions are answered!

## 📝 Customizing Questions

You can customize the questions in two ways:

### Option 1: JSON Format (`questions.json`)
Edit the `questions.json` file with structured data:
```json
{
  "categories": [
    {
      "name": "LOVE",
      "id": "love",
      "questions": [
        {
          "value": 100,
          "question": "Your question here",
          "answer": "Your answer here"
        }
      ]
    }
  ]
}
```

### Option 2: Simple Text Format (`questions.txt`)
Edit the `questions.txt` file using this simple format:
```
# Comments start with #
CATEGORY|VALUE|QUESTION|ANSWER

# Example:
LOVE|100|What does 1 Corinthians 13:4 say love is?|What is patient and kind?
```

The game will automatically try to load `questions.json` first, then fall back to `questions.txt` if the JSON file isn't found.

## 📁 Project Structure

```
church-jeopardy/
├── index.html          # Main game page
├── styles.css          # Game styling and animations
├── script.js           # Game logic and interactions
├── questions.json      # Questions in JSON format
├── questions.txt       # Questions in simple text format
├── README.md           # This file
└── .github/
    └── copilot-instructions.md
```

## 💰 Scoring System

- **Correct Answer**: Add the dollar value to your score
- **Incorrect Answer**: Subtract the dollar value from your score
- **Question Values**: $200, $400, $600, $800, $1000 per category

## 🎯 Categories & Sample Questions

### Love
- Questions about God's love, biblical love stories, and loving your neighbor

### Share
- Questions about sharing, giving, and community in the Bible

### Invite
- Questions about Jesus' invitations and calling others to faith

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **Responsive Design** - CSS Grid and Flexbox
- **Modern Features** - CSS backdrop filters and animations
- **Accessibility** - Keyboard navigation and screen reader friendly

## 🌐 Browser Support

This game works in all modern browsers that support:
- CSS Grid
- CSS Backdrop Filters
- ES6 JavaScript Classes

## 🎨 Customization

You can easily customize the game by:
- Editing questions in `index.html` data attributes
- Modifying colors and styles in `styles.css`
- Adding new features in `script.js`

## 📱 Mobile Friendly

The game is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development

To modify the game:
1. Edit the HTML file to change questions and answers
2. Modify CSS for styling changes
3. Update JavaScript for new game features

## 🎉 Enjoy Playing!

Have fun testing your biblical knowledge with this interactive Jeopardy game!
