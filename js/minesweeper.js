const background = document.getElementById("minesweeper_background");

const cellSize = 32;
const mineRate = 0.10;
const saveKey = "minesweeper_save";

let rows;
let columns;
let mines;
let board = [];

function getSize() {
    columns = Math.ceil(window.innerWidth / cellSize) + 1;
    rows = Math.ceil(window.innerHeight / cellSize) + 1;
    mines = Math.floor(rows * columns * mineRate);
}

function createBoard() {
    board = [];

    for (let row = 0; row < rows; row++) {
        board[row] = [];

        for (let column = 0; column < columns; column++) {
            board[row][column] = {
                mine: false,
                revealed: false,
                flagged: false,
                number: 0
            };
        }
    }

    let placed = 0;

    while (placed < mines) {
        const row = Math.floor(Math.random() * rows);
        const column = Math.floor(Math.random() * columns);

        if (!board[row][column].mine) {
            board[row][column].mine = true;
            placed++;
        }
    }

    calculateNumbers();
}

function calculateNumbers() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (!board[row][column].mine) {
                board[row][column].number = countMines(row, column);
            }
        }
    }
}

function countMines(row, column) {
    let count = 0;

    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            const newRow = row + y;
            const newColumn = column + x;

            if (
                newRow >= 0 &&
                newRow < rows &&
                newColumn >= 0 &&
                newColumn < columns &&
                board[newRow][newColumn].mine
            ) {
                count++;
            }
        }
    }

    return count;
}

function drawBoard() {
    background.innerHTML = "";

    const grid = document.createElement("div");

    grid.className = "minesweeper_grid";

    grid.style.gridTemplateColumns =
        `repeat(${columns}, ${cellSize}px)`;

    grid.style.gridTemplateRows =
        `repeat(${rows}, ${cellSize}px)`;

    grid.style.width = `${columns * cellSize}px`;
    grid.style.height = `${rows * cellSize}px`;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const cell = document.createElement("button");

            cell.className = "mine_cell";

            cell.dataset.row = row;
            cell.dataset.column = column;

            cell.addEventListener("click", () => {
                revealCell(row, column);
            });

            cell.addEventListener("contextmenu", event => {
                event.preventDefault();
                flagCell(row, column);
            });

            grid.appendChild(cell);
        }
    }

    background.appendChild(grid);

    restoreVisualState();
}

function revealCell(row, column) {
    const cell = board[row][column];

    if (cell.revealed || cell.flagged) {
        return;
    }

    cell.revealed = true;

    const element = getElement(row, column);

    if (cell.mine) {
        element.textContent = "💣";
        element.classList.add("mine");

        if (window.mineSound) {
            window.mineSound();
        }

        if (window.mineExplosion) {
            window.mineExplosion(element);
        }

        saveGame();

        setTimeout(resetGame, 700);

        return;
    }

    element.classList.add("revealed");

    if (cell.number > 0) {
        element.textContent = cell.number;

        if (window.clickSound) {
            window.clickSound(cell.number);
        }

        if (window.numberAnimation) {
            window.numberAnimation(element);
        }
    } else {
        revealNearby(row, column);
    }

    saveGame();
}

function revealNearby(row, column) {
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            const newRow = row + y;
            const newColumn = column + x;

            if (
                newRow >= 0 &&
                newRow < rows &&
                newColumn >= 0 &&
                newColumn < columns
            ) {
                if (!board[newRow][newColumn].revealed) {
                    revealCell(newRow, newColumn);
                }
            }
        }
    }
}

function flagCell(row, column) {
    const cell = board[row][column];

    if (cell.revealed) {
        return;
    }

    cell.flagged = !cell.flagged;

    const element = getElement(row, column);

    element.textContent = cell.flagged ? "🚩" : "";

    if (window.flagSound) {
        window.flagSound(cell.flagged);
    }

    if (window.flagAnimation) {
        window.flagAnimation(element);
    }

    saveGame();
}

function getElement(row, column) {
    return document.querySelector(
        `.mine_cell[data-row="${row}"][data-column="${column}"]`
    );
}

function saveGame() {
    try {
        localStorage.setItem(
            saveKey,
            JSON.stringify({
                rows,
                columns,
                mines,
                board
            })
        );
    } catch (error) {
        console.warn("Could not save Minesweeper game.", error);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem(saveKey);

        if (!saved) {
            return false;
        }

        const data = JSON.parse(saved);

        if (
            data.rows !== rows ||
            data.columns !== columns ||
            !Array.isArray(data.board)
        ) {
            return false;
        }

        board = data.board;
        mines = data.mines;

        return true;
    } catch (error) {
        console.warn("Could not load Minesweeper game.", error);
        return false;
    }
}

function restoreVisualState() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const cell = board[row][column];
            const element = getElement(row, column);

            if (!element) {
                continue;
            }

            if (cell.flagged) {
                element.textContent = "🚩";
            }

            if (cell.revealed) {
                element.classList.add("revealed");

                if (cell.mine) {
                    element.textContent = "💣";
                    element.classList.add("mine");
                } else if (cell.number > 0) {
                    element.textContent = cell.number;
                }
            }
        }
    }
}

function resetGame() {
    getSize();
    createBoard();
    drawBoard();
    saveGame();

    if (window.resetAnimation) {
        window.resetAnimation();
    }
}

function resizeGame() {
    const oldRows = rows;
    const oldColumns = columns;

    getSize();

    if (oldRows !== rows || oldColumns !== columns) {
        createBoard();
        drawBoard();
        saveGame();
    }
}

function startGame() {
    getSize();

    if (!loadGame()) {
        createBoard();
        saveGame();
    }

    drawBoard();
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        saveGame();
    }
});

window.addEventListener("pagehide", saveGame);

window.addEventListener("beforeunload", saveGame);

window.addEventListener("resize", resizeGame);

startGame();