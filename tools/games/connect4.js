const gameBoard = document.getElementById('gameBoard');
const message = document.getElementById('message');

const rows = 6;
const cols = 7;
let board = [];
let currentPlayer = 1;

// Initialize the game board
function initBoard() {
    board = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(0);
        }
        board.push(row);
    }
}

// Render the game board
function renderBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            if (board[r][c] === 1) {
                cell.classList.add('player1');
            } else if (board[r][c] === 2) {
                cell.classList.add('player2');
            }
            cell.addEventListener('click', handleClick);
            gameBoard.appendChild(cell);
        }
    }
}

// Handle cell click
function handleClick(event) {
    const col = parseInt(event.target.dataset.col);
    if (makeMove(col, currentPlayer)) {
        if (checkWin(currentPlayer)) {
            message.innerText = `Player ${currentPlayer} wins!`;
            disableBoard();
        } else if (board.flat().includes(0)) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            message.innerText = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === 2) {
                setTimeout(computerMove, 500); // Delay computer move for better user experience
            }
        } else {
            message.innerText = 'Draw!';
        }
    }
}

// Make a move in the specified column
function makeMove(col, player) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            board[r][col] = player;
            renderBoard();
            return true;
        }
    }
    return false;
}

// Undo a move in the specified column
function undoMove(col) {
    for (let r = 0; r < rows; r++) {
        if (board[r][col] !== 0) {
            board[r][col] = 0;
            renderBoard();
            return;
        }
    }
}

// Computer makes a move
function computerMove() {
    // Check for possible player win and block it
    for (let col = 0; col < cols; col++) {
        if (makeMove(col, 1)) {
            if (checkWin(1)) {
                undoMove(col); // Undo player move
                makeMove(col, 2); // Block player
                if (checkWin(2)) {
                    message.innerText = `Player 2 wins!`;
                    disableBoard();
                } else {
                    currentPlayer = 1;
                    message.innerText = `Player ${currentPlayer}'s turn`;
                }
                return;
            } else {
                undoMove(col); // Undo player move
            }
        }
    }

    // If no blocking move, choose a random column
    let col;
    do {
        col = Math.floor(Math.random() * cols);
    } while (!makeMove(col, currentPlayer));
    if (checkWin(currentPlayer)) {
        message.innerText = `Player ${currentPlayer} wins!`;
        disableBoard();
    } else {
        currentPlayer = 1;
        message.innerText = `Player ${currentPlayer}'s turn`;
    }
}

// Check for a win
function checkWin(player) {
    return checkHorizontal(player) || checkVertical(player) || checkDiagonal(player);
}

function checkHorizontal(player) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (board[r][c] === player && board[r][c + 1] === player && board[r][c + 2] === player && board[r][c + 3] === player) {
                return true;
            }
        }
    }
    return false;
}

function checkVertical(player) {
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r <= rows - 4; r++) {
            if (board[r][c] === player && board[r + 1][c] === player && board[r + 2][c] === player && board[r + 3][c] === player) {
                return true;
            }
        }
    }
    return false;
}

function checkDiagonal(player) {
    // Check / diagonal
    for (let r = 0; r <= rows - 4; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (board[r][c] === player && board[r + 1][c + 1] === player && board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) {
                return true;
            }
        }
    }
    // Check \ diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (board[r][c] === player && board[r - 1][c + 1] === player && board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) {
                return true;
            }
        }
    }
    return false;
}

// Disable the game board after a win or draw
function disableBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

// Initialize the game
function initGame() {
    initBoard();
    renderBoard();
    message.innerText = `Player ${currentPlayer}'s turn`;
}

// Start the game
initGame();
