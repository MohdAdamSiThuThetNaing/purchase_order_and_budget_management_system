package com.company.purchaseorder.vendor

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface VendorRepository : JpaRepository<Vendor, UUID> {

    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<Vendor>

    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): Vendor?
}
