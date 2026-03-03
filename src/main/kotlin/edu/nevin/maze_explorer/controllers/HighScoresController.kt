package edu.nevin.maze_explorer.controllers

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import java.io.File

/**
 * Controller responsible for handling high scores in Maze Explorer.
 *
 * Provides endpoints for:
 * - Viewing the high scores page
 * - Retrieving the top high scores
 * - Saving new high scores
 */
@Controller
class HighScoresController {

    /**
     * Serves the high scores page.
     *
     * @param model Spring Model to pass attributes to the view.
     * @return The Thymeleaf template name for the high scores page.
     */
    @GetMapping("/highscores-page")
    fun highScoresPage(model: Model): String {
        model.addAttribute("title", "Maze Explorer - High Scores")
        return "pages/highscores"
    }

    /**
     * Retrieves the top 10 high scores from the CSV file.
     *
     * The CSV file is expected to have lines in the format:
     * `name,time`, where `time` is an integer representing the completion time.
     *
     * @return A list of maps containing "name" and "time" keys, sorted by time ascending.
     *         Returns an empty list if the file does not exist or contains no valid entries.
     */
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

    /**
     * Saves a new high score to the CSV file.
     *
     * If the CSV file does not exist, it is created along with its parent directories.
     * Each new entry is appended in the format `name,time`.
     *
     * @param name The name of the player achieving the score.
     * @param time The completion time for the maze, in integer units.
     */
    @PostMapping("/highscores")
    @ResponseBody
    fun saveHighScore(@RequestParam name: String, @RequestParam time: Int) {
        val scoreFile = File("src/main/resources/static/highscores.csv")
        if (!scoreFile.exists()) {
            scoreFile.parentFile.mkdirs()
            scoreFile.createNewFile()
        }
        // Add text to csv file
        scoreFile.appendText("$name,$time\n")
    }
}