package com.company.purchaseorder.organization

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
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

    fun createOrganization(
        request: CreateOrganizationRequest
    ): OrganizationResponse {

        if (organizationRepository.existsByName(request.name)) {
            throw IllegalArgumentException("Organization already exists.")
        }

        val organization = Organization(
            name = request.name
        )

        val saved = organizationRepository.save(organization)

        return OrganizationResponse(
            id = saved.id,
            name = saved.name
        )
    }

    fun getOrganizations(): List<OrganizationResponse> {

        val organizationId = getOrganizationId()

        val organization = organizationRepository.findById(organizationId)
            .orElseThrow {
                RuntimeException("Organization not found.")
            }

        return listOf(
            OrganizationResponse(
                id = organization.id,
                name = organization.name
            )
        )
    }

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
            name = organization.name
        )
    }

    fun deleteOrganization(
        id: UUID
    ) {

        val organizationId = getOrganizationId()

        if (id != organizationId) {
            throw RuntimeException("Access denied.")
        }

        if (!organizationRepository.existsById(id)) {
            throw RuntimeException("Organization not found.")
        }

        organizationRepository.deleteById(id)
    }
}