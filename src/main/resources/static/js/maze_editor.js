// Retrieve the maze name saved from the setup page
const mazeName = sessionStorage.getItem("mazeName");

// Get the editor container element
const editor = document.getElementById("editor");

// Define the maze size (10x10 grid)
const mazeSize = 10;

// Get the "Test Maze" button
const testMazebtn = document.getElementById("testMaze");

// Initialize the maze as a 10x10 grid of '0' (open space)
let maze = Array.from({length: mazeSize}, () => Array(mazeSize).fill('0'));

// Tile size in pixels
const tileSize = 50;

// Remove previous verification flag if it exists
sessionStorage.removeItem("mazeVerified");

/**
 * Renders the maze editor grid in the DOM.
 *
 * Creates clickable tiles that cycle between open, wall, and flag.
 */
function renderEditor() {
    editor.innerHTML = "";  // Clear previous content
    editor.style.display = "grid";
    editor.style.gridTemplateColumns = `repeat(${mazeSize}, ${tileSize}px)`;  // Set CSS grid columns

    for (let r = 0; r < mazeSize; r++) {
        for (let c = 0; c < mazeSize; c++) {
            // Create an <img> element for each tile
            const tile = document.createElement("img");
            tile.width = tileSize;
            tile.height = tileSize;

            // Set the initial image based on the tile value
            updateTileImage(tile, maze[r][c]);

            // On click, cycle the tile value and update the image
            tile.onclick = () => {
                maze[r][c] = cycleTile(maze[r][c]);
                updateTileImage(tile, maze[r][c]);
            };

            // Add the tile to the editor container
            editor.appendChild(tile);
        }
    }
}

/**
 * Cycles a tile value between '0' (open), '1' (wall), and '*' (flag).
 *
 * @param {string} val - Current tile value.
 * @returns {string} New tile value.
 */
function cycleTile(val) {
    if (val === '0') return '1';
    if (val === '1') return '*';
    return '0';
}

/**
 * Updates the image source for a tile based on its value.
 *
 * @param {HTMLImageElement} tile - The tile element to update.
 * @param {string} val - The current tile value.
 */
function updateTileImage(tile, val) {
    if (val === '1') tile.src = "/images/wall.png";     // Wall tile
    else if (val === '*') tile.src = "/images/flag.png"; // Flag tile
    else tile.src = "/images/open.png";                 // Open tile
}

// Handle the "Test Maze" button click
testMazebtn.onclick = () => {
    // Save the custom maze to sessionStorage as an array of strings
    sessionStorage.setItem(
        "customMaze",
        JSON.stringify(maze.map(row => row.join("")))
    );

    // Redirect to the game page in test mode
    window.location.href = "/game?test=true";
};

// Render the editor grid on page load
renderEditor();