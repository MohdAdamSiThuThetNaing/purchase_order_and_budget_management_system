package com.company.purchaseorder.organization

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "organizations")
class Organization(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    val id: UUID? = null,

    @Column(nullable = false, unique = true)
    var name: String,

    @Column(nullable = false, unique = true)
    var slug: String = ""

) {

    @PrePersist
    @PreUpdate
    fun generateSlug() {
        if (slug.isBlank()) {
            slug = name
                .trim()
                .lowercase()
                .replace(Regex("[^a-z0-9\\s-]"), "")
                .replace(Regex("\\s+"), "-")
        }
    }
}