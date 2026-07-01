package com.company.purchaseorder.budget

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.organization.OrganizationRepository
import com.company.purchaseorder.project.ProjectRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class BudgetCategoryService(

    private val budgetCategoryRepository: BudgetCategoryRepository,
    private val budgetRepository: BudgetRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository

) {

    private fun getAuthenticatedUser(): AuthenticatedUser {

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

        return principal
    }

    private fun getOrganizationId(): UUID =
        getAuthenticatedUser().organizationId

    private fun getUserId(): UUID =
        getAuthenticatedUser().id

    fun createBudgetCategory(
        request: CreateBudgetCategoryRequest
    ): BudgetCategoryResponse {

        val organizationId = getOrganizationId()

        if (
            budgetCategoryRepository.existsByNameAndBudget_Id(
                request.name,
                request.budgetId
            )
        ) {
            throw IllegalArgumentException(
                "Budget category already exists."
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

        val category = BudgetCategory(
            organization = organization,
            project = project,
            budget = budget,
            name = request.name,
            description = request.description,
            active = true,
            createdBy = getUserId()
        )

        val saved = budgetCategoryRepository.save(category)

        return toResponse(saved)
    }

    fun getBudgetCategories(): List<BudgetCategoryResponse> {

        val organizationId = getOrganizationId()

        return budgetCategoryRepository
            .findAllByOrganization_Id(organizationId)
            .map(::toResponse)
    }

    fun getBudgetCategory(
        id: UUID
    ): BudgetCategoryResponse {

        val organizationId = getOrganizationId()

        val category =
            budgetCategoryRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget category not found."
            )

        return toResponse(category)
    }

    fun updateBudgetCategory(
        id: UUID,
        request: UpdateBudgetCategoryRequest
    ): BudgetCategoryResponse {

        val organizationId = getOrganizationId()

        val category =
            budgetCategoryRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget category not found."
            )

        category.name = request.name
        category.description = request.description
        category.active = request.active

        val updated =
            budgetCategoryRepository.save(category)

        return toResponse(updated)
    }

    fun deleteBudgetCategory(
        id: UUID
    ) {

        val organizationId = getOrganizationId()

        val category =
            budgetCategoryRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget category not found."
            )

        budgetCategoryRepository.delete(category)
    }

    private fun toResponse(
        category: BudgetCategory
    ): BudgetCategoryResponse {

        return BudgetCategoryResponse(
            id = category.id!!,
            organizationId = category.organization.id!!,
            projectId = category.project.id!!,
            budgetId = category.budget.id!!,
            name = category.name,
            description = category.description,
            active = category.active
        )
    }
}