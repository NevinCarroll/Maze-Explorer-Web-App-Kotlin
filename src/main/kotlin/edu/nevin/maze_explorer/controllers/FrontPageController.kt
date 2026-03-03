package edu.nevin.maze_explorer.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.PathVariable
import java.io.File

/**
 * Controller responsible for handling front-end page routing and maze file access.
 *
 * Provides endpoints for:
 * - Front page menu
 * - Game page
 * - Tutorial page
 * - Listing available maze files
 * - Retrieving the contents of a specific maze file
 */
@Controller
class FrontPageController {

    /**
     * Handles the root URL ("/") and serves the main menu page.
     *
     * @param model Spring Model to pass attributes to the view.
     * @return The Thymeleaf template name for the main menu page.
     */
    @GetMapping("/")
    fun frontPage(model: Model): String {
        model.addAttribute("title", "Maze Explorer")
        return "pages/menu"
    }

    /**
     * Serves the game page.
     *
     * @param model Spring Model to pass attributes to the view.
     * @return The Thymeleaf template name for the game page.
     */
    @GetMapping("/game")
    fun game(model: Model): String {
        model.addAttribute("title", "Maze Explorer - Game")
        return "pages/game"
    }

    /**
     * Serves the tutorial page.
     *
     * @param model Spring Model to pass attributes to the view.
     * @return The Thymeleaf template name for the tutorial page.
     */
    @GetMapping("/tutorial")
    fun tutorial(model: Model): String {
        model.addAttribute("title", "Maze Explorer - Tutorial")
        return "pages/tutorial"
    }

    /**
     * Lists all maze files available in the "mazes" folder.
     *
     * @return A list of filenames representing available mazes. Returns an empty list if the folder
     *         does not exist or contains no files.
     */
    @GetMapping("/mazes/list")
    @ResponseBody
    fun listMazes(): List<String> {
        val mazeFolder = File("src/main/resources/static/mazes")
        if (!mazeFolder.exists() || !mazeFolder.isDirectory) return emptyList()

        return mazeFolder.listFiles()
            ?.filter { it.isFile }
            ?.map { it.name } // return just filenames
            ?: emptyList()
    }

    /**
     * Retrieves the contents of a specific maze file.
     *
     * @param filename The name of the maze file to retrieve.
     * @return A ResponseEntity containing the maze file's text content with status 200 OK if found,
     *         or 404 Not Found if the file does not exist.
     */
    @GetMapping("/mazes/{filename}")
    @ResponseBody
    fun getMaze(@PathVariable filename: String): ResponseEntity<String> {
        val file = File("src/main/resources/static/mazes/$filename")
        if (!file.exists()) return ResponseEntity.notFound().build()
        return ResponseEntity.ok(file.readText())
    }
}