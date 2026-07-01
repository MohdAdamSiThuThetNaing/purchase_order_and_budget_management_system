package com.company.purchaseorder.budget

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal

data class UpdateBudgetRequest(

    @field:NotBlank(message = "Budget name is required")
    @field:Size(
        min = 2,
        max = 100,
        message = "Budget name must be between 2 and 100 characters"
    )
    val name: String,

    @field:NotNull(message = "Budget amount is required")
    @field:DecimalMin(
        value = "0.01",
        message = "Budget amount must be greater than 0"
    )
    val amount: BigDecimal,

    @field:Size(
        max = 1000,
        message = "Description cannot exceed 1000 characters"
    )
    val description: String? = null,

    val active: Boolean = true
)