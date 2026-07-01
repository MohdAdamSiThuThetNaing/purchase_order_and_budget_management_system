package com.company.purchaseorder.purchaseorder


import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "purchase_order_items")
class PurchaseOrderItem(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    var purchaseOrder: PurchaseOrder,

    @Column(name = "budget_line_id", nullable = false)
    var budgetLineId: UUID,

    @Column(nullable = false, length = 500)
    var description: String,

    @Column(nullable = false, precision = 14, scale = 2)
    var quantity: BigDecimal,

    @Column(name = "unit_price", nullable = false, precision = 14, scale = 2)
    var unitPrice: BigDecimal,

    @Column(
        nullable = false,
        precision = 14,
        scale = 2,
        insertable = false,
        updatable = false
    )
    var total: BigDecimal = BigDecimal.ZERO
)