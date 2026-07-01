package com.company.purchaseorder.budget

import java.math.BigDecimal

data class BudgetReportResponse(

    val category: String,

    val budgetLine: String,

    val budget: BigDecimal,

    val committed: BigDecimal,

    val actual: BigDecimal,

    val remaining: BigDecimal
)