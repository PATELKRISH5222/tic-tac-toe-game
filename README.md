# Ultimate Tic-Tac-Toe AI

## CodSoft Internship Task

**Task:** Task 2 - Tic-Tac-Toe AI

This project is developed as part of the **CodSoft Artificial Intelligence Internship**.

The project implements an AI agent that plays Tic-Tac-Toe against a human player using the **Minimax Algorithm with Alpha-Beta Pruning**.

## 1. Project Overview

**Ultimate Tic-Tac-Toe AI** is a web-based Tic-Tac-Toe game where a human player competes against an intelligent AI opponent.

The project uses the **Minimax Algorithm with Alpha-Beta Pruning** to provide optimal AI gameplay in Hard mode.

## 2. Objectives

- Develop an interactive Tic-Tac-Toe game.
- Implement an intelligent AI opponent.
- Provide multiple difficulty levels.
- Track game statistics and move history.
- Provide an attractive and responsive user interface.

## 3. Features

- Human vs AI gameplay
- X/O symbol selection
- First-turn selection
- Easy, Medium, and Hard difficulty
- Minimax + Alpha-Beta Pruning
- Move history
- Win, Loss, and Draw statistics
- Win rate calculation
- Winner highlighting
- Built-in game sounds
- New Round
- Reset Statistics
- Responsive design

## 4. Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript**
- **Minimax Algorithm**
- **Alpha-Beta Pruning**
- **Web Audio API**

## 5. AI Difficulty

### Easy

AI selects a random available move.

### Medium

AI checks for winning moves, blocks the player's winning move, prefers the center, and then selects a random available move.

### Hard

AI uses **Minimax with Alpha-Beta Pruning** to determine the optimal move.

## 6. How to Run

1. Download or clone the project.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Select the desired settings.
5. Start playing against the AI.

## 7. Project Structure

Ultimate-Tic-Tac-Toe-AI/
│
├── index.html
├── style.css
├── script.js
└── README.md

## 8. Game Working

1. The player selects their symbol, first turn, and difficulty level.
2. The player makes a move by selecting an empty cell.
3. The AI analyzes the current game board.
4. The AI selects a move according to the selected difficulty.
5. The game checks for a win, loss, or draw after every move.
6. The winning combination is highlighted when a player wins.
7. Game statistics and move history are updated automatically.

## 9. Minimax Algorithm

The **Minimax Algorithm** is used by the Hard AI to analyze possible future game states.

The AI tries to maximize its score while assuming that the human player will try to minimize the AI's score.

The scoring system is:

- AI Win → `10 - depth`
- Human Win → `depth - 10`
- Draw → `0`

This allows the AI to select the best possible move.

## 10. Alpha-Beta Pruning

**Alpha-Beta Pruning** improves the Minimax algorithm by removing game states that do not need to be evaluated.

It uses two values:

- **Alpha** → Best value found for the maximizing player.
- **Beta** → Best value found for the minimizing player.

When `beta <= alpha`, further branches are skipped.

This reduces unnecessary calculations and makes the AI more efficient.

## 11. Game Statistics

The application tracks:

- Total Games
- Wins
- Losses
- Draws
- Win Rate

The win rate is calculated using:

**Win Rate = (Wins / Total Games) × 100**

## 12. Move History

The game records every move made by the player and AI.

The move history displays:

- Move number
- Player
- Board position
- Symbol used

Example:

1. You → Center X
2. AI → Top Left O

## 13. Game Sounds

The project includes built-in game sounds using the **Web Audio API**.

No external MP3 or audio files are required.

Different sounds are used for:

- Player or AI move
- Player victory
- AI victory
- Draw

## 14. User Interface

The application provides:

- Modern dark-themed interface
- Responsive game board
- Game settings
- Score cards
- AI status
- Move history
- Game statistics
- Result panel
- New Round button
- Reset Statistics button

## 15. Result

The project provides a fully functional browser-based Tic-Tac-Toe game with intelligent AI gameplay, multiple difficulty levels, statistics, move history, sound effects, winner highlighting, and a responsive user interface.

## 16. Future Scope

- Online multiplayer mode
- Leaderboard system
- Player profiles
- Advanced AI improvements
- Mobile application version
- Online game history
- Additional game modes

## 17. Conclusion

The **Ultimate Tic-Tac-Toe AI** project demonstrates the practical use of **HTML, CSS, JavaScript, Minimax Algorithm, and Alpha-Beta Pruning** to create an interactive AI-based game.

The project provides different difficulty levels and an intelligent AI opponent while maintaining game statistics, move history, sound effects, and a responsive user interface.
