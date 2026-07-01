package com.company.purchaseorder.budget

import com.company.purchaseorder.organization.Organization
import com.company.purchaseorder.project.Project
import jakarta.persistence.*
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "budgets")
class Budget(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "organization_id",
        nullable = false
    )
    var organization: Organization,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "project_id",
        nullable = false
    )
    var project: Project,

    @Column(nullable = false)
    var name: String,

    
    @Column(
        name = "total_budget",
        nullable = false,
        precision = 18,
        scale = 2
    )
    var amount: BigDecimal,

    @Column(length = 1000)
    var description: String? = null,

    @Column(nullable = false)
    var active: Boolean = true
)