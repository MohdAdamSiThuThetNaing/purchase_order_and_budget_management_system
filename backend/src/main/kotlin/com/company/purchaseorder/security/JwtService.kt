package com.company.purchaseorder.security

import com.company.purchaseorder.config.JwtProperties
import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey

@Component
class JwtService(
    private val jwtProperties: JwtProperties
) {

    private val signingKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(jwtProperties.secret.toByteArray())
    }

    fun generateAccessToken(
        userId: UUID,
        organizationId: UUID,
        email: String,
        roles: List<String>
    ): String {

        val now = Instant.now()
        val expiry = now.plusSeconds(jwtProperties.accessTokenTtlMinutes * 60)

        return Jwts.builder()
            .subject(userId.toString())
            .claim("organizationId", organizationId.toString())
            .claim("email", email)
            .claim("roles", roles)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(signingKey)
            .compact()
    }

    fun parseClaims(token: String): Claims =
        Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload

    fun isTokenValid(token: String): Boolean =
        try {
            parseClaims(token)
            true
        } catch (ex: ExpiredJwtException) {
            false
        } catch (ex: JwtException) {
            false
        } catch (ex: IllegalArgumentException) {
            false
        }

    fun extractUserId(token: String): UUID =
        UUID.fromString(parseClaims(token).subject)

    @Suppress("UNCHECKED_CAST")
    fun extractRoles(token: String): List<String> =
        parseClaims(token).get("roles", List::class.java) as? List<String> ?: emptyList()

    fun extractOrganizationId(token: String): UUID =
        UUID.fromString(parseClaims(token).get("organizationId", String::class.java))

    fun extractEmail(token: String): String =
        parseClaims(token).get("email", String::class.java)
}