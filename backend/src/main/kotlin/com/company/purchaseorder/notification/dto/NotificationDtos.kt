package com.company.purchaseorder.notification.dto

import com.company.purchaseorder.notification.NotificationType
import java.time.OffsetDateTime
import java.util.UUID

data class NotificationResponse(
    val id: UUID,
    val type: NotificationType,
    val title: String,
    val message: String,
    val isRead: Boolean,
    val createdAt: OffsetDateTime
)