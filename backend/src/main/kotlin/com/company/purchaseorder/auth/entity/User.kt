package com.company.purchaseorder.auth.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "users")
open class User(

    @Id
    @Column(
        name = "id",
        columnDefinition = "uuid",
        nullable = false,
        updatable = false
    )
    open var id: UUID = UUID.randomUUID(),

    @Column(
        name = "organization_id",
        columnDefinition = "uuid",
        nullable = false
    )
    open var organizationId: UUID,

    @Column(
        name = "email",
        nullable = false,
        unique = true
    )
    open var email: String,

    @Column(
        name = "password_hash",
        nullable = false
    )
    open var passwordHash: String,

    @Column(
        name = "first_name",
        nullable = false
    )
    open var firstName: String,

    @Column(
        name = "last_name",
        nullable = false
    )
    open var lastName: String,

    @Column(
        name = "is_active",
        nullable = false
    )
    open var isActive: Boolean = true,

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    open var createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(
        name = "updated_at",
        nullable = false
    )
    open var updatedAt: OffsetDateTime = OffsetDateTime.now(),

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = [
            JoinColumn(name = "user_id")
        ],
        inverseJoinColumns = [
            JoinColumn(name = "role_id")
        ]
    )
    open var roles: MutableSet<Role> = mutableSetOf()

) {

    constructor() : this(
        id = UUID.randomUUID(),
        organizationId = UUID.randomUUID(),
        email = "",
        passwordHash = "",
        firstName = "",
        lastName = "",
        isActive = true,
        createdAt = OffsetDateTime.now(),
        updatedAt = OffsetDateTime.now(),
        roles = mutableSetOf()
    )

    @PrePersist
    fun prePersist() {
        val now = OffsetDateTime.now()
        createdAt = now
        updatedAt = now
    }

    @PreUpdate
    fun preUpdate() {
        updatedAt = OffsetDateTime.now()
    }
    
}