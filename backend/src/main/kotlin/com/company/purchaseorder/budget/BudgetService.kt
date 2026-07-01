package com.company.purchaseorder.budget

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.auth.repository.UserRepository
import com.company.purchaseorder.organization.OrganizationRepository
import com.company.purchaseorder.project.ProjectRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class BudgetService(

    private val budgetRepository: BudgetRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository

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

    fun createBudget(
        request: CreateBudgetRequest
    ): BudgetResponse {

        val authenticatedUser = getAuthenticatedUser()
        val organizationId = authenticatedUser.organizationId

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

        val createdBy =
            userRepository.findById(authenticatedUser.id)
                .orElseThrow {
                    RuntimeException("User not found.")
                }

        if (
            budgetRepository.existsByNameAndProject_Id(
                request.name,
                request.projectId
            )
        ) {
            throw IllegalArgumentException(
                "Budget already exists."
            )
        }

        val budget = Budget(
            organization = organization,
            project = project,
            createdBy = createdBy,
            name = request.name,
            amount = request.amount,
            description = request.description,
            active = request.active
        )

        val saved = budgetRepository.save(budget)

        return toResponse(saved)
    }

    fun getBudgets(): List<BudgetResponse> {

        val organizationId = getOrganizationId()

        return budgetRepository
            .findAllByOrganization_Id(organizationId)
            .map(::toResponse)
    }

    fun getBudget(
        id: UUID
    ): BudgetResponse {

        val organizationId = getOrganizationId()

        val budget =
            budgetRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget not found."
            )

        return toResponse(budget)
    }

    fun updateBudget(
        id: UUID,
        request: UpdateBudgetRequest
    ): BudgetResponse {

        val organizationId = getOrganizationId()

        val budget =
            budgetRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget not found."
            )

        budget.name = request.name
        budget.amount = request.amount
        budget.description = request.description
        budget.active = request.active

        val updated = budgetRepository.save(budget)

        return toResponse(updated)
    }

    fun deleteBudget(id: UUID) {

        val organizationId = getOrganizationId()

        val budget =
            budgetRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Budget not found."
            )

        budgetRepository.delete(budget)
    }

    private fun toResponse(
        budget: Budget
    ): BudgetResponse {

        return BudgetResponse(
            id = budget.id!!,
            organizationId = budget.organization.id!!,
            projectId = budget.project.id!!,
            projectName = budget.project.name,
            name = budget.name,
            amount = budget.amount,
            description = budget.description,
            active = budget.active
        )
    }
}