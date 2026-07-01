package com.company.purchaseorder.auth.controller

import com.company.purchaseorder.auth.repository.RoleRepository
import com.company.purchaseorder.auth.repository.RoleResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/roles")
class RoleController(
    private val roleRepository: RoleRepository
) {

    @GetMapping
    fun getRoles(): List<RoleResponse> {
        return roleRepository.findAll().map { role ->
            RoleResponse(
                id = role.id,
                name = role.name
            )
        }
    }
}