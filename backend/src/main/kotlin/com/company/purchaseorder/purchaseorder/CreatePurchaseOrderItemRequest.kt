package com.company.purchaseorder.purchaseorder

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.util.UUID

data class CreatePurchaseOrderItemRequest(

    @field:NotNull(message = "Budget Line ID is required")
    val budgetLineId: UUID,

    @field:NotBlank(message = "Description is required")
    @field:Size(
        min = 2,
        max = 500,
        message = "Description must be between 2 and 500 characters"
    )
    val description: String,

    @field:NotNull(message = "Quantity is required")
    @field:DecimalMin(
        value = "0.01",
        inclusive = true,
        message = "Quantity must be greater than 0"
    )
    val quantity: BigDecimal,

    @field:NotNull(message = "Unit price is required")
    @field:DecimalMin(
        value = "0.00",
        inclusive = true,
        message = "Unit price must be greater than or equal to 0"
    )
    val unitPrice: BigDecimal
)