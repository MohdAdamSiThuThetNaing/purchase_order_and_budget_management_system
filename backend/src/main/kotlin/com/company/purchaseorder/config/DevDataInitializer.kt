package com.company.purchaseorder.config

import com.company.purchaseorder.auth.entity.User
import com.company.purchaseorder.auth.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.UUID

@Configuration
@Profile("dev")
class DevDataInitializer {

    @Bean
    fun seedUsers(
        userRepository: UserRepository,
        passwordEncoder: PasswordEncoder
    ) = CommandLineRunner {

        if (userRepository.existsByEmailIgnoreCase("admin@acme.test")) {
            return@CommandLineRunner
        }

        val adminUser = User(
            organizationId = UUID.randomUUID(), 
            email = "admin@acme.test",
            passwordHash = passwordEncoder.encode("Password123!"),
            firstName = "Ada",
            lastName = "Admin",
            isActive = true
        )

        userRepository.save(adminUser)
    }
}