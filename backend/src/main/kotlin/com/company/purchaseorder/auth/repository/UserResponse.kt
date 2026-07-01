package com.company.purchaseorder.auth.repository

import java.time.OffsetDateTime
import java.util.UUID

data class UserResponse(
    val id: UUID,
    val organizationId: UUID,
    val email: String,
    val firstName: String,
    val lastName: String,
    val isActive: Boolean,
    val createdAt: OffsetDateTime,
    val updatedAt: OffsetDateTime,
    val roles: List<RoleResponse>
)