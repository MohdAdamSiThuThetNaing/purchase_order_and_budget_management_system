package com.company.purchaseorder.vendor

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class VendorService(
    private val vendorRepository: VendorRepository
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

    fun getVendors(): List<VendorResponse> {
        val organizationId = getOrganizationId()

        return vendorRepository
            .findAllByOrganization_Id(organizationId)
            .map { toResponse(it) }
    }

    fun getVendor(id: UUID): VendorResponse {
        val organizationId = getOrganizationId()

        val vendor = vendorRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Vendor not found.")

        return toResponse(vendor)
    }

    private fun toResponse(vendor: Vendor): VendorResponse {
        return VendorResponse(
            id = vendor.id!!,
            organizationId = vendor.organization.id!!,
            name = vendor.name,
            contactEmail = vendor.contactEmail,
            contactPhone = vendor.contactPhone,
            active = vendor.active
        )
    }
}
