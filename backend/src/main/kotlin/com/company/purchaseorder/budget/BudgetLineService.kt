package com.company.purchaseorder.budget

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.organization.OrganizationRepository
import com.company.purchaseorder.project.ProjectRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

@Service
class BudgetLineService(

    private val budgetLineRepository: BudgetLineRepository,
    private val budgetRepository: BudgetRepository,
    private val budgetCategoryRepository: BudgetCategoryRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository

) {

    private fun getAuthenticatedUser(): AuthenticatedUser {

        val authentication = SecurityContextHolder
            .getContext()
            .authentication
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

        return principal
    }

    private fun getOrganizationId(): UUID =
        getAuthenticatedUser().organizationId

    private fun getUserId(): UUID =
        getAuthenticatedUser().id

    fun createBudgetLine(
        request: CreateBudgetLineRequest
    ): BudgetLineResponse {

        val organizationId = getOrganizationId()

        if (
            budgetLineRepository.existsByNameAndBudget_Id(
                request.name,
                request.budgetId
            )
        ) {
            throw IllegalArgumentException(
                "Budget line already exists."
            )
        }

        val organization =
            organizationRepository.findById(organizationId)
                .orElseThrow {
                    RuntimeException("Organization not found.")
                }

        val project =
            projectRepository.findById(request.projectId)
                .orElseThrow {
                    RuntimeException("Project not found.")
                }

        val budget =
            budgetRepository.findById(request.budgetId)
                .orElseThrow {
                    RuntimeException("Budget not found.")
                }

        val category =
            budgetCategoryRepository.findById(request.categoryId)
                .orElseThrow {
                    RuntimeException("Budget category not found.")
                }

        val budgetLine = BudgetLine(

            organization = organization,

            project = project,

            budget = budget,

            category = category,

            name = request.name,

            description = request.description,

            active = true,

            budgetAmount = request.budgetAmount,

            committedAmount = BigDecimal.ZERO,

            actualAmount = BigDecimal.ZERO,

            createdBy = getUserId()
        )

        val saved =
            budgetLineRepository.save(budgetLine)

        return toResponse(saved)
    }

        fun getBudgetLines(): List<BudgetLineResponse> {

        val organizationId = getOrganizationId()

        return budgetLineRepository
            .findAllByOrganization_Id(organizationId)
            .map(::toResponse)
    }

    fun getBudgetLine(
        id: UUID
    ): BudgetLineResponse {

        val organizationId = getOrganizationId()

        val budgetLine =
            budgetLineRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget line not found."
            )

        return toResponse(budgetLine)
    }

    fun updateBudgetLine(
        id: UUID,
        request: UpdateBudgetLineRequest
    ): BudgetLineResponse {

        val organizationId = getOrganizationId()

        val budgetLine =
            budgetLineRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget line not found."
            )

        budgetLine.name = request.name
        budgetLine.description = request.description
        budgetLine.active = request.active
        budgetLine.budgetAmount = request.budgetAmount

        budgetLine.updatedAt = OffsetDateTime.now()

        val updated =
            budgetLineRepository.save(budgetLine)

        return toResponse(updated)
    }

        fun deleteBudgetLine(
        id: UUID
    ) {

        val organizationId = getOrganizationId()

        val budgetLine =
            budgetLineRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget line not found."
            )

        budgetLineRepository.delete(budgetLine)
    }

    private fun toResponse(
        budgetLine: BudgetLine
    ): BudgetLineResponse {

        return BudgetLineResponse(
            id = budgetLine.id!!,
            organizationId = budgetLine.organization.id!!,
            projectId = budgetLine.project.id!!,
            budgetId = budgetLine.budget.id!!,
            categoryId = budgetLine.category.id!!,
            name = budgetLine.name,
            description = budgetLine.description,
            budgetAmount = budgetLine.budgetAmount,
            committedAmount = budgetLine.committedAmount,
            actualAmount = budgetLine.actualAmount,
            remainingAmount = budgetLine.remainingAmount
        )
    }
}