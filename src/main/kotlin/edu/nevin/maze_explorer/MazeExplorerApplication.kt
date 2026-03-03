package edu.nevin.maze_explorer

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Main configuration class for the Maze Explorer Spring Boot application.
 *
 * The @SpringBootApplication annotation enables:
 * - Auto-configuration of Spring components
 * - Component scanning within the project package
 * - Spring Boot configuration support
 *
 * This class serves as the entry point configuration for the backend
 * web application.
 */
@SpringBootApplication
class MazeExplorerApplication

/**
 * Application entry point.
 *
 * This function bootstraps and launches the Spring Boot application,
 * initializing:
 * - The embedded web server
 * - Spring application context
 * - Controllers, services, and configurations
 *
 * @param args Command-line arguments passed during application startup.
 */
fun main(args: Array<String>) {
    runApplication<MazeExplorerApplication>(*args)
}