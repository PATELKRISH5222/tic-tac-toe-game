// ============================================================
// ULTIMATE TIC-TAC-TOE AI
// Minimax + Alpha-Beta Pruning
// Built-in Game Sounds
// ============================================================


// ============================================================
// AUDIO
// ============================================================

let audioContext = null;

function initAudio() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    }

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }

}


function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.08
) {

    initAudio();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );

}


function playMoveSound() {

    playTone(
        650,
        0.10,
        "sine",
        0.10
    );

}


function playWinSound() {

    playTone(
        523,
        0.12,
        "sine",
        0.10
    );

    setTimeout(() => {

        playTone(
            659,
            0.12,
            "sine",
            0.10
        );

    }, 120);

    setTimeout(() => {

        playTone(
            784,
            0.18,
            "sine",
            0.10
        );

    }, 240);

}


function playLoseSound() {

    playTone(
        400,
        0.18,
        "sawtooth",
        0.07
    );

    setTimeout(() => {

        playTone(
            300,
            0.25,
            "sawtooth",
            0.07
        );

    }, 180);

}


function playDrawSound() {

    playTone(
        440,
        0.12,
        "triangle",
        0.08
    );

    setTimeout(() => {

        playTone(
            440,
            0.12,
            "triangle",
            0.08
        );

    }, 150);

}


// ============================================================
// GAME VARIABLES
// ============================================================

let human = "X";

let ai = "O";

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let aiThinking = false;

let starter = "human";

let difficulty = "hard";

let moveHistory = [];


// ============================================================
// STATISTICS
// ============================================================

let wins = 0;

let losses = 0;

let draws = 0;

let games = 0;


// ============================================================
// DOM ELEMENTS
// ============================================================

const cells =
    document.querySelectorAll(".cell");

const boardElement =
    document.getElementById("board");

const winsElement =
    document.getElementById("wins");

const lossesElement =
    document.getElementById("losses");

const drawsElement =
    document.getElementById("draws");

const gamesElement =
    document.getElementById("games");

const statWins =
    document.getElementById("stat-wins");

const statLosses =
    document.getElementById("stat-losses");

const statDraws =
    document.getElementById("stat-draws");

const winRate =
    document.getElementById("win-rate");

const humanSymbolElement =
    document.getElementById("human-symbol");

const aiSymbolElement =
    document.getElementById("ai-symbol");

const turnSymbol =
    document.getElementById("turn-symbol");

const turnText =
    document.getElementById("turn-text");

const moveNumber =
    document.getElementById("move-number");

const historyList =
    document.getElementById("history-list");

const historyCount =
    document.getElementById("history-count");

const aiStatusTitle =
    document.getElementById("ai-status-title");

const aiStatusText =
    document.getElementById("ai-status-text");

const result =
    document.getElementById("result");

const resultIcon =
    document.getElementById("result-icon");

const resultTitle =
    document.getElementById("result-title");

const resultText =
    document.getElementById("result-text");

const resultMoves =
    document.getElementById("result-moves");

const resultLevel =
    document.getElementById("result-level");

const newGameButton =
    document.getElementById("new-game");

const resetButton =
    document.getElementById("reset");

const symbolButtons =
    document.querySelectorAll(".symbol");

const starterButtons =
    document.querySelectorAll(".starter");

const difficultyButtons =
    document.querySelectorAll(".difficulty");


// ============================================================
// WINNING COMBINATIONS
// ============================================================

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ============================================================
// CELL NAMES
// ============================================================

const cellNames = [

    "Top Left",

    "Top Center",

    "Top Right",

    "Middle Left",

    "Center",

    "Middle Right",

    "Bottom Left",

    "Bottom Center",

    "Bottom Right"

];


// ============================================================
// CELL CLICK
// ============================================================

boardElement.addEventListener(
    "click",
    function (event) {

        const cell =
            event.target.closest(".cell");

        if (!cell) {

            return;

        }

        const index =
            Number(cell.dataset.index);


        // Game already finished
        if (!gameActive) {

            return;

        }


        // AI is thinking
        if (aiThinking) {

            return;

        }


        // Not human turn
        if (currentPlayer !== human) {

            return;

        }


        // Cell already occupied
        if (board[index] !== "") {

            return;

        }


        // Human move
        makeMove(
            index,
            human
        );


        // Check game result
        const gameResult =
            getGameResult(board);

        if (gameResult) {

            finishGame(gameResult);

            return;

        }


        // Change to AI
        currentPlayer = ai;

        updateTurn();


        // AI starts thinking
        aiThinking = true;

        setAIStatus(
            "AI ANALYZING...",
            "Searching possible game states"
        );


        // Delay for natural gameplay
        setTimeout(
            aiMove,
            450
        );

    }
);


// ============================================================
// MAKE MOVE
// ============================================================

function makeMove(
    index,
    player
) {

    if (
        index < 0 ||
        index > 8
    ) {

        return;

    }


    if (board[index] !== "") {

        return;

    }


    // Update board
    board[index] = player;


    // Sound
    playMoveSound();


    // Update cell
    const cell =
        cells[index];

    cell.textContent =
        player;

    cell.disabled = true;


    // Player styling
    if (player === human) {

        cell.classList.add(
            "player"
        );

    }

    // AI styling
    else {

        cell.classList.add(
            "ai"
        );

    }


    // Add history
    addHistory(
        player,
        index
    );


    // Update counter
    updateMoveCounter();

}


// ============================================================
// AI MOVE
// ============================================================

function aiMove() {

    if (!gameActive) {

        return;

    }


    let bestMove = -1;


    // EASY
    if (difficulty === "easy") {

        bestMove =
            getRandomMove(board);

        setAIStatus(
            "EASY AI",
            "Random strategy"
        );

    }


    // MEDIUM
    else if (
        difficulty === "medium"
    ) {

        bestMove =
            getMediumMove(board);

        setAIStatus(
            "MEDIUM AI",
            "Strategic move selected"
        );

    }


    // HARD
    else {

        bestMove =
            getBestMove(board);

        setAIStatus(
            "OPTIMAL MOVE FOUND",
            "Minimax + Alpha-Beta"
        );

    }


    // Make AI move
    if (bestMove !== -1) {

        makeMove(
            bestMove,
            ai
        );

    }


    aiThinking = false;


    // Check result
    const gameResult =
        getGameResult(board);

    if (gameResult) {

        finishGame(gameResult);

        return;

    }


    // Return control to human
    currentPlayer = human;

    updateTurn();


    setTimeout(
        function () {

            if (gameActive) {

                setAIStatus(
                    "AI READY",
                    "Waiting for your move"
                );

            }

        },
        300
    );

}


// ============================================================
// EASY AI
// ============================================================

function getRandomMove(position) {

    const available = [];


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        if (
            position[i] === ""
        ) {

            available.push(i);

        }

    }


    if (
        available.length === 0
    ) {

        return -1;

    }


    return available[
        Math.floor(
            Math.random() *
            available.length
        )
    ];

}


// ============================================================
// MEDIUM AI
// ============================================================

function getMediumMove(position) {

    // Try to win
    const winningMove =
        findImmediateMove(
            position,
            ai
        );

    if (
        winningMove !== -1
    ) {

        return winningMove;

    }


    // Block human
    const blockMove =
        findImmediateMove(
            position,
            human
        );

    if (
        blockMove !== -1
    ) {

        return blockMove;

    }


    // Take center
    if (
        position[4] === ""
    ) {

        return 4;

    }


    // Take corner
    const corners = [
        0,
        2,
        6,
        8
    ];

    const availableCorners =
        corners.filter(
            index =>
                position[index] === ""
        );


    if (
        availableCorners.length > 0
    ) {

        return availableCorners[
            Math.floor(
                Math.random() *
                availableCorners.length
            )
        ];

    }


    // Random move
    return getRandomMove(
        position
    );

}


// ============================================================
// FIND IMMEDIATE MOVE
// ============================================================

function findImmediateMove(
    position,
    player
) {

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        if (
            position[i] === ""
        ) {

            position[i] = player;


            const gameResult =
                getGameResult(
                    position
                );


            position[i] = "";


            if (
                (
                    player === ai &&
                    gameResult === "AI"
                )
                ||
                (
                    player === human &&
                    gameResult === "HUMAN"
                )
            ) {

                return i;

            }

        }

    }


    return -1;

}


// ============================================================
// HARD AI
// MINIMAX + ALPHA-BETA
// ============================================================

function getBestMove(position) {

    let bestScore =
        -Infinity;

    let bestMove =
        -1;


    // First check immediate winning move
    const winMove =
        findImmediateMove(
            position,
            ai
        );

    if (
        winMove !== -1
    ) {

        return winMove;

    }


    // Minimax for every available move
    for (
        let i = 0;
        i < 9;
        i++
    ) {

        if (
            position[i] === ""
        ) {

            position[i] = ai;


            const score =
                minimax(
                    position,
                    0,
                    false,
                    -Infinity,
                    Infinity
                );


            position[i] = "";


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                bestMove =
                    i;

            }

        }

    }


    return bestMove;

}


// ============================================================
// MINIMAX + ALPHA-BETA PRUNING
// ============================================================

function minimax(
    position,
    depth,
    maximizing,
    alpha,
    beta
) {

    const gameResult =
        getGameResult(
            position
        );


    // AI wins
    if (
        gameResult === "AI"
    ) {

        return 10 - depth;

    }


    // Human wins
    if (
        gameResult === "HUMAN"
    ) {

        return depth - 10;

    }


    // Draw
    if (
        gameResult === "DRAW"
    ) {

        return 0;

    }


    // ========================================================
    // AI MAXIMIZING
    // ========================================================

    if (maximizing) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                position[i] === ""
            ) {

                position[i] = ai;


                const score =
                    minimax(
                        position,
                        depth + 1,
                        false,
                        alpha,
                        beta
                    );


                position[i] = "";


                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );


                alpha =
                    Math.max(
                        alpha,
                        bestScore
                    );


                // Alpha-Beta pruning
                if (
                    beta <= alpha
                ) {

                    break;

                }

            }

        }


        return bestScore;

    }


    // ========================================================
    // HUMAN MINIMIZING
    // ========================================================

    else {

        let bestScore =
            Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                position[i] === ""
            ) {

                position[i] = human;


                const score =
                    minimax(
                        position,
                        depth + 1,
                        true,
                        alpha,
                        beta
                    );


                position[i] = "";


                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );


                beta =
                    Math.min(
                        beta,
                        bestScore
                    );


                // Alpha-Beta pruning
                if (
                    beta <= alpha
                ) {

                    break;

                }

            }

        }


        return bestScore;

    }

}


// ============================================================
// GAME RESULT
// ============================================================

function getGameResult(position) {

    for (
        const combination
        of winningCombinations
    ) {

        const a =
            combination[0];

        const b =
            combination[1];

        const c =
            combination[2];


        if (
            position[a] !== "" &&
            position[a] === position[b] &&
            position[a] === position[c]
        ) {

            if (
                position[a] === human
            ) {

                return "HUMAN";

            }


            if (
                position[a] === ai
            ) {

                return "AI";

            }

        }

    }


    // Draw
    if (
        !position.includes("")
    ) {

        return "DRAW";

    }


    return null;

}


// ============================================================
// FINISH GAME
// ============================================================

function finishGame(
    gameResult
) {

    gameActive = false;

    aiThinking = false;


    // Disable all cells
    cells.forEach(
        function (cell) {

            cell.disabled = true;

        }
    );


    // Count game
    games++;


    // ========================================================
    // HUMAN WIN
    // ========================================================

    if (
        gameResult === "HUMAN"
    ) {

        wins++;


        playWinSound();


        highlightWinner(
            human
        );


        showResult(
            "🏆",
            "VICTORY!",
            "You defeated the AI!"
        );


        setAIStatus(
            "GAME OVER",
            "Human victory"
        );

    }


    // ========================================================
    // AI WIN
    // ========================================================

    else if (
        gameResult === "AI"
    ) {

        losses++;


        playLoseSound();


        highlightWinner(
            ai
        );


        showResult(
            "🤖",
            "AI WINS!",
            "The AI found the optimal strategy."
        );


        setAIStatus(
            "GAME OVER",
            "AI victory"
        );

    }


    // ========================================================
    // DRAW
    // ========================================================

    else {

        draws++;


        playDrawSound();


        showResult(
            "🤝",
            "DRAW GAME",
            "Both players defended perfectly."
        );


        setAIStatus(
            "GAME OVER",
            "No winner"
        );

    }


    // Update statistics
    updateStatistics();

}


// ============================================================
// HIGHLIGHT WINNER
// ============================================================

function highlightWinner(
    player
) {

    for (
        const combination
        of winningCombinations
    ) {

        const a =
            combination[0];

        const b =
            combination[1];

        const c =
            combination[2];


        if (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        ) {

            cells[a].classList.add(
                "winner"
            );

            cells[b].classList.add(
                "winner"
            );

            cells[c].classList.add(
                "winner"
            );

            return;

        }

    }

}


// ============================================================
// RESULT UI
// ============================================================

function showResult(
    icon,
    title,
    message
) {

    resultIcon.textContent =
        icon;

    resultTitle.textContent =
        title;

    resultText.textContent =
        message;

    resultMoves.textContent =
        moveHistory.length;

    resultLevel.textContent =
        difficulty.toUpperCase();


    result.classList.remove(
        "hidden"
    );

}


// ============================================================
// UPDATE TURN
// ============================================================

function updateTurn() {

    if (!gameActive) {

        return;

    }


    if (
        currentPlayer === human
    ) {

        turnSymbol.textContent =
            human === "X"
                ? "✕"
                : "○";


        turnText.textContent =
            "Your Turn";


        turnSymbol.style.color =
            "var(--cyan)";

    }


    else {

        turnSymbol.textContent =
            ai === "X"
                ? "✕"
                : "○";


        turnText.textContent =
            "AI Turn";


        turnSymbol.style.color =
            "var(--purple)";

    }

}


// ============================================================
// MOVE COUNTER
// ============================================================

function updateMoveCounter() {

    moveNumber.textContent =
        moveHistory.length;

}


// ============================================================
// ADD HISTORY
// ============================================================

function addHistory(
    player,
    index
) {

    moveHistory.push({

        player: player,

        index: index

    });


    renderHistory();

}


// ============================================================
// RENDER HISTORY
// ============================================================

function renderHistory() {

    historyCount.textContent =
        `${moveHistory.length} move${moveHistory.length === 1 ? "" : "s"}`;


    if (
        moveHistory.length === 0
    ) {

        historyList.innerHTML =
            `
            <p class="empty-history">
                No moves yet
            </p>
            `;

        return;

    }


    historyList.innerHTML = "";


    moveHistory.forEach(
        function (
            move,
            index
        ) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item " +
                (
                    move.player === human
                        ? "you"
                        : "ai"
                );


            const playerName =
                move.player === human
                    ? "You"
                    : "AI";


            item.innerHTML =
                `
                <span class="move-number">
                    ${index + 1}.
                </span>

                <span>
                    ${playerName}
                    →
                    ${cellNames[move.index]}
                </span>

                <b>
                    ${move.player}
                </b>
                `;


            historyList.appendChild(
                item
            );

        }
    );


    historyList.scrollTop =
        historyList.scrollHeight;

}


// ============================================================
// AI STATUS
// ============================================================

function setAIStatus(
    title,
    text
) {

    aiStatusTitle.textContent =
        title;

    aiStatusText.textContent =
        text;

}


// ============================================================
// STATISTICS
// ============================================================

function updateStatistics() {

    // Score cards
    winsElement.textContent =
        wins;

    lossesElement.textContent =
        losses;

    drawsElement.textContent =
        draws;

    // Games
    gamesElement.textContent =
        games;

    // Statistics
    statWins.textContent =
        wins;

    statLosses.textContent =
        losses;

    statDraws.textContent =
        draws;


    // Win rate
    const rate =
        games === 0
            ? 0
            : (wins / games) * 100;


    winRate.textContent =
        rate.toFixed(1) + "%";

}


// ============================================================
// NEW ROUND
// ============================================================

function newRound() {

    // Reset board
    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    // Reset history
    moveHistory = [];


    // Reset state
    gameActive = true;

    aiThinking = false;


    // Hide result
    result.classList.add(
        "hidden"
    );


    // Reset cells
    cells.forEach(
        function (cell) {

            cell.textContent = "";

            cell.disabled = false;

            cell.classList.remove(
                "player",
                "ai",
                "winner"
            );

        }
    );


    // Update UI
    updateMoveCounter();

    renderHistory();


    // ========================================================
    // DETERMINE FIRST PLAYER
    // ========================================================

    let first;


    if (
        starter === "random"
    ) {

        first =
            Math.random() < 0.5
                ? "human"
                : "ai";

    }

    else {

        first =
            starter;

    }


    // ========================================================
    // HUMAN FIRST
    // ========================================================

    if (
        first === "human"
    ) {

        currentPlayer =
            human;


        updateTurn();


        setAIStatus(
            "AI READY",
            "Waiting for your move"
        );

    }


    // ========================================================
    // AI FIRST
    // ========================================================

    else {

        currentPlayer =
            ai;


        updateTurn();


        aiThinking = true;


        setAIStatus(
            "AI ANALYZING...",
            "AI will make the first move"
        );


        setTimeout(
            function () {

                aiMove();

            },
            500
        );

    }

}


// ============================================================
// SYMBOL SELECTION
// ============================================================

symbolButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                // Remove active
                symbolButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // Set active
                button.classList.add(
                    "active"
                );


                // Set symbols
                human =
                    button.dataset.symbol;


                ai =
                    human === "X"
                        ? "O"
                        : "X";


                // Update score symbols
                humanSymbolElement.textContent =
                    human === "X"
                        ? "✕"
                        : "○";


                aiSymbolElement.textContent =
                    ai === "X"
                        ? "✕"
                        : "○";


                // Start new round
                newRound();

            }
        );

    }
);


// ============================================================
// STARTER SELECTION
// ============================================================

starterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                // Remove active
                starterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // Set active
                button.classList.add(
                    "active"
                );


                // Set starter
                starter =
                    button.dataset.start;


                // New round
                newRound();

            }
        );

    }
);


// ============================================================
// DIFFICULTY SELECTION
// ============================================================

difficultyButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                // Remove active
                difficultyButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // Set active
                button.classList.add(
                    "active"
                );


                // Set difficulty
                difficulty =
                    button.dataset.level;


                // New round
                newRound();

            }
        );

    }
);


// ============================================================
// NEW GAME BUTTON
// ============================================================

newGameButton.addEventListener(
    "click",
    function () {

        newRound();

    }
);


// ============================================================
// RESET STATISTICS BUTTON
// ============================================================

resetButton.addEventListener(
    "click",
    function () {

        // Reset statistics
        wins = 0;

        losses = 0;

        draws = 0;

        games = 0;


        // Update statistics UI
        updateStatistics();


        // Start fresh round
        newRound();

    }
);


// ============================================================
// INITIALIZATION
// ============================================================

humanSymbolElement.textContent =
    "✕";

aiSymbolElement.textContent =
    "○";


updateStatistics();


newRound();