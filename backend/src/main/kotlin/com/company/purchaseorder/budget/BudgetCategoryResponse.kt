package com.company.purchaseorder.budget

import java.util.UUID

data class BudgetCategoryResponse(

    val id: UUID,

    val organizationId: UUID,

    val projectId: UUID,

    val budgetId: UUID,

    val budgetName: String,

    val name: String,

    val description: String?,

    val active: Boolean
)