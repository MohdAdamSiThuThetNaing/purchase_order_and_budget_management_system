package com.company.purchaseorder.purchaseorder

import java.math.BigDecimal
import java.util.UUID

data class PurchaseOrderItemResponse(
    val id: UUID,
    val budgetLineId: UUID,
    val description: String,
    val quantity: BigDecimal,
    val unitPrice: BigDecimal,
    val total: BigDecimal
)
