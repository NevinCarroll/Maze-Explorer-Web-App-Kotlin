// Maze Explorer JavaScript
// This script handles loading, rendering, and playing a maze game.
// The player navigates a grid-based maze, avoiding walls ('1') and
// trying to reach the goal ('*'). Time is tracked and high scores can be submitted.

let maze = []; // 2D array representing the maze grid
let player = {row: 0, col: 0}; // Player's current position in the maze
let secondsElapsed = 0; // Timer count in seconds
let timerInterval = null; // Reference to the setInterval for the timer
let gameActive = true; // Tracks whether the game is active (prevents input after completion)
const tileSize = 50; // Size of each tile in pixels
const mazeContainer = document.getElementById("maze-container"); // DOM container for maze
const timerLabel = document.getElementById("timer"); // DOM element for displaying timer
const testMode = new URLSearchParams(window.location.search).get("test") === "true"; // Flag for custom/test maze mode

/**
 * Loads a maze file from the server and populates the `maze` array.
 * @param {string} filename - Name of the maze file to load.
 */
async function loadMazeFromFile(filename) {
    try {
        const response = await fetch(`/mazes/${filename}`);
        if (!response.ok) throw new Error(`Maze file not found: ${filename}`);

        const text = await response.text();
        const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        maze = lines.map(line => line.split("")); // Convert text lines to 2D array

        // Set player position to first open tile ('0')
        let foundStart = false;
        for (let r = 0; r < maze.length; r++) {
            for (let c = 0; c < maze[r].length; c++) {
                if (maze[r][c] === '0') {
                    player.row = r;
                    player.col = c;
                    foundStart = true;
                    break;
                }
            }
            if (foundStart) break;
        }

        renderMaze(); // Render maze after loading
    } catch (err) {
        console.error("Error loading maze:", err);
        alert("Failed to load maze: " + err.message);
    }
}

/**
 * Loads a random maze from the server's maze list.
 */
async function loadRandomMaze() {
    try {
        // Attempt to get maze and load it, otherwise throw error
        const response = await fetch("/mazes/list");
        if (!response.ok) throw new Error("Failed to get maze list");
        const mazeFiles = await response.json();

        if (!mazeFiles.length) throw new Error("No maze files found");

        const randomFile = mazeFiles[Math.floor(Math.random() * mazeFiles.length)];
        await loadMazeFromFile(randomFile);
    } catch (err) {
        console.error(err);
        alert("Error loading maze: " + err.message);
    }
}

/**
 * Loads a custom maze saved in session storage (used in test mode).
 * @returns {boolean} True if a custom maze was loaded successfully.
 */
function loadCustomMaze() {
    const stored = sessionStorage.getItem("customMaze"); // Get custom maze from session
    if (!stored) return false;

    // Load custom maze
    maze = JSON.parse(stored).map(row => row.split(""));
    player.row = 0;
    player.col = 0;

    renderMaze();
    return true;
}

/**
 * Renders the current maze state to the DOM.
 * Displays walls, open tiles, flags, and player position.
 */
function renderMaze() {
    mazeContainer.style.display = "grid";
    mazeContainer.style.gridTemplateRows = `repeat(${maze.length}, ${tileSize}px)`;
    mazeContainer.style.gridTemplateColumns = `repeat(${maze.length}, ${tileSize}px)`;
    mazeContainer.innerHTML = "";

    // Parse each tile in maze, loading the image for what that tile should be
    for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
            const cell = document.createElement("img");
            cell.style.width = `${tileSize}px`;
            cell.style.height = `${tileSize}px`;
            cell.style.boxSizing = "border-box";

            const val = maze[r][c];

            if (r === player.row && c === player.col) {
                cell.src = "/images/player.png"; // Player tile
            } else if (val === '1') {
                cell.src = "/images/wall.png"; // Wall tile
            } else if (val === '*') {
                cell.src = "/images/flag.png"; // Goal tile
            } else {
                cell.src = "/images/open.png"; // Open tile
            }

            mazeContainer.appendChild(cell);
        }
    }
}

/**
 * Starts the game timer.
 */
function startTimer() {
    stopTimer(); // Prevent multiple timers
    secondsElapsed = 0;
    timerLabel.textContent = `Time: 0s`;
    timerInterval = setInterval(() => {
        timerLabel.textContent = `Time: ${secondsElapsed}s`;
        secondsElapsed++;
    }, 1000);
}

/**
 * Stops the game timer.
 */
function stopTimer() {
    clearInterval(timerInterval);
}

/**
 * Moves the player by a given delta row and column.
 * Prevents movement through walls or outside the maze.
 * @param {number} dr - Delta row
 * @param {number} dc - Delta column
 */
function movePlayer(dr, dc) {
    const newRow = player.row + dr;
    const newCol = player.col + dc;
    if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) return;
    if (maze[newRow][newCol] === '1') return; // Wall check

    player.row = newRow;
    player.col = newCol;

    renderMaze();

    if (maze[newRow][newCol] === '*') {
        stopTimer();
        showEndGamePopup(); // Player reached goal
    }
}

/**
 * Displays an overlay popup when the game ends.
 * Handles custom maze save or high score submission.
 */
function showEndGamePopup() {
    gameActive = false;
    stopTimer();

    // Check if testing a custom maze
    const isCustom = testMode && !!sessionStorage.getItem("customMaze");

    // Create overlay to display to user
    const overlay = document.createElement("div");
    overlay.id = "endgame-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 9999;

    // Create modal to hold buttons
    const modal = document.createElement("div");
    modal.style.background = "white";
    modal.style.padding = "30px";
    modal.style.borderRadius = "10px";
    modal.style.textAlign = "center";
    modal.style.minWidth = "300px";

    modal.innerHTML = `
        <h2>You Escaped the Maze!</h2>
        <p>Time: ${secondsElapsed}s</p>
    `;

    // Show the save button if testing custom maze, otherwise show normal buttons
    if (isCustom) {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Maze";
        saveBtn.style.marginTop = "15px";
        saveBtn.onclick = async () => {
            const mazeName = sessionStorage.getItem("mazeName");
            if (!mazeName) {
                alert("Missing maze name!");
                return;
            }

            saveBtn.disabled = true;

            // Save maze
            await fetch(`/mazes/save?name=${mazeName}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(maze.map(r => r.join("")))
            });

            alert("Maze saved successfully!");
            document.body.removeChild(overlay);
            window.location.href = "/";
        };

        modal.appendChild(saveBtn);
    } else {
        modal.innerHTML += `
            <input id="player-name" placeholder="Enter your name"
                   style="padding:8px;width:80%;margin:10px 0;" />
            <br/>
            <button id="submit-score">Submit Score</button>
            <div id="post-buttons" style="display:none;margin-top:15px;">
                <button id="play-again">Play Again</button>
                <button id="view-scores">High Scores</button>
                <button id="main-menu">Main Menu</button>
            </div>
        `;


        // Create and assign methods to each button
        const submitBtn = modal.querySelector("#submit-score");
        const nameInput = modal.querySelector("#player-name");
        const postButtons = modal.querySelector("#post-buttons");

        submitBtn.onclick = async () => {
            const name = nameInput.value.trim();
            if (!name) {
                alert("Name required!");
                return;
            }

            submitBtn.disabled = true;
            await fetch(`/highscores?name=${encodeURIComponent(name)}&time=${secondsElapsed}`, {method: "POST"});

            submitBtn.style.display = "none";
            nameInput.disabled = true;
            postButtons.style.display = "block";
        };

        modal.querySelector("#play-again").onclick = () => {
            document.body.removeChild(overlay);
            gameActive = true;
            loadRandomMaze().then(() => startTimer());
        };

        modal.querySelector("#view-scores").onclick = () => {
            window.location.href = "/highscores-page";
        };

        modal.querySelector("#main-menu").onclick = () => {
            window.location.href = "/";
        };
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// Keyboard controls: W/A/S/D to move player
window.addEventListener("keydown", e => {
    if (!gameActive) return;

    switch (e.key.toLowerCase()) {
        case 'w':
            movePlayer(-1, 0);
            break;
        case 's':
            movePlayer(1, 0);
            break;
        case 'a':
            movePlayer(0, -1);
            break;
        case 'd':
            movePlayer(0, 1);
            break;
    }
});

// Game initialization
(async () => {
    // Load custom maze if there is one, else load a random maze
    if (testMode && loadCustomMaze()) {
        renderMaze();
    } else {
        await loadRandomMaze();
    }
    startTimer();

    // Create back button
    document.getElementById("back-to-menu").addEventListener("click", () => {
        stopTimer();
        window.location.href = "/"; // Return to main menu
    });
})();