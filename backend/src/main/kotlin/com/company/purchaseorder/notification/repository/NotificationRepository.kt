package com.company.purchaseorder.notification.repository

import com.company.purchaseorder.notification.entity.Notification
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface NotificationRepository : JpaRepository<Notification, UUID> {

    fun findByUserIdOrderByCreatedAtDesc(
        userId: UUID,
        pageable: Pageable
    ): Page<Notification>

    fun countByUserIdAndIsReadFalse(userId: UUID): Long
}