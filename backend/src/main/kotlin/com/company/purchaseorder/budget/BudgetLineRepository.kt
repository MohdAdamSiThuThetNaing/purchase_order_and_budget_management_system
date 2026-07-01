package com.company.purchaseorder.budget

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BudgetLineRepository : JpaRepository<BudgetLine, UUID> {

    @Query("""
        SELECT bl
        FROM BudgetLine bl
        JOIN FETCH bl.category
        WHERE bl.organization.id = :organizationId
    """)
    fun findAllByOrganization_Id(
        @Param("organizationId") organizationId: UUID
    ): List<BudgetLine>

    @Query("""
        SELECT bl
        FROM BudgetLine bl
        JOIN FETCH bl.category
        WHERE bl.project.id = :projectId
    """)
    fun findAllByProject_Id(
        @Param("projectId") projectId: UUID
    ): List<BudgetLine>

    fun findAllByBudget_Id(
        budgetId: UUID
    ): List<BudgetLine>

    @Query("""
        SELECT bl
        FROM BudgetLine bl
        JOIN FETCH bl.category
        WHERE bl.category.id = :categoryId
    """)
    fun findAllByCategory_Id(
        @Param("categoryId") categoryId: UUID
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