package com.company.purchaseorder.auth.controller

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID
import com.company.purchaseorder.auth.repository.CreateUserRequest
import com.company.purchaseorder.auth.repository.UpdateUserRequest
import com.company.purchaseorder.auth.repository.UserResponse
import com.company.purchaseorder.auth.service.UserService

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping
    fun getUsers(): List<UserResponse> {
        return userService.getUsers()
    }

    @GetMapping("/{id}")
    fun getUser(
        @PathVariable id: UUID
    ): UserResponse {
        return userService.getUser(id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createUser(
        @Valid
        @RequestBody request: CreateUserRequest
    ): UserResponse {
        return userService.createUser(request)
    }

    @PutMapping("/{id}")
    fun updateUser(
        @PathVariable id: UUID,
        @Valid
        @RequestBody request: UpdateUserRequest
    ): UserResponse {
        return userService.updateUser(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteUser(
        @PathVariable id: UUID
    ) {
        userService.deleteUser(id)
    }
}