package com.company.purchaseorder.budget

import java.math.BigDecimal

data class BudgetSummaryResponse(

    val budget: BigDecimal,

    val committed: BigDecimal,

    val actual: BigDecimal,

    val remaining: BigDecimal
)