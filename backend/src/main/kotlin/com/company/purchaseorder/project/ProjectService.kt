package com.company.purchaseorder.project

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.organization.OrganizationRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ProjectService(

    private val projectRepository: ProjectRepository,
    private val organizationRepository: OrganizationRepository

) {

    private fun getOrganizationId(): UUID {

        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw RuntimeException("No authentication found.")

        if (!authentication.isAuthenticated) {
            throw RuntimeException("User is not authenticated.")
        }

        val principal = authentication.principal

        if (principal !is AuthenticatedUser) {
            throw RuntimeException(
                "Invalid principal type: ${principal::class.java.name}"
            )
        }

        return principal.organizationId
    }

    fun createProject(
        request: CreateProjectRequest
    ): ProjectResponse {

        val organizationId = getOrganizationId()

        if (projectRepository.existsByNameAndOrganization_Id(request.name, organizationId)) {
            throw IllegalArgumentException("Project already exists.")
        }

        val organization = organizationRepository.findById(organizationId)
            .orElseThrow {
                RuntimeException("Organization not found.")
            }

        val project = Project(
            organization = organization,
            name = request.name,
            description = request.description,
            active = true
        )

        val saved = projectRepository.save(project)

        return ProjectResponse(
            id = saved.id!!,
            organizationId = saved.organization.id!!,
            name = saved.name,
            description = saved.description,
            active = saved.active
        )
    }

    fun getProjects(): List<ProjectResponse> {

        val organizationId = getOrganizationId()

        return projectRepository.findAllByOrganization_Id(organizationId)
            .map {
                ProjectResponse(
                    id = it.id!!,
                    organizationId = it.organization.id!!,
                    name = it.name,
                    description = it.description,
                    active = it.active
                )
            }
    }

    fun getProject(
        id: UUID
    ): ProjectResponse {

        val organizationId = getOrganizationId()

        val project = projectRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Project not found.")

        return ProjectResponse(
            id = project.id!!,
            organizationId = project.organization.id!!,
            name = project.name,
            description = project.description,
            active = project.active
        )
    }

    fun deleteProject(
        id: UUID
    ) {

        val organizationId = getOrganizationId()

        val project = projectRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Project not found.")

        projectRepository.delete(project)
    }
}