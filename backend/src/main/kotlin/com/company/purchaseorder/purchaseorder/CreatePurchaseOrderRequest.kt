package com.company.purchaseorder.purchaseorder

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.util.UUID

data class CreatePurchaseOrderRequest(

    @field:NotNull(message = "Project ID is required")
    val projectId: UUID,

    @field:NotNull(message = "Vendor ID is required")
    val vendorId: UUID,

    @field:NotBlank(message = "PO Number is required")
    @field:Size(
        min = 2,
        max = 50,
        message = "PO Number must be between 2 and 50 characters"
    )
    val poNumber: String,

    @field:NotNull(message = "Total amount is required")
    @field:DecimalMin(
        value = "0.00",
        inclusive = true,
        message = "Total amount must be greater than or equal to 0"
    )
    val totalAmount: BigDecimal,

    @field:NotNull(message = "Status is required")
    val status: PurchaseOrderStatus
)