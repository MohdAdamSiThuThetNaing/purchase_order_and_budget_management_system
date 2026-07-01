package com.company.purchaseorder.config

import com.company.purchaseorder.security.JwtAuthenticationFilter
import com.company.purchaseorder.security.JwtService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        jwtService: JwtService
    ): SecurityFilterChain {

        http
            .cors {
                it.configurationSource(corsConfigurationSource())
            }
            .csrf {
                it.disable()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests { auth ->

                auth
                    // Public endpoints
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/actuator/health").permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                    // Roles can be viewed by any authenticated user
                    .requestMatchers(HttpMethod.GET, "/api/roles/**")
                    .authenticated()

                    // User Management - ADMIN only
                    .requestMatchers("/api/users/**")
                    .hasRole("ADMIN")

                    // Everything else requires login
                    .anyRequest()
                    .authenticated()
            }
            .addFilterBefore(
                JwtAuthenticationFilter(jwtService),
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {

        val configuration = CorsConfiguration().apply {

            allowedOriginPatterns = listOf(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://0.0.0.0:*",
                "https://purchase-order-and-budget-managemen.vercel.app"
            )

            allowedMethods = listOf(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            )

            allowedHeaders = listOf("*")

            exposedHeaders = listOf("Authorization")

            allowCredentials = true
        }

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)

        return source
    }
}