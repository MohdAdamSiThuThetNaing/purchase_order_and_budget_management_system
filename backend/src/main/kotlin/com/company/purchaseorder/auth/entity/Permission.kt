package com.company.purchaseorder.auth.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "permissions")
class Permission(

    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, unique = true, length = 100)
    var code: String,

    @Column(length = 255)
    var description: String? = null
    
)