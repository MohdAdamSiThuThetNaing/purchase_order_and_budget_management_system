package com.company.purchaseorder.auth.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(
    name = "roles",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uq_roles_org_name",
            columnNames = ["organization_id", "name"]
        )
    ]
)
open class Role(

    @Id
    @Column(columnDefinition = "uuid")
    open var id: UUID = UUID.randomUUID(),

    @Column(name = "organization_id", nullable = false)
    open var organizationId: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 100)
    open var name: String = "",

    @Column(length = 255)
    open var description: String? = null,

    @Column(name = "is_system", nullable = false)
    open var isSystem: Boolean = false,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = [JoinColumn(name = "role_id")],
        inverseJoinColumns = [JoinColumn(name = "permission_id")]
    )
    open var permissions: MutableSet<Permission> = mutableSetOf()

) {
    constructor() : this(
        UUID.randomUUID(),
        UUID.randomUUID(),
        "",
        null,
        false
    )
}