package com.company.purchaseorder.budget

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/budget-reports")
class BudgetReportController(
    private val budgetReportService: BudgetReportService
) {

    @GetMapping
    fun getBudgetReport(
        @RequestParam(required = false) projectId: UUID?,
        @RequestParam(required = false) categoryId: UUID?
    ): BudgetReportSummaryResponse {
        return budgetReportService.getBudgetReport(projectId, categoryId)
    }
}

