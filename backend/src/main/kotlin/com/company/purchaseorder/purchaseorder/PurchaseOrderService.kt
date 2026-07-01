package com.company.purchaseorder.purchaseorder

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.organization.OrganizationRepository
import com.company.purchaseorder.project.ProjectRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class PurchaseOrderService(

    private val purchaseOrderRepository: PurchaseOrderRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository

) {

    private fun getOrganizationId(): UUID {

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

        return principal.organizationId
    }

    private fun getUserId(): UUID {

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

        return principal.id
    }

    fun createPurchaseOrder(
        request: CreatePurchaseOrderRequest
    ): PurchaseOrderResponse {

        val organizationId = getOrganizationId()

        if (
            purchaseOrderRepository.existsByPoNumberAndOrganization_Id(
                request.poNumber,
                organizationId
            )
        ) {
            throw IllegalArgumentException(
                "Purchase order already exists."
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

        val purchaseOrder = PurchaseOrder(
            organization = organization,
            project = project,
            vendorId = request.vendorId,
            poNumber = request.poNumber,
            status = request.status,
            totalAmount = request.totalAmount,
            createdBy = getUserId()
        )

        val saved = purchaseOrderRepository.save(purchaseOrder)

        return toResponse(saved)
    }

    fun getPurchaseOrders(): List<PurchaseOrderResponse> {

        val organizationId = getOrganizationId()

        return purchaseOrderRepository
            .findAllByOrganization_Id(organizationId)
            .map(::toResponse)
    }

    fun getPurchaseOrder(
        id: UUID
    ): PurchaseOrderResponse {

        val organizationId = getOrganizationId()

        val purchaseOrder =
            purchaseOrderRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Purchase order not found."
            )

        return toResponse(purchaseOrder)
    }

    fun updatePurchaseOrder(
        id: UUID,
        request: UpdatePurchaseOrderRequest
    ): PurchaseOrderResponse {

        val organizationId = getOrganizationId()

        val purchaseOrder =
            purchaseOrderRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Purchase order not found."
            )

        if (
            purchaseOrder.poNumber != request.poNumber &&
            purchaseOrderRepository.existsByPoNumberAndOrganization_Id(
                request.poNumber,
                organizationId
            )
        ) {
            throw IllegalArgumentException(
                "Purchase order number already exists."
            )
        }

        purchaseOrder.vendorId = request.vendorId
        purchaseOrder.poNumber = request.poNumber
        purchaseOrder.totalAmount = request.totalAmount
        purchaseOrder.status = request.status

        val updated = purchaseOrderRepository.save(purchaseOrder)

        return toResponse(updated)
    }

    fun deletePurchaseOrder(
        id: UUID
    ) {

        val organizationId = getOrganizationId()

        val purchaseOrder =
            purchaseOrderRepository.findByIdAndOrganization_Id(
                id,
                organizationId
            ) ?: throw RuntimeException(
                "Purchase order not found."
            )

        purchaseOrderRepository.delete(purchaseOrder)
    }

    private fun toResponse(
        purchaseOrder: PurchaseOrder
    ): PurchaseOrderResponse {

        return PurchaseOrderResponse(
            id = purchaseOrder.id!!,
            organizationId = purchaseOrder.organization.id!!,
            projectId = purchaseOrder.project.id!!,
            vendorId = purchaseOrder.vendorId,
            poNumber = purchaseOrder.poNumber,
            totalAmount = purchaseOrder.totalAmount,
            status = purchaseOrder.status,
            createdBy = purchaseOrder.createdBy,
            submittedAt = purchaseOrder.submittedAt,
            decidedAt = purchaseOrder.decidedAt,
            version = purchaseOrder.version
        )
    }
}