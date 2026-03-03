package edu.nevin.maze_explorer.controllers

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class FrontPageController {
    @GetMapping("/")
    fun frontPage(model: Model): String {
        model.addAttribute("title", "Home")
        return "pages/menu"
    }
}