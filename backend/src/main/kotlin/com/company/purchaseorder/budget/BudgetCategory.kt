package com.company.purchaseorder.budget

import com.company.purchaseorder.organization.Organization
import com.company.purchaseorder.project.Project
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import jakarta.persistence.Version
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "budget_categories")
class BudgetCategory(

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    var budget: Budget,

    @Column(nullable = false, length = 100)
    var name: String,

    @Column(length = 500)
    var description: String? = null,

    @Column(nullable = false)
    var active: Boolean = true,

    @OneToMany(
        mappedBy = "category",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    var budgetLines: MutableList<BudgetLine> = mutableListOf(),

    @Column(name = "created_by", nullable = false)
    var createdBy: UUID,

    @Column(name = "created_at", nullable = false)
    var createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),

    @Version
    @Column(nullable = false)
    var version: Int = 0
)