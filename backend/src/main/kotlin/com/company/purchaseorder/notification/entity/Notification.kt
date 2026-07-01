package com.company.purchaseorder.notification.entity

import com.company.purchaseorder.auth.entity.User
import com.company.purchaseorder.notification.NotificationType
import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "notifications")
open class Notification(

    @Id
    @Column(nullable = false)
    open var id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    open var user: User,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    open var type: NotificationType,

    @Column(nullable = false, length = 150)
    open var title: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    open var message: String,

    @Column(name = "is_read", nullable = false)
    open var isRead: Boolean = false,

    @Column(name = "created_at", nullable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

) {
    protected constructor() : this(
        user = User(),
        type = NotificationType.PO_SUBMITTED,
        title = "",
        message = ""
    )
}