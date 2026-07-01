package com.company.purchaseorder.purchaseorder

import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

data class PurchaseOrderResponse(

    val id: UUID,

    val organizationId: UUID,

    val projectId: UUID,

    val vendorId: UUID,

    val poNumber: String,

    val totalAmount: BigDecimal,

    val status: PurchaseOrderStatus,

    val createdBy: UUID,

    val submittedAt: OffsetDateTime?,

    val decidedAt: OffsetDateTime?,

    val version: Int
)