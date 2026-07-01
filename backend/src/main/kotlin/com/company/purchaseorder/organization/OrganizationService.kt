package com.company.purchaseorder.organization

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class OrganizationService(

    private val organizationRepository: OrganizationRepository

) {

    private fun getOrganizationId(): UUID {
        val auth = SecurityContextHolder.getContext().authentication
        val user = auth.principal as AuthenticatedUser
        return user.organizationId
    }

    private fun generateSlug(name: String): String {
        return name
            .trim()
            .lowercase()
            .replace(Regex("[^a-z0-9\\s-]"), "")
            .replace(Regex("\\s+"), "-")
    }

    @Transactional
    fun createOrganization(
        request: CreateOrganizationRequest
    ): OrganizationResponse {

        if (organizationRepository.existsByName(request.name)) {
            throw IllegalArgumentException("Organization already exists.")
        }

        val slug = generateSlug(request.name)

        if (organizationRepository.existsBySlug(slug)) {
            throw IllegalArgumentException("Organization slug already exists.")
        }

        val organization = Organization(
            name = request.name,
            slug = slug
        )

        val saved = organizationRepository.save(organization)

        return OrganizationResponse(
            id = saved.id,
            name = saved.name,
            slug = saved.slug
        )
    }

    @Transactional(readOnly = true)
    fun getOrganizations(): List<OrganizationResponse> {

        return organizationRepository.findAll().map {
            OrganizationResponse(
                id = it.id,
                name = it.name,
                slug = it.slug
            )
        }
    }

    @Transactional(readOnly = true)
    fun getOrganization(
        id: UUID
    ): OrganizationResponse {

        val organizationId = getOrganizationId()

        if (id != organizationId) {
            throw RuntimeException("Access denied.")
        }

        val organization = organizationRepository.findById(id)
            .orElseThrow {
                RuntimeException("Organization not found.")
            }

        return OrganizationResponse(
            id = organization.id,
            name = organization.name,
            slug = organization.slug
        )
    }

    @Transactional
    fun deleteOrganization(id: UUID) {

        val auth = SecurityContextHolder.getContext().authentication

        val isAdmin = auth.authorities.any {
            it.authority == "ROLE_ADMIN"
        }

        if (!isAdmin && id != getOrganizationId()) {
            throw RuntimeException("Access denied.")
        }

        val organization = organizationRepository.findById(id)
            .orElseThrow {
                RuntimeException("Organization not found.")
            }

        organizationRepository.delete(organization)
    }
}