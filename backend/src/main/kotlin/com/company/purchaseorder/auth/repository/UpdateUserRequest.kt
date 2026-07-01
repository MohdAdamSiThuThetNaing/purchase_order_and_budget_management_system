package com.company.purchaseorder.auth.repository

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import java.util.UUID

data class UpdateUserRequest(

    @field:NotBlank
    @field:Email
    val email: String,

    val password: String = "",

    @field:NotBlank
    val firstName: String,

    @field:NotBlank
    val lastName: String,

    val isActive: Boolean,

    val roleIds: List<UUID>
)