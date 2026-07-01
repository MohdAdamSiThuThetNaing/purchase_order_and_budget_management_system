package com.company.purchaseorder.purchaseorder

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PurchaseOrderItemRepository :
    JpaRepository<PurchaseOrderItem, UUID> {

    fun findAllByPurchaseOrder_Id(
        purchaseOrderId: UUID
    ): List<PurchaseOrderItem>

    fun deleteAllByPurchaseOrder_Id(
        purchaseOrderId: UUID
    )

    fun findByPurchaseOrder_IdAndId(
        purchaseOrderId: UUID,
        id: UUID
    ): PurchaseOrderItem?

    fun existsByPurchaseOrder_IdAndBudgetLineId(
        purchaseOrderId: UUID,
        budgetLineId: UUID
    ): Boolean
}