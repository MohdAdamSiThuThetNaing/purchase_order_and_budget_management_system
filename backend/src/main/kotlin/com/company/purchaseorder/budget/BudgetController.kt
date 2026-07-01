package com.company.purchaseorder.budget

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/budgets")
class BudgetController(

    private val budgetService: BudgetService

) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBudget(
        @Valid @RequestBody request: CreateBudgetRequest
    ): BudgetResponse {

        return budgetService.createBudget(request)
    }

    @GetMapping
    fun getBudgets(): List<BudgetResponse> {

        return budgetService.getBudgets()
    }

    @GetMapping("/{id}")
    fun getBudget(
        @PathVariable id: UUID
    ): BudgetResponse {

        return budgetService.getBudget(id)
    }

    @PutMapping("/{id}")
    fun updateBudget(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateBudgetRequest
    ): BudgetResponse {

        return budgetService.updateBudget(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteBudget(
        @PathVariable id: UUID
    ) {

        budgetService.deleteBudget(id)
    }
}