package com.company.purchaseorder.project

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProjectRepository : JpaRepository<Project, UUID> {

    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<Project>

    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): Project?

    fun existsByNameAndOrganization_Id(
        name: String,
        organizationId: UUID
    ): Boolean
}