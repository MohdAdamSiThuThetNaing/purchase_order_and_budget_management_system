package com.company.purchaseorder.project

import com.company.purchaseorder.organization.Organization
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "projects")
class Project(

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

    @Column(nullable = false)
    var name: String,

    @Column(length = 1000)
    var description: String? = null,

    @Column(name = "is_active", nullable = false)
    var active: Boolean = true
)