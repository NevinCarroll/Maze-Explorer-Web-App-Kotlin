/**
 * PlayerPosition class
 *
 * Represents the player in the maze. Stores the current position
 * of the player and provides methods to get and set the position.
 */
class PlayerPosition {

    constructor() {
        // Array storing player's current position: [x, y]
        this.position = [0, 0];
    }

    /**
     * Set the player's position in the maze.
     *
     * @param {number} x - Row (vertical position) in the maze
     * @param {number} y - Column (horizontal position) in the maze
     */
    setPosition(x, y) {
        this.position[0] = x;
        this.position[1] = y;
    }

    /**
     * Get the player's current position in the maze.
     *
     * @returns {number[]} Array where [0] = x (row), [1] = y (column)
     */
    getPosition() {
        return this.position;
    }
}