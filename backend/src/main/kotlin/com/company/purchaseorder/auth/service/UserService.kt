package com.company.purchaseorder.auth.service

import com.company.purchaseorder.auth.entity.User
import com.company.purchaseorder.auth.repository.RoleRepository
import com.company.purchaseorder.auth.repository.UserRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import com.company.purchaseorder.auth.repository.CreateUserRequest
import com.company.purchaseorder.auth.repository.UpdateUserRequest
import com.company.purchaseorder.auth.repository.UserResponse
import com.company.purchaseorder.auth.repository.RoleResponse
import java.util.UUID

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional(readOnly = true)
    fun getUsers(): List<UserResponse> {
        return userRepository.findAll()
            .map { it.toResponse() }
    }

    @Transactional(readOnly = true)
    fun getUser(id: UUID): UserResponse {
        return userRepository.findById(id)
            .orElseThrow { EntityNotFoundException("User not found.") }
            .toResponse()
    }

    fun createUser(request: CreateUserRequest): UserResponse {

        if (userRepository.existsByEmailIgnoreCase(request.email)) {
            throw IllegalArgumentException("Email already exists.")
        }

        val roles = roleRepository.findAllById(request.roleIds).toMutableSet()

        val user = User(
            organizationId = request.organizationId,
            email = request.email.trim().lowercase(),
            passwordHash = passwordEncoder.encode(request.password),
            firstName = request.firstName,
            lastName = request.lastName,
            isActive = true,
            roles = roles
        )

        return userRepository.save(user).toResponse()
    }

    fun updateUser(
        id: UUID,
        request: UpdateUserRequest
    ): UserResponse {

        val user = userRepository.findById(id)
            .orElseThrow { EntityNotFoundException("User not found.") }

        user.firstName = request.firstName
        user.lastName = request.lastName
        user.email = request.email.trim().lowercase()
        user.isActive = request.isActive

        if (request.password.isNotBlank()) {
            user.passwordHash = passwordEncoder.encode(request.password)
        }

        user.roles.clear()
        user.roles.addAll(
            roleRepository.findAllById(request.roleIds)
        )

        return userRepository.save(user).toResponse()
    }

    fun deleteUser(id: UUID) {

        val user = userRepository.findById(id)
            .orElseThrow { EntityNotFoundException("User not found.") }

        userRepository.delete(user)
    }

    private fun User.toResponse(): UserResponse {
        return UserResponse(
            id = id,
            organizationId = organizationId,
            email = email,
            firstName = firstName,
            lastName = lastName,
            isActive = isActive,
            createdAt = createdAt,
            updatedAt = updatedAt,
            roles = roles.map {
                RoleResponse(
                    id = it.id,
                    name = it.name
                )
            }
        )
    }
}