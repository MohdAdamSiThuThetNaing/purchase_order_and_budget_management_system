package com.company.purchaseorder.budget

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BudgetCategoryRepository : JpaRepository<BudgetCategory, UUID> {

    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<BudgetCategory>

    fun findAllByProject_Id(
        projectId: UUID
    ): List<BudgetCategory>

    fun findAllByBudget_Id(
        budgetId: UUID
    ): List<BudgetCategory>

    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): BudgetCategory?

    fun existsByNameAndBudget_Id(
        name: String,
        budgetId: UUID
    ): Boolean
}