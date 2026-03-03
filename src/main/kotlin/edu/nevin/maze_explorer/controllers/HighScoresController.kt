package edu.nevin.maze_explorer.controllers

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import java.io.File

@Controller
class HighScoresController {
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
}