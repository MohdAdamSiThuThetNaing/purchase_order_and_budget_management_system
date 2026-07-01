package com.company.purchaseorder.budget

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.UUID

data class CreateBudgetCategoryRequest(

    @field:NotNull(message = "Budget ID is required")
    val budgetId: UUID,

    @field:NotNull(message = "Project ID is required")
    val projectId: UUID,

    @field:NotBlank(message = "Category name is required")
    @field:Size(
        min = 2,
        max = 100,
        message = "Category name must be between 2 and 100 characters"
    )
    val name: String,

    @field:Size(
        max = 500,
        message = "Description cannot exceed 500 characters"
    )
    val description: String? = null
)