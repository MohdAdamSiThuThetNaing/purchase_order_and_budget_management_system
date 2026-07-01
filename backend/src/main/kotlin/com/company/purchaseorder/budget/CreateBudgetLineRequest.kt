package com.company.purchaseorder.budget

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.util.UUID

data class CreateBudgetLineRequest(

    @field:NotNull(message = "Project ID is required")
    val projectId: UUID,

    @field:NotNull(message = "Budget ID is required")
    val budgetId: UUID,

    @field:NotNull(message = "Budget Category ID is required")
    val categoryId: UUID,

    @field:NotBlank(message = "Budget line name is required")
    @field:Size(
        min = 2,
        max = 150,
        message = "Budget line name must be between 2 and 150 characters"
    )
    val name: String,

    @field:Size(
        max = 500,
        message = "Description cannot exceed 500 characters"
    )
    val description: String? = null,

    @field:NotNull(message = "Budget amount is required")
    @field:DecimalMin(
        value = "0.00",
        inclusive = true,
        message = "Budget amount must be greater than or equal to 0"
    )
    val budgetAmount: BigDecimal
)