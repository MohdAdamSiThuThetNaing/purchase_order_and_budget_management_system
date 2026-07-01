package com.company.purchaseorder.purchaseorder

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/purchase-orders")
class PurchaseOrderController(

    private val purchaseOrderService: PurchaseOrderService

) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createPurchaseOrder(
        @Valid
        @RequestBody request: CreatePurchaseOrderRequest
    ): PurchaseOrderResponse {
        return purchaseOrderService.createPurchaseOrder(request)
    }

    @GetMapping
    fun getPurchaseOrders(): List<PurchaseOrderResponse> {
        return purchaseOrderService.getPurchaseOrders()
    }

    @GetMapping("/{id}")
    fun getPurchaseOrder(
        @PathVariable id: UUID
    ): PurchaseOrderResponse {
        return purchaseOrderService.getPurchaseOrder(id)
    }

    @PutMapping("/{id}")
    fun updatePurchaseOrder(
        @PathVariable id: UUID,
        @Valid
        @RequestBody request: UpdatePurchaseOrderRequest
    ): PurchaseOrderResponse {
        return purchaseOrderService.updatePurchaseOrder(id, request)
    }

    @PostMapping("/{id}/submit")
    fun submitPurchaseOrder(
        @PathVariable id: UUID
    ): PurchaseOrderResponse {
        return purchaseOrderService.submitPurchaseOrder(id)
    }

    @PostMapping("/{id}/cancel")
    fun cancelPurchaseOrder(
        @PathVariable id: UUID
    ): PurchaseOrderResponse {
        return purchaseOrderService.cancelPurchaseOrder(id)
    }

    @PostMapping("/{id}/approve")
    fun approvePurchaseOrder(
        @PathVariable id: UUID
    ): PurchaseOrderResponse {
        return purchaseOrderService.approvePurchaseOrder(id)
    }

    @PostMapping("/{id}/reject")
    fun rejectPurchaseOrder(
        @PathVariable id: UUID
    ): PurchaseOrderResponse {
        return purchaseOrderService.rejectPurchaseOrder(id)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deletePurchaseOrder(
        @PathVariable id: UUID
    ) {
        purchaseOrderService.deletePurchaseOrder(id)
    }
}
