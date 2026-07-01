package com.company.purchaseorder.auth.repository

import com.company.purchaseorder.auth.entity.Permission
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface PermissionRepository : JpaRepository<Permission, UUID> {

    fun findByCode(
        code: String
    ): Permission?

    fun findAllByCodeIn(
        codes: Collection<String>
    ): List<Permission>
}