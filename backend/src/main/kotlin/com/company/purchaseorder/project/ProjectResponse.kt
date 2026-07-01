package com.company.purchaseorder.project

import java.util.UUID

data class ProjectResponse(
    val id: UUID,
    val organizationId: UUID,
    val name: String,
    val description: String?,
    val active: Boolean
)