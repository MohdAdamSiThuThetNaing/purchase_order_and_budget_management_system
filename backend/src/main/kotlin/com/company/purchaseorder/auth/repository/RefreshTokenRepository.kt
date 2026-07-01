package com.company.purchaseorder.repository

import com.company.purchaseorder.entity.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface RefreshTokenRepository : JpaRepository<RefreshToken, UUID> {
    fun findByTokenHash(tokenHash: String): Optional<RefreshToken>
    fun deleteAllByUserId(userId: UUID)
}
