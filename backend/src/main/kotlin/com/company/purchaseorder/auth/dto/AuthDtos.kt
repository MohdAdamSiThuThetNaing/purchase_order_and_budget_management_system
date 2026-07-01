package com.company.purchaseorder.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import java.util.UUID

data class LoginRequest(
    @field:Email(message = "Must be a valid email address")
    @field:NotBlank(message = "Email is required")
    val email: String,

    @field:NotBlank(message = "Password is required")
    val password: String
)

data class RefreshRequest(
    @field:NotBlank(message = "Refresh token is required")
    val refreshToken: String
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresInSeconds: Long,
    val user: UserSummary
)

data class UserSummary(
    val id: UUID,
    val organizationId: UUID,
    val email: String,
    val firstName: String,
    val lastName: String,
    val roles: List<String>
)
