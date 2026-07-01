package com.company.purchaseorder.auth.repository

import com.company.purchaseorder.auth.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository : JpaRepository<User, UUID> {

    fun findByEmailIgnoreCaseAndIsActiveTrue(
        email: String
    ): User?

    fun existsByEmailIgnoreCase(
        email: String
    ): Boolean

    fun findAllByOrganizationId(
        organizationId: UUID
    ): List<User>

    fun findByIdAndOrganizationId(
        id: UUID,
        organizationId: UUID
    ): User?
}