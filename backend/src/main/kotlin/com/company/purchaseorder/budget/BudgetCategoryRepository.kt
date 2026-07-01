package com.company.purchaseorder.budget

import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BudgetCategoryRepository : JpaRepository<BudgetCategory, UUID> {

    @EntityGraph(
        attributePaths = [
            "budget",
            "project",
            "organization",
            "createdBy"
        ]
    )
    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<BudgetCategory>

    @EntityGraph(
        attributePaths = [
            "budget",
            "project",
            "organization",
            "createdBy"
        ]
    )
    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): BudgetCategory?

    fun existsByNameAndBudget_Id(
        name: String,
        budgetId: UUID
    ): Boolean
}