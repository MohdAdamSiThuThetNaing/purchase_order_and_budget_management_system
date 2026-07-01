package com.company.purchaseorder.budget

import java.math.BigDecimal
import java.util.UUID

data class BudgetLineResponse(

    val id: UUID,

    val organizationId: UUID,

    val projectId: UUID,

    val budgetId: UUID,

    val categoryId: UUID,

    val name: String,

    val description: String?,

    val budgetAmount: BigDecimal,

    val committedAmount: BigDecimal,

    val actualAmount: BigDecimal,

    val remainingAmount: BigDecimal
)