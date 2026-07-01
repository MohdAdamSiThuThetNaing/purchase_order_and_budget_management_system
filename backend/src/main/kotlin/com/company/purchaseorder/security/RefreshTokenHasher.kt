package com.company.purchaseorder.security

import org.springframework.stereotype.Component
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64


@Component
class RefreshTokenHasher {

    private val secureRandom = SecureRandom()

    fun generateRawToken(): String {
        val bytes = ByteArray(64)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    fun hash(rawToken: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(rawToken.toByteArray(Charsets.UTF_8))
        return Base64.getEncoder().encodeToString(hashBytes)
    }
}
