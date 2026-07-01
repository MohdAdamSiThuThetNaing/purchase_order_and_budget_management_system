package com.company.purchaseorder.auth.controller

import com.company.purchaseorder.auth.service.AuthService
import com.company.purchaseorder.dto.AuthResponse
import com.company.purchaseorder.dto.LoginRequest
import com.company.purchaseorder.dto.RefreshRequest
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    private val log = LoggerFactory.getLogger(AuthController::class.java)

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {

        log.info("========== LOGIN REQUEST ==========")
        log.info("Email: {}", request.email)
        log.info("Password Length: {}", request.password.length)

        return try {
            val response = authService.login(request)

            log.info("Login SUCCESS for {}", request.email)

            ResponseEntity.ok(response)

        } catch (ex: Exception) {

            log.error("Login FAILED for {}", request.email, ex)

            throw ex
        }
    }

    @PostMapping("/refresh")
    fun refresh(
        @Valid @RequestBody request: RefreshRequest
    ): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.refresh(request.refreshToken))

    @PostMapping("/logout")
    fun logout(
        @Valid @RequestBody request: RefreshRequest
    ): ResponseEntity<Void> {

        authService.logout(request.refreshToken)

        return ResponseEntity.noContent().build()
    }

    @PostMapping("/logout-all")
    fun logoutAll(
        @AuthenticationPrincipal principal: AuthenticatedUser
    ): ResponseEntity<Void> {

        authService.logoutAll(principal.id)

        return ResponseEntity.noContent().build()
    }
}