package com.company.purchaseorder.budget

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/budget-lines")
class BudgetLineController(

    private val budgetLineService: BudgetLineService

) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBudgetLine(
        @Valid
        @RequestBody request: CreateBudgetLineRequest
    ): BudgetLineResponse {

        return budgetLineService.createBudgetLine(request)
    }

    @GetMapping
    fun getBudgetLines(): List<BudgetLineResponse> {

        return budgetLineService.getBudgetLines()
    }

    @GetMapping("/{id}")
    fun getBudgetLine(
        @PathVariable id: UUID
    ): BudgetLineResponse {

        return budgetLineService.getBudgetLine(id)
    }

    @PutMapping("/{id}")
    fun updateBudgetLine(
        @PathVariable id: UUID,
        @Valid
        @RequestBody request: UpdateBudgetLineRequest
    ): BudgetLineResponse {

        return budgetLineService.updateBudgetLine(
            id,
            request
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteBudgetLine(
        @PathVariable id: UUID
    ) {

        budgetLineService.deleteBudgetLine(id)
    }
}