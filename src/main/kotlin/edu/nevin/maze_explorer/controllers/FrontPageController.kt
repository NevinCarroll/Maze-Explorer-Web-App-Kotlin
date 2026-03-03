package edu.nevin.maze_explorer.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.PathVariable
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

    @GetMapping("/mazes/{filename}")
    @ResponseBody
    fun getMaze(@PathVariable filename: String): ResponseEntity<String> {
        val file = File("src/main/resources/static/mazes/$filename")
        if (!file.exists()) return ResponseEntity.notFound().build()
        return ResponseEntity.ok(file.readText())
    }
}