package com.company.purchaseorder.vendor

import java.util.UUID

data class VendorResponse(
    val id: UUID,
    val organizationId: UUID,
    val name: String,
    val contactEmail: String?,
    val contactPhone: String?,
    val active: Boolean
)
