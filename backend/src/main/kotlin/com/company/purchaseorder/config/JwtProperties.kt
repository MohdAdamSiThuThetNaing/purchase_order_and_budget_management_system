package com.company.purchaseorder.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Bind from application.yml:
 *
 * app:
 *   jwt:
 *     secret: ${JWT_SECRET}
 *     access-token-ttl-minutes: 15
 *     refresh-token-ttl-days: 30
 */
@ConfigurationProperties(prefix = "app.jwt")
data class JwtProperties(
    var secret: String = "",
    var accessTokenTtlMinutes: Long = 15,
    var refreshTokenTtlDays: Long = 30
)
