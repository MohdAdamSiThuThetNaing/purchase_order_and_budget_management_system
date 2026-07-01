package com.company.purchaseorder.auth.repository

import com.company.purchaseorder.auth.entity.Role
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RoleRepository : JpaRepository<Role, UUID> {

    fun findByOrganizationIdAndName(
        organizationId: UUID,
        name: String
    ): Role?

    fun findAllByOrganizationId(
        organizationId: UUID
    ): List<Role>
}