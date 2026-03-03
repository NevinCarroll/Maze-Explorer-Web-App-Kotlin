# Maze Explorer GUI

A maze game web app using the Spring Boot framework with Kotlin.
The player navigates through a maze to reach the end while avoiding walls and moving through open spaces.

## Features

- Randomly selects one of multiple maze files at startup

- Tracks the number of moves taken by the player

- Allows restarting the game after completion

- Keyboard controls with W/A/S/D keys

- Visual representation of the player, walls, open spaces, and end point

- Saves high scores on the server and displays them

- Allows users to create custom mazes

## How to Play

1. Use the following keys to move the player:

- W = Up

- A = Left

- S = Down

- D = Right

2. Navigate from the starting position to the flag.

3. The game counts how long it takes for you to complete maze.

4. After reaching the end, you can restart the game or exit.

### Maze Creation
There is a new page where the user can make their own custom maze and upload it to the server. They will be asked for a 
file name, then they can assign a tile type for each tile. Before uploading, they must test maze to ensure it is possible.
So they can't upload impossible mazes.

## Requirements

- Kotlin 2.3.0 or later

- Java JDK installed

## How to Run

1. Clone the repository:

``` bash
git clone https://github.com/NevinCarroll/Maze-Explorer-GUI.git
cd Maze-Explorer-GUI
```

2. Build the files using gradle (from the project root):

``` bash
./gradlew build
```

3. Run the compiled files using gradle:

``` bash
./gradlew bootRun
```

4. Open up a web browser and go to http://127.0.0.1:8080/, to access the web app.

## Mazes Files

Maze files are located in src/main/resources/static/mazes as maze[num].txt. Each file contains a 10x10 grid using:

- 1 = Wall

- 0 = Open space

- \* = End point

You can edit these files manually to create custom mazes. Only 0, 1, and * are valid; any other symbol will cause an exception.