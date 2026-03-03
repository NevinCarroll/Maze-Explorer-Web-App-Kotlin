package edu.nevin.maze_explorer.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import java.io.File

@Controller
class MazeCreatorController {

    @GetMapping("/maze-creator")
    fun creatorPage(): String {
        return "pages/maze_creator_setup"
    }

    @GetMapping("/maze-editor")
    fun editorPage(): String {
        return "pages/maze_editor"
    }

    @PostMapping("/mazes/save")
    @ResponseBody
    fun saveMaze(
        @RequestParam name: String,
        @RequestBody maze: List<String>
    ): String {

        // filename validation
        if (!name.matches(Regex("^[a-zA-Z0-9_-]+$")))
            return "Invalid filename"

        val folder = File("src/main/resources/static/mazes")
        folder.mkdirs()

        val file = File(folder, "$name.txt")

        file.writeText(maze.joinToString("\n"))

        return "Saved"
    }
}