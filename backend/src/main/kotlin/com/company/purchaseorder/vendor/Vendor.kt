package com.company.purchaseorder.vendor

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
@Table(name = "vendors")
class Vendor(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    var organization: Organization,

    @Column(nullable = false, length = 150)
    var name: String,

    @Column(name = "contact_email", length = 255)
    var contactEmail: String? = null,

    @Column(name = "contact_phone", length = 50)
    var contactPhone: String? = null,

    @Column(name = "is_active", nullable = false)
    var active: Boolean = true
)
