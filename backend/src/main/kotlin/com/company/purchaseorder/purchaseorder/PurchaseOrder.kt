package com.company.purchaseorder.purchaseorder

import com.company.purchaseorder.organization.Organization
import com.company.purchaseorder.project.Project
import jakarta.persistence.*
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "purchase_orders")
class PurchaseOrder(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    var organization: Organization,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: Project,

    @Column(name = "vendor_id", nullable = false)
    var vendorId: UUID,

    @Column(name = "approval_workflow_id")
    var approvalWorkflowId: UUID? = null,

    @Column(name = "current_approval_step", nullable = false)
    var currentApprovalStep: Int = 0,

    @Column(name = "po_number", nullable = false, length = 50)
    var poNumber: String,

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    @Column(name = "status", columnDefinition = "po_status", nullable = false)
    var status: PurchaseOrderStatus = PurchaseOrderStatus.DRAFT,

    @Column(
        name = "total_amount",
        nullable = false,
        precision = 14,
        scale = 2
    )
    var totalAmount: BigDecimal = BigDecimal.ZERO,

    @OneToMany(
        mappedBy = "purchaseOrder",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    var items: MutableList<PurchaseOrderItem> = mutableListOf(),

    @Column(name = "created_by", nullable = false)
    var createdBy: UUID,

    @Column(name = "submitted_at")
    var submittedAt: OffsetDateTime? = null,

    @Column(name = "decided_at")
    var decidedAt: OffsetDateTime? = null,

    @Column(name = "created_at", nullable = false)
    var createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),

    @Version
    @Column(nullable = false)
    var version: Int = 0
)