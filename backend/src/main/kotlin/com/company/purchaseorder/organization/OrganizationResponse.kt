package com.company.purchaseorder.organization

import java.util.UUID

data class OrganizationResponse(

    val id: UUID?,

    val name: String,

    val slug: String
)