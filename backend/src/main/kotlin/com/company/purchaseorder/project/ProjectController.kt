package com.company.purchaseorder.project

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/projects")
class ProjectController(

    private val projectService: ProjectService

) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createProject(
        @Valid @RequestBody request: CreateProjectRequest
    ): ProjectResponse {

        return projectService.createProject(request)
    }

    @GetMapping
    fun getProjects(): List<ProjectResponse> {

        println(">>> Project controller reached")
        return projectService.getProjects()
    }

    @GetMapping("/{id}")
    fun getProject(
        @PathVariable id: UUID
    ): ProjectResponse {

        return projectService.getProject(id)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProject(
        @PathVariable id: UUID
    ) {

        projectService.deleteProject(id)
    }
}