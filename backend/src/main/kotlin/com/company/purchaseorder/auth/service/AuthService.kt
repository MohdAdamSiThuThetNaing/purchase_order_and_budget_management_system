package com.company.purchaseorder.auth.service

import com.company.purchaseorder.auth.entity.User
import com.company.purchaseorder.auth.repository.UserRepository
import com.company.purchaseorder.dto.AuthResponse
import com.company.purchaseorder.dto.LoginRequest
import com.company.purchaseorder.dto.UserSummary
import com.company.purchaseorder.entity.RefreshToken
import com.company.purchaseorder.repository.RefreshTokenRepository
import com.company.purchaseorder.security.JwtService
import com.company.purchaseorder.security.RefreshTokenHasher
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.OffsetDateTime
import java.util.Base64
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder,
    private val refreshTokenHasher: RefreshTokenHasher
) {

    private val secureRandom = SecureRandom()

    fun login(request: LoginRequest): AuthResponse {

        val user = userRepository
            .findByEmailIgnoreCaseAndIsActiveTrue(request.email)
            ?: throw BadCredentialsException("Invalid email or password")

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw BadCredentialsException("Invalid email or password")
        }

        // Load roles from User entity
        val roles = user.roles
            .map { it.name }
            .toList()

        val accessToken = jwtService.generateAccessToken(
            user.id,
            user.organizationId,
            user.email,
            roles
        )

        val refreshToken = generateRefreshToken()

        refreshTokenRepository.save(
            RefreshToken(
                userId = user.id,
                tokenHash = refreshTokenHasher.hash(refreshToken),
                expiresAt = OffsetDateTime.now().plusDays(30)
            )
        )

        return buildResponse(
            user,
            accessToken,
            refreshToken,
            roles
        )
    }

    fun refresh(refreshToken: String): AuthResponse {

        val tokenHash = refreshTokenHasher.hash(refreshToken)

        val storedToken = refreshTokenRepository
            .findByTokenHash(tokenHash)
            .orElseThrow {
                BadCredentialsException("Invalid refresh token")
            }

        if (!storedToken.isActive()) {
            throw BadCredentialsException("Refresh token expired")
        }

        val user = userRepository
            .findById(storedToken.userId)
            .orElseThrow {
                BadCredentialsException("User not found")
            }

        val roles = user.roles
            .map { it.name }
            .toList()

        val accessToken = jwtService.generateAccessToken(
            user.id,
            user.organizationId,
            user.email,
            roles
        )

        return buildResponse(
            user,
            accessToken,
            refreshToken,
            roles
        )
    }

    fun logout(refreshToken: String) {

        val hash = refreshTokenHasher.hash(refreshToken)

        refreshTokenRepository
            .findByTokenHash(hash)
            .ifPresent {
                refreshTokenRepository.delete(it)
            }
    }

    fun logoutAll(userId: UUID) {
        refreshTokenRepository.deleteAllByUserId(userId)
    }

    private fun buildResponse(
        user: User,
        accessToken: String,
        refreshToken: String,
        roles: List<String>
    ): AuthResponse {

        return AuthResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            expiresInSeconds = 15 * 60,
            user = UserSummary(
                id = user.id,
                organizationId = user.organizationId,
                email = user.email,
                firstName = user.firstName,
                lastName = user.lastName,
                roles = roles
            )
        )
    }

    private fun generateRefreshToken(): String {
        val bytes = ByteArray(64)
        secureRandom.nextBytes(bytes)

        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(bytes)
    }
}