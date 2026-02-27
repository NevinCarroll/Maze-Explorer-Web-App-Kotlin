/**
 * Tile class
 *
 * Represents a single tile in the maze. Each tile has a type
 * which can be WALL, OPEN, or END.
 */
class Tile {

    /**
     * @param {string} tileType - The type of the tile
     */
    constructor(tileType) {
        this.tileType = tileType;
    }

    /**
     * Get the type of this tile.
     *
     * @returns {string} The tile type (WALL, OPEN, or END)
     */
    getType() {
        return this.tileType;
    }
}