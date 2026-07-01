package com.company.purchaseorder.notification.service

import com.company.purchaseorder.auth.entity.User
import com.company.purchaseorder.notification.NotificationType
import com.company.purchaseorder.notification.entity.Notification
import com.company.purchaseorder.notification.repository.NotificationRepository
import org.springframework.data.domain.PageRequest
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val messagingTemplate: SimpMessagingTemplate
) {

    fun create(
        user: User,
        type: NotificationType,
        title: String,
        message: String
    ) {

        val notification = notificationRepository.save(
            Notification(
                user = user,
                type = type,
                title = title,
                message = message
            )
        )

        messagingTemplate.convertAndSendToUser(
            user.id.toString(),
            "/queue/notifications",
            NotificationSocketResponse(
                id = notification.id,
                title = notification.title,
                message = notification.message,
                type = notification.type,
                isRead = notification.isRead,
                createdAt = notification.createdAt
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