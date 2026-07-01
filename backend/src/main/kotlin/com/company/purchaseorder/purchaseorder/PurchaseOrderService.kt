package com.company.purchaseorder.purchaseorder

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.budget.BudgetLineRepository
import com.company.purchaseorder.organization.OrganizationRepository
import com.company.purchaseorder.project.ProjectRepository
import com.company.purchaseorder.vendor.VendorRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID
import com.company.purchaseorder.auth.repository.UserRepository
import com.company.purchaseorder.notification.NotificationService
import com.company.purchaseorder.notification.NotificationType



@Service
class PurchaseOrderService(

    private val purchaseOrderRepository: PurchaseOrderRepository,
    private val purchaseOrderItemRepository: PurchaseOrderItemRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository,
    private val vendorRepository: VendorRepository,
    private val budgetLineRepository: BudgetLineRepository,

    private val notificationService: NotificationService,
    private val userRepository: UserRepository
) {

    private fun getAuthUser(): AuthenticatedUser {
        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw RuntimeException("No authentication found.")

        if (!authentication.isAuthenticated) {
            throw RuntimeException("User not authenticated.")
        }

        val principal = authentication.principal

        if (principal !is AuthenticatedUser) {
            throw RuntimeException("Invalid principal type: ${principal::class.java.name}")
        }

        return principal
    }

    private fun getOrganizationId(): UUID =
        getAuthUser().organizationId

    private fun getUserId(): UUID =
        getAuthUser().id

    private fun createNotification(
        type: NotificationType,
        title: String,
        message: String
    ) {
        val user = userRepository.findById(getUserId())
            .orElseThrow {
                RuntimeException("User not found.")
            }

        notificationService.create(
            user = user,
            type = type,
            title = title,
            message = message
        )
    }

    @Transactional
    fun createPurchaseOrder(
        request: CreatePurchaseOrderRequest
    ): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val organization = organizationRepository.findById(organizationId)
            .orElseThrow { RuntimeException("Organization not found") }

        val project = projectRepository.findByIdAndOrganization_Id(
            request.projectId,
            organizationId
        ) ?: throw IllegalArgumentException("Project not found.")

        vendorRepository.findByIdAndOrganization_Id(
            request.vendorId,
            organizationId
        ) ?: throw IllegalArgumentException("Vendor not found.")

        validateItems(request.items, organizationId)

        val poNumber = generatePoNumber(organizationId)

        val po = PurchaseOrder(
            organization = organization,
            project = project,
            vendorId = request.vendorId,
            poNumber = poNumber,
            status = PurchaseOrderStatus.DRAFT,
            createdBy = getUserId()
        )

        request.items.forEach { itemReq ->
            po.items.add(
                PurchaseOrderItem(
                    purchaseOrder = po,
                    budgetLineId = itemReq.budgetLineId,
                    description = itemReq.description,
                    quantity = itemReq.quantity,
                    unitPrice = itemReq.unitPrice
                )
            )
        }

        po.totalAmount = calculateItemsTotal(request.items)

        val saved = purchaseOrderRepository.save(po)

        createNotification(
            NotificationType.PO_SUBMITTED,
            "Purchase Order Submitted",
            "Purchase Order ${saved.poNumber} has been submitted."
        )

        return toResponse(saved)
    }

    @Transactional(readOnly = true)
    fun getPurchaseOrders(): List<PurchaseOrderResponse> {
        val organizationId = getOrganizationId()

        return purchaseOrderRepository
            .findAllByOrganization_Id(organizationId)
            .map { toResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getPurchaseOrder(id: UUID): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        return toResponse(po)
    }

    @Transactional
    fun updatePurchaseOrder(
        id: UUID,
        request: UpdatePurchaseOrderRequest
    ): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        if (po.status != PurchaseOrderStatus.DRAFT) {
            throw IllegalArgumentException("Only draft purchase orders can be edited.")
        }

        val project = projectRepository.findByIdAndOrganization_Id(
            request.projectId,
            organizationId
        ) ?: throw IllegalArgumentException("Project not found.")

        vendorRepository.findByIdAndOrganization_Id(
            request.vendorId,
            organizationId
        ) ?: throw IllegalArgumentException("Vendor not found.")

        validateUpdateItems(request.items, organizationId)

        po.project = project
        po.vendorId = request.vendorId
        po.items.clear()

        request.items.forEach { itemReq ->
            po.items.add(
                PurchaseOrderItem(
                    purchaseOrder = po,
                    budgetLineId = itemReq.budgetLineId,
                    description = itemReq.description,
                    quantity = itemReq.quantity,
                    unitPrice = itemReq.unitPrice
                )
            )
        }

        po.totalAmount = calculateUpdateItemsTotal(request.items)
        po.updatedAt = OffsetDateTime.now()

        val updated = purchaseOrderRepository.save(po)

        return toResponse(updated)
    }

    @Transactional
    fun submitPurchaseOrder(id: UUID): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        if (po.status != PurchaseOrderStatus.DRAFT) {
            throw IllegalArgumentException("Only draft purchase orders can be submitted.")
        }

        if (po.items.isEmpty()) {
            throw IllegalArgumentException("Purchase order must have at least one item.")
        }

        po.status = PurchaseOrderStatus.SUBMITTED
        po.submittedAt = OffsetDateTime.now()
        po.updatedAt = OffsetDateTime.now()

        val saved = purchaseOrderRepository.save(po)

        createNotification(
            NotificationType.PO_SUBMITTED,
            "Purchase Order Submitted",
            "Purchase Order ${saved.poNumber} has been submitted."
        )

        return toResponse(saved)
    }

    @Transactional
    fun cancelPurchaseOrder(id: UUID): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        if (po.status != PurchaseOrderStatus.DRAFT &&
            po.status != PurchaseOrderStatus.SUBMITTED
        ) {
            throw IllegalArgumentException(
                "Only draft or submitted purchase orders can be cancelled."
            )
        }

        po.status = PurchaseOrderStatus.CANCELLED
        po.updatedAt = OffsetDateTime.now()

        val saved = purchaseOrderRepository.save(po)

        createNotification(
            NotificationType.PO_REJECTED,
            "Purchase Order Rejected",
            "Purchase Order ${saved.poNumber} has been rejected."
        )

        return toResponse(saved)
    }

    @Transactional
    fun approvePurchaseOrder(id: UUID): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        if (po.status != PurchaseOrderStatus.SUBMITTED) {
            throw IllegalArgumentException("Only submitted purchase orders can be approved.")
        }

        po.status = PurchaseOrderStatus.APPROVED
        po.decidedAt = OffsetDateTime.now()
        po.updatedAt = OffsetDateTime.now()

        val saved = purchaseOrderRepository.save(po)

        createNotification(
            NotificationType.PO_APPROVED,
            "Purchase Order Approved",
            "Purchase Order ${saved.poNumber} has been approved."
        )

        return toResponse(saved)
    }

    @Transactional
    fun rejectPurchaseOrder(id: UUID): PurchaseOrderResponse {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        if (po.status != PurchaseOrderStatus.SUBMITTED) {
            throw IllegalArgumentException("Only submitted purchase orders can be rejected.")
        }

        po.status = PurchaseOrderStatus.REJECTED
        po.decidedAt = OffsetDateTime.now()
        po.updatedAt = OffsetDateTime.now()

        val saved = purchaseOrderRepository.save(po)

        createNotification(
            NotificationType.PO_REJECTED,
            "Purchase Order Rejected",
            "Purchase Order ${saved.poNumber} has been rejected."
        )

        return toResponse(saved)
    }

    @Transactional
    fun deletePurchaseOrder(id: UUID) {
        val organizationId = getOrganizationId()

        val po = purchaseOrderRepository.findByIdAndOrganization_Id(
            id,
            organizationId
        ) ?: throw RuntimeException("Purchase order not found")

        if (po.status != PurchaseOrderStatus.DRAFT) {
            throw IllegalArgumentException("Only draft purchase orders can be deleted.")
        }

        purchaseOrderItemRepository.deleteAllByPurchaseOrder_Id(po.id!!)
        purchaseOrderRepository.delete(po)
    }

    private fun validateUpdateItems(
        items: List<UpdatePurchaseOrderItemRequest>,
        organizationId: UUID
    ) {
        items.forEach { item ->
            budgetLineRepository.findByIdAndOrganization_Id(
                item.budgetLineId,
                organizationId
            ) ?: throw IllegalArgumentException(
                "Budget line not found: ${item.budgetLineId}"
            )
        }
    }

    private fun calculateUpdateItemsTotal(
        items: List<UpdatePurchaseOrderItemRequest>
    ): BigDecimal {
        return items.fold(BigDecimal.ZERO) { acc, item ->
            acc.add(item.quantity.multiply(item.unitPrice))
        }
    }

    private fun validateItems(
        items: List<CreatePurchaseOrderItemRequest>,
        organizationId: UUID
    ) {
        items.forEach { item ->
            budgetLineRepository.findByIdAndOrganization_Id(
                item.budgetLineId,
                organizationId
            ) ?: throw IllegalArgumentException(
                "Budget line not found: ${item.budgetLineId}"
            )
        }
    }

    private fun calculateItemsTotal(
        items: List<CreatePurchaseOrderItemRequest>
    ): BigDecimal {
        return items.fold(BigDecimal.ZERO) { acc, item ->
            acc.add(item.quantity.multiply(item.unitPrice))
        }
    }

    private fun generatePoNumber(organizationId: UUID): String {
        repeat(100) {
            val number = "PO-${System.currentTimeMillis()}-${(1000..9999).random()}"
            if (!purchaseOrderRepository.existsByPoNumberAndOrganization_Id(
                    number,
                    organizationId
                )
            ) {
                return number
            }
        }
        throw RuntimeException("Could not generate unique PO number.")
    }

    private fun toResponse(po: PurchaseOrder): PurchaseOrderResponse {
        val items = po.items.map { item ->
            PurchaseOrderItemResponse(
                id = item.id!!,
                budgetLineId = item.budgetLineId,
                description = item.description,
                quantity = item.quantity,
                unitPrice = item.unitPrice,
                total = item.quantity.multiply(item.unitPrice)
            )
        }

        return PurchaseOrderResponse(
            id = po.id!!,
            organizationId = po.organization.id!!,
            projectId = po.project.id!!,
            vendorId = po.vendorId,
            poNumber = po.poNumber,
            totalAmount = po.totalAmount,
            status = po.status,
            createdBy = po.createdBy,
            submittedAt = po.submittedAt,
            decidedAt = po.decidedAt,
            version = po.version,
            items = items
        )
    }
}
