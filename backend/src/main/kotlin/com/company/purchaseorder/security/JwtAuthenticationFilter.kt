package com.company.purchaseorder.security

import com.company.purchaseorder.auth.controller.AuthenticatedUser
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

class JwtAuthenticationFilter(
    private val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {

        try {
            val header = request.getHeader("Authorization")

            if (header == null || !header.startsWith("Bearer ")) {
                filterChain.doFilter(request, response)
                return
            }

            val token = header.substring(7)

            if (!jwtService.isTokenValid(token)) {
                filterChain.doFilter(request, response)
                return
            }

            val claims = jwtService.parseClaims(token)

            val userId = UUID.fromString(claims.subject)

            val organizationId = UUID.fromString(
                claims.get("organizationId", String::class.java)
            )

            val email = claims.get("email", String::class.java)

            // =========================
            // ✅ SAFE ROLE EXTRACTION
            // =========================
            val rawRoles = claims["roles"]

            val roles: List<String> = when (rawRoles) {
                is List<*> -> rawRoles.map { it.toString() }
                is String -> listOf(rawRoles)
                else -> emptyList()
            }

            println("JWT RAW ROLES = $roles")

            // =========================
            // ✅ SPRING ROLE FORMAT FIX
            // =========================
            val authorities = roles.map {
                SimpleGrantedAuthority(
                    if (it.startsWith("ROLE_")) it else "ROLE_${it.uppercase()}"
                )
            }

            println("AUTHORITIES = $authorities")

            val principal = AuthenticatedUser(
                id = userId,
                organizationId = organizationId,
                email = email,
                roles = roles
            )

            val authentication = UsernamePasswordAuthenticationToken(
                principal,
                null,
                authorities
            )

            SecurityContextHolder.getContext().authentication = authentication

        } catch (ex: Exception) {
            println("JWT FILTER ERROR: ${ex.message}")
            SecurityContextHolder.clearContext()
        }

        filterChain.doFilter(request, response)
    }
}