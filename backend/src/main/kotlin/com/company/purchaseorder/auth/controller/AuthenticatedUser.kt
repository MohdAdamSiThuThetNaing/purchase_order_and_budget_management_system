package com.company.purchaseorder.auth.controller

import java.util.UUID

/**
 * Lightweight principal populated by JwtAuthenticationFilter from the verified
 * access token's claims - no database hit needed per request.
 */
data class AuthenticatedUser(
    val id: UUID,
    val organizationId: UUID,
    val email: String,
    val roles: List<String>
)
