package com.company.purchaseorder.budget

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/budget-categories")
class BudgetCategoryController(

    private val budgetCategoryService: BudgetCategoryService

) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBudgetCategory(
        @Valid
        @RequestBody request: CreateBudgetCategoryRequest
    ): BudgetCategoryResponse {

        return budgetCategoryService.createBudgetCategory(request)
    }

    @GetMapping
    fun getBudgetCategories(): List<BudgetCategoryResponse> {

        return budgetCategoryService.getBudgetCategories()
    }

    @GetMapping("/{id}")
    fun getBudgetCategory(
        @PathVariable id: UUID
    ): BudgetCategoryResponse {

        return budgetCategoryService.getBudgetCategory(id)
    }

    @PutMapping("/{id}")
    fun updateBudgetCategory(
        @PathVariable id: UUID,
        @Valid
        @RequestBody request: UpdateBudgetCategoryRequest
    ): BudgetCategoryResponse {

        return budgetCategoryService.updateBudgetCategory(
            id,
            request
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteBudgetCategory(
        @PathVariable id: UUID
    ) {

        budgetCategoryService.deleteBudgetCategory(id)
    }
}