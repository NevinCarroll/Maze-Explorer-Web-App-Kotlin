// Maze Explorer JavaScript

let maze = [];
let player = { row: 0, col: 0 };
let secondsElapsed = 0;
let timerInterval = null;
let gameActive = true;
const mazeSize = 10; // 10x10 for now
const tileSize = 50; // pixels
const mazeContainer = document.getElementById("maze-container");
const timerLabel = document.getElementById("timer");

async function loadMazeFromFile(filename) {
    try {
        // Fetch the maze file from server
        const response = await fetch(`/mazes/${filename}`);
        if (!response.ok) throw new Error(`Maze file not found: ${filename}`);

        const text = await response.text();
        const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        // Populate the maze array
        maze = lines.map(line => line.split("")); // array of chars

        // Reset player position to first open tile (like Kotlin code sets 0,0)
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

        renderMaze();
        startTimer();
    } catch (err) {
        console.error("Error loading maze:", err);
        alert("Failed to load maze: " + err.message);
    }
}

async function loadRandomMaze() {
    try {
        // Get list of maze files from server
        const response = await fetch("/mazes/list");
        if (!response.ok) throw new Error("Failed to get maze list");
        const mazeFiles = await response.json();

        if (!mazeFiles.length) throw new Error("No maze files found");

        // Pick a random file
        const randomFile = mazeFiles[Math.floor(Math.random() * mazeFiles.length)];

        // Load the maze file into maze array
        await loadMazeFromFile(randomFile);
    } catch (err) {
        console.error(err);
        alert("Error loading maze: " + err.message);
    }
}

function renderMaze() {
    mazeContainer.style.display = "grid";
    mazeContainer.style.gridTemplateRows = `repeat(${mazeSize}, ${tileSize}px)`;
    mazeContainer.style.gridTemplateColumns = `repeat(${mazeSize}, ${tileSize}px)`;
    mazeContainer.innerHTML = "";

    for (let r = 0; r < mazeSize; r++) {
        for (let c = 0; c < mazeSize; c++) {
            const cell = document.createElement("img");
            cell.style.width = `${tileSize}px`;
            cell.style.height = `${tileSize}px`;
            cell.style.boxSizing = "border-box";  // ensures border doesn't stretch image
            // cell.style.border = "1px solid #333";

            const val = maze[r][c];

            if (r === player.row && c === player.col) {
                // Player image
                cell.src = "/images/player.png";
            } else if (val === '1') {
                // Wall image
                cell.src = "/images/wall.png";
            } else if (val === '*') {
                // Flag image
                cell.src = "/images/flag.png";
            } else {
                // Open tile: optional blank tile or placeholder
                cell.src = "/images/open.png"; // you can create a plain white tile image
            }

            mazeContainer.appendChild(cell);
        }
    }
}

function startTimer() {
    secondsElapsed = 0;
    timerLabel.textContent = `Time: 0s`;
    timerInterval = setInterval(() => {
        timerLabel.textContent = `Time: ${secondsElapsed}s`;
        secondsElapsed++;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function movePlayer(dr, dc) {
    const newRow = player.row + dr;
    const newCol = player.col + dc;
    if (newRow < 0 || newRow >= mazeSize || newCol < 0 || newCol >= mazeSize) return;
    if (maze[newRow][newCol] === '1') return;

    player.row = newRow;
    player.col = newCol;

    renderMaze();

    if (maze[newRow][newCol] === '*') {
        stopTimer();
        showEndGamePopup();
    }
}

function showEndGamePopup() {
    gameActive = false;
    stopTimer();

    // Overlay
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

    // Modal box
    const modal = document.createElement("div");
    modal.style.background = "white";
    modal.style.padding = "30px";
    modal.style.borderRadius = "10px";
    modal.style.textAlign = "center";
    modal.style.minWidth = "300px";

    modal.innerHTML = `
        <h2>You Escaped the Maze!</h2>
        <p>Time: ${secondsElapsed}s</p>
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

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

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

        await fetch(
            `/highscores?name=${encodeURIComponent(name)}&time=${secondsElapsed}`,
            { method: "POST" }
        );

        submitBtn.style.display = "none";
        nameInput.disabled = true;
        postButtons.style.display = "block";
    };

    modal.querySelector("#play-again").onclick = () => {
        document.body.removeChild(overlay);
        gameActive = true;
        loadRandomMaze(); // or loadMazeFromFile(...)
    };

    modal.querySelector("#view-scores").onclick = () => {
        window.location.href = "/highscores-page";
    };

    modal.querySelector("#main-menu").onclick = () => {
        window.location.href = "/";
    };
}

// Keyboard controls
window.addEventListener("keydown", e => {
    if (!gameActive) return;

    switch (e.key.toLowerCase()) {
        case 'w': movePlayer(-1,0); break;
        case 's': movePlayer(1,0); break;
        case 'a': movePlayer(0,-1); break;
        case 'd': movePlayer(0,1); break;
    }
});

// Initialize game
loadRandomMaze().then(r => {
    renderMaze();
    startTimer();

    document.getElementById("back-to-menu").addEventListener("click", () => {
        stopTimer();
        window.location.href = "/"; // Go back to menu
    });

});

