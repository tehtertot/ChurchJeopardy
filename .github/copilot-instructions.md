<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Church Jeopardy Game - Copilot Instructions

This is an interactive web-based Jeopardy game with a church theme featuring three categories: Love, Share, and Invite.

## Project Structure
- `index.html` - Main HTML file with game board and modal structure
- `styles.css` - CSS styling with responsive design and animations
- `script.js` - JavaScript game logic with scoring and interaction handling

## Key Features
- Interactive game board with 3 categories (Love, Share, Invite)
- 5 questions per category with increasing dollar values ($200, $400, $600, $800, $1000)
- Score tracking with visual feedback
- Modal-based question/answer system
- Responsive design for mobile and desktop
- Visual effects for correct answers and score changes

## Design Patterns
- Class-based JavaScript for game state management
- Event-driven architecture for user interactions
- CSS Grid for responsive game board layout
- Modal overlay pattern for question display

## Styling Guidelines
- Primary colors: Blue gradient background (#1e3c72 to #2a5298)
- Accent color: Gold (#FFD700) for headers and buttons
- Use backdrop blur effects for modern glass-morphism design
- Maintain accessibility with good contrast ratios

## Game Logic
- Questions become unclickable after being answered
- Correct answers add points, incorrect answers subtract points
- Visual feedback for all user actions
- Celebration effects for correct answers
