package com.company.purchaseorder.budget

import java.math.BigDecimal
import java.util.UUID

data class BudgetResponse(
    val id: UUID,
    val organizationId: UUID,
    val projectId: UUID,
    val name: String,
    val amount: BigDecimal,
    val description: String?,
    val active: Boolean
)