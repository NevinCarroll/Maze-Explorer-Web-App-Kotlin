const mazeName = sessionStorage.getItem("mazeName");
const editor = document.getElementById("editor");
const mazeSize = 10;

const saveMazebtn = document.getElementById("saveMaze")
const testMazebtn = document.getElementById("testMaze")

let maze =
    Array.from({length: rows},
        () => Array(cols).fill('0'));

let verified = false;

const tileSize = 50;

if(sessionStorage.getItem("mazeVerified") === "true"){
    verified = true;
    saveMazebtn.disabled = false;
}

sessionStorage.removeItem("mazeVerified");

function renderEditor(){
    editor.innerHTML="";
    editor.style.display="grid";
    editor.style.gridTemplateColumns=`repeat(${mazeSize},${tileSize}px)`;

    for(let r=0;r<mazeSize;r++){
        for(let c=0;c<mazeSize;c++){

            const tile=document.createElement("img");
            tile.width=tileSize;
            tile.height=tileSize;

            updateTileImage(tile, maze[r][c]);

            tile.onclick=()=>{
                maze[r][c]=cycleTile(maze[r][c]);
                updateTileImage(tile, maze[r][c]);
                verified=false;
                saveMazebtn.disabled=true;
            };

            editor.appendChild(tile);
        }
    }
}

function cycleTile(val){
    if(val==='0') return '1';
    if(val==='1') return '*';
    return '0';
}

function updateTileImage(tile,val){
    if(val==='1') tile.src="/images/wall.png";
    else if(val==='*') tile.src="/images/flag.png";
    else tile.src="/images/open.png";
}

testMazebtn.onclick=()=>{

    sessionStorage.setItem(
        "customMaze",
        JSON.stringify(maze.map(r=>r.join("")))
    );

    window.location.href="/game?test=true";
};

saveMazebtn.onclick=async ()=>{

    if(!verified){
        alert("You must complete the maze first!");
        return;
    }

    const mazeLines =
        maze.map(r=>r.join(""));

    await fetch(
        `/mazes/save?name=${mazeName}`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(mazeLines)
        }
    );

    alert("Maze Saved!");
    window.location="/";
};

renderEditor();