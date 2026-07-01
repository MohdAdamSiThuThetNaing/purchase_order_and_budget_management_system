package com.company.purchaseorder.notification

import com.company.purchaseorder.auth.entity.User
import com.company.purchaseorder.notification.entity.Notification
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository
) {

    fun create(
        user: User,
        type: NotificationType,
        title: String,
        message: String
    ) {
        notificationRepository.save(
            Notification(
                user = user,
                type = type,
                title = title,
                message = message
            )
        )
    }

    fun getNotifications(
        userId: UUID,
        page: Int,
        size: Int
    ) =
        notificationRepository.findByUserIdOrderByCreatedAtDesc(
            userId,
            PageRequest.of(page, size)
        )

    fun markAsRead(id: UUID) {
        val notification =
            notificationRepository.findById(id)
                .orElseThrow()

        notification.isRead = true

        notificationRepository.save(notification)
    }

    fun unreadCount(userId: UUID): Long =
        notificationRepository.countByUserIdAndIsReadFalse(userId)
}