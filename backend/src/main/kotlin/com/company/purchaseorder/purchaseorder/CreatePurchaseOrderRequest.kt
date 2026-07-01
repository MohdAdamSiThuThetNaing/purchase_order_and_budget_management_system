package com.company.purchaseorder.purchaseorder

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.util.UUID

data class CreatePurchaseOrderRequest(

    @field:NotNull(message = "Project ID is required")
    val projectId: UUID,

    @field:NotNull(message = "Vendor ID is required")
    val vendorId: UUID,

    @field:Valid
    @field:NotEmpty(message = "At least one purchase order item is required")
    val items: List<CreatePurchaseOrderItemRequest>
)