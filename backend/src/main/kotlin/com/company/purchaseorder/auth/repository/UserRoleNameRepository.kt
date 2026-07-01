package com.company.purchaseorder.auth.repository

import com.company.purchaseorder.auth.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface UserRoleNameRepository : JpaRepository<User, UUID> {

    @Query(
        value = """
            SELECT r.name
            FROM roles r
            INNER JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = :userId
        """,
        nativeQuery = true
    )
    fun findRoleNamesByUserId(@Param("userId") userId: UUID): List<String>
}