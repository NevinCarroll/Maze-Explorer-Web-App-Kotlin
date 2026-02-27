/**
 * TileType enum
 *
 * Represents the different types of tiles that can exist in the maze.
 * Used by the Tile class to determine behavior and display character.
 */
const TileType = Object.freeze({
    /** An open space that the player can move through */
    OPEN: "OPEN",

    /** A wall that blocks the player's movement */
    WALL: "WALL",

    /** The end point of the maze that the player aims to reach */
    END: "END"
});