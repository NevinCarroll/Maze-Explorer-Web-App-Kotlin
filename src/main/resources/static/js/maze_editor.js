const mazeName = sessionStorage.getItem("mazeName");
const editor = document.getElementById("editor");
const mazeSize = 10;

const testMazebtn = document.getElementById("testMaze")

let maze =
    Array.from({length: 10},
        () => Array(10).fill('0'));

const tileSize = 50;

sessionStorage.removeItem("mazeVerified");

function renderEditor() {
    editor.innerHTML = "";
    editor.style.display = "grid";
    editor.style.gridTemplateColumns = `repeat(${mazeSize},${tileSize}px)`;

    for (let r = 0; r < mazeSize; r++) {
        for (let c = 0; c < mazeSize; c++) {

            const tile = document.createElement("img");
            tile.width = tileSize;
            tile.height = tileSize;

            updateTileImage(tile, maze[r][c]);

            tile.onclick = () => {
                maze[r][c] = cycleTile(maze[r][c]);
                updateTileImage(tile, maze[r][c]);
            };

            editor.appendChild(tile);
        }
    }
}

function cycleTile(val) {
    if (val === '0') return '1';
    if (val === '1') return '*';
    return '0';
}

function updateTileImage(tile, val) {
    if (val === '1') tile.src = "/images/wall.png";
    else if (val === '*') tile.src = "/images/flag.png";
    else tile.src = "/images/open.png";
}

testMazebtn.onclick = () => {

    sessionStorage.setItem(
        "customMaze",
        JSON.stringify(maze.map(r => r.join("")))
    );

    window.location.href = "/game?test=true";
};

renderEditor();