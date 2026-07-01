package com.company.purchaseorder.organization

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateOrganizationRequest(

    @field:NotBlank(message = "Organization name is required")
    @field:Size(
        min = 2,
        max = 100,
        message = "Organization name must be between 2 and 100 characters"
    )
    val name: String
)