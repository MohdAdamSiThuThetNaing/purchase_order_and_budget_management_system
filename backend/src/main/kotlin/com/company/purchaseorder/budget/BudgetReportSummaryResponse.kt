package com.company.purchaseorder.budget

import java.math.BigDecimal

data class BudgetReportSummaryResponse(
    val totalBudget: BigDecimal,
    val totalCommitted: BigDecimal,
    val totalActual: BigDecimal,
    val totalRemaining: BigDecimal,
    val items: List<BudgetReportResponse>
)

