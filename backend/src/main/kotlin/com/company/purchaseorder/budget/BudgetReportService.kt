package com.company.purchaseorder.budget

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID

@Service
@Transactional(readOnly = true)
class BudgetReportService(
    private val budgetLineRepository: BudgetLineRepository
) {

    private fun getOrganizationId(): UUID {
        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw RuntimeException("No authentication found.")

        if (!authentication.isAuthenticated) {
            throw RuntimeException("User is not authenticated.")
        }

        val principal = authentication.principal

        if (principal !is AuthenticatedUser) {
            throw RuntimeException(
                "Invalid principal type: ${principal::class.java.name}"
            )
        }

        return principal.organizationId
    }

    fun getBudgetReport(
        projectId: UUID?,
        categoryId: UUID?
    ): BudgetReportSummaryResponse {

        val organizationId = getOrganizationId()

        val lines = when {
            categoryId != null ->
                budgetLineRepository.findAllByCategory_Id(categoryId)
                    .filter { it.organization.id == organizationId }

            projectId != null ->
                budgetLineRepository.findAllByProject_Id(projectId)
                    .filter { it.organization.id == organizationId }

            else ->
                budgetLineRepository.findAllByOrganization_Id(organizationId)
        }

        val items = lines
            .sortedWith(
                compareBy<BudgetLine> { it.category.name }
                    .thenBy { it.name }
            )
            .map { line ->
                BudgetReportResponse(
                    category = line.category.name,
                    budgetLine = line.name,
                    budget = line.budgetAmount,
                    committed = line.committedAmount,
                    actual = line.actualAmount,
                    remaining = line.remainingAmount
                )
            }

        return BudgetReportSummaryResponse(
            totalBudget = items.sumOf { it.budget },
            totalCommitted = items.sumOf { it.committed },
            totalActual = items.sumOf { it.actual },
            totalRemaining = items.sumOf { it.remaining },
            items = items
        )
    }
}