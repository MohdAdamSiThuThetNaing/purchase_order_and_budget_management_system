package com.company.purchaseorder.security

import java.util.UUID

data class AuthenticatedUser(
    val id: UUID,
    val email: String,
    val organizationId: UUID,
    val roles: List<String>
)