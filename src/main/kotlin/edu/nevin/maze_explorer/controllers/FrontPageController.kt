package edu.nevin.maze_explorer.controllers

import org.springframework.web.bind.annotation.*
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import java.io.File

@Controller
class FrontPageController {

    @GetMapping("/")
    fun frontPage(model: Model): String {
        model.addAttribute("title", "Maze Explorer")
        return "pages/menu"
    }

    @GetMapping("/game")
    fun game(model: Model): String {
        model.addAttribute("title", "Maze Explorer - Game")
        return "pages/game"
    }

    @GetMapping("/tutorial")
    fun tutorial(model: Model): String {
        model.addAttribute("title", "Maze Explorer - Tutorial")
        return "pages/tutorial"
    }

    @GetMapping("/highscores-page")
    fun highScoresPage(model: Model): String {
        model.addAttribute("title", "Maze Explorer - High Scores")
        return "pages/highscores"
    }

    @GetMapping("/highscores")
    @ResponseBody
    fun getHighScores(): List<Map<String, Any>> {
        val scoreFile = File("src/main/resources/static/highscores.csv")
        if (!scoreFile.exists()) return emptyList()

        return scoreFile.readLines()
            .mapNotNull { line ->
                val parts = line.split(",")
                if (parts.size == 2) {
                    val name = parts[0]
                    val time = parts[1].toIntOrNull()
                    if (time != null) mapOf("name" to name, "time" to time) else null
                } else null
            }
            .sortedBy { it["time"] as Int }
            .take(10)
    }

    @PostMapping("/highscores")
    @ResponseBody
    fun saveHighScore(@RequestParam name: String, @RequestParam time: Int) {
        val scoreFile = File("src/main/resources/static/highscores.csv")
        if (!scoreFile.exists()) {
            scoreFile.parentFile.mkdirs()
            scoreFile.createNewFile()
        }
        scoreFile.appendText("$name,$time\n")
    }

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
}