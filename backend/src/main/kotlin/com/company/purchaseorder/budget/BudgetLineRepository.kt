package com.company.purchaseorder.budget

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BudgetLineRepository : JpaRepository<BudgetLine, UUID> {

    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<BudgetLine>

    fun findAllByProject_Id(
        projectId: UUID
    ): List<BudgetLine>

    fun findAllByBudget_Id(
        budgetId: UUID
    ): List<BudgetLine>

    fun findAllByCategory_Id(
        categoryId: UUID
    ): List<BudgetLine>

    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): BudgetLine?

    fun existsByNameAndBudget_Id(
        name: String,
        budgetId: UUID
    ): Boolean
}