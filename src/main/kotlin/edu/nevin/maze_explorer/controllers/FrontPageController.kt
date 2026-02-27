package edu.nevin.maze_explorer.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class FrontPageController {
    @GetMapping("/")
    fun frontPage(): String {
        return "index"
    }
}