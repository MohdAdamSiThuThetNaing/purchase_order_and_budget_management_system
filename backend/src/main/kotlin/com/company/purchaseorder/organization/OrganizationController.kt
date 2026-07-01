package com.company.purchaseorder.organization

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.security.core.Authentication
import java.util.UUID

@RestController
@RequestMapping("/api/organizations")
class OrganizationController(

    private val organizationService: OrganizationService

) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createOrganization(
        @Valid @RequestBody request: CreateOrganizationRequest
    ): OrganizationResponse {

        println(">>> Organization controller reached")

        return organizationService.createOrganization(request)
    }

    @GetMapping
    fun getOrganizations(): List<OrganizationResponse> {
        return organizationService.getOrganizations()
    }

    @GetMapping("/{id}")
    fun getOrganization(
        @PathVariable id: UUID
    ): OrganizationResponse {
        return organizationService.getOrganization(id)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteOrganization(
        @PathVariable id: UUID
    ) {
        println("DELETE controller reached: $id")
        organizationService.deleteOrganization(id)
    }
}