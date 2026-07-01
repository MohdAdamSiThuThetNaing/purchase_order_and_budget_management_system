package com.company.purchaseorder.notification.controller

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import com.company.purchaseorder.notification.dto.NotificationResponse
import com.company.purchaseorder.notification.NotificationService
import org.springframework.data.domain.Page
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID



@RestController
@RequestMapping("/notifications")
class NotificationController(

    private val notificationService: NotificationService

) {

    @GetMapping
    fun list(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): Page<NotificationResponse> {

        return notificationService
            .getNotifications(user.id, page, size)
            .map {
                NotificationResponse(
                    id = it.id,
                    type = it.type,
                    title = it.title,
                    message = it.message,
                    isRead = it.isRead,
                    createdAt = it.createdAt
                )
            }
    }

    @PatchMapping("/{id}/read")
    fun markRead(
        @PathVariable id: UUID
    ) {
        notificationService.markAsRead(id)
    }

    @GetMapping("/unread-count")
    fun unreadCount(
        @AuthenticationPrincipal user: AuthenticatedUser
    ): Long {
        return notificationService.unreadCount(user.id)
    }
}