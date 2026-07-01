package com.company.purchaseorder.purchaseorder

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PurchaseOrderRepository : JpaRepository<PurchaseOrder, UUID> {

    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<PurchaseOrder>

    fun findAllByProject_Id(
        projectId: UUID
    ): List<PurchaseOrder>

    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): PurchaseOrder?

    fun existsByPoNumberAndOrganization_Id(
        poNumber: String,
        organizationId: UUID
    ): Boolean

    fun findAllByVendorId(
        vendorId: UUID
    ): List<PurchaseOrder>
}