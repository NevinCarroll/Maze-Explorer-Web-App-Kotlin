package edu.nevin.maze_explorer.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import java.io.File

/**
 * Controller responsible for maze creation and editing.
 *
 * Provides endpoints for:
 * - Displaying the maze creator setup page
 * - Displaying the maze editor page
 * - Saving newly created or edited mazes to the file system
 */
@Controller
class MazeCreatorController {

    /**
     * Serves the maze creator setup page.
     *
     * @return The Thymeleaf template name for the maze creator setup page.
     */
    @GetMapping("/maze-creator")
    fun creatorPage(): String {
        return "pages/maze_creator_setup"
    }

    /**
     * Serves the maze editor page.
     *
     * @return The Thymeleaf template name for the maze editor page.
     */
    @GetMapping("/maze-editor")
    fun editorPage(): String {
        return "pages/maze_editor"
    }

    /**
     * Saves a maze to the server file system.
     *
     * The maze is saved as a text file with each row represented as a line in the file.
     * Filenames are validated to allow only alphanumeric characters, underscores, and dashes.
     *
     * @param name The desired filename for the maze (without extension).
     * @param maze The maze content represented as a list of strings (each string is a row of the maze).
     * @return A status message: "Saved" if successful, or "Invalid filename" if validation fails.
     */
    @PostMapping("/mazes/save")
    @ResponseBody
    fun saveMaze(
        @RequestParam name: String,
        @RequestBody maze: List<String>
    ): String {

        // Validate filename, ensure no special characters in filename
        if (!name.matches(Regex("^[a-zA-Z0-9_-]+$")))
            return "Invalid filename"

        val folder = File("src/main/resources/static/mazes")
        folder.mkdirs()  // Create the folder if it doesn't exist

        val file = File(folder, "$name.txt")
        file.writeText(maze.joinToString("\n"))  // Save the maze as a text file

        return "Saved"
    }
}