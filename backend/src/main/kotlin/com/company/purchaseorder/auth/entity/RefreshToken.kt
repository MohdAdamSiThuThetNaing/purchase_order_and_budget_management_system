package com.company.purchaseorder.entity

import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

/**
 * Refresh tokens are never stored in plaintext - only a SHA-256 hash of the token
 * is persisted (see RefreshTokenHasher). This way, a database leak alone cannot be
 * used to mint new access tokens; the raw token only ever exists client-side and
 * in-transit over TLS.
 */
@Entity
@Table(name = "refresh_tokens")
class RefreshToken(

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    var id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", columnDefinition = "uuid", nullable = false)
    var userId: UUID,

    @Column(name = "token_hash", nullable = false, unique = true)
    var tokenHash: String,

    @Column(name = "expires_at", nullable = false)
    var expiresAt: OffsetDateTime,

    @Column(name = "revoked_at")
    var revokedAt: OffsetDateTime? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: OffsetDateTime = OffsetDateTime.now()
) {
    fun isActive(): Boolean = revokedAt == null && expiresAt.isAfter(OffsetDateTime.now())
}
