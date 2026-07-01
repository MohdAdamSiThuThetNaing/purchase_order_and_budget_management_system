package com.company.purchaseorder.project

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UpdateProjectRequest(

    @field:NotBlank(message = "Project name is required")
    @field:Size(
        min = 2,
        max = 100,
        message = "Project name must be between 2 and 100 characters"
    )
    val name: String,

    @field:Size(
        max = 1000,
        message = "Description cannot exceed 1000 characters"
    )
    val description: String? = null,

    val active: Boolean = true
)