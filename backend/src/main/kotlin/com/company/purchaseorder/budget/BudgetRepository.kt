package com.company.purchaseorder.budget

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BudgetRepository : JpaRepository<Budget, UUID> {

    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<Budget>

    fun findAllByProject_Id(
        projectId: UUID
    ): List<Budget>

    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): Budget?

    fun existsByNameAndProject_Id(
        name: String,
        projectId: UUID
    ): Boolean
}