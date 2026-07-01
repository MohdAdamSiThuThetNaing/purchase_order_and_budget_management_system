package com.company.purchaseorder.organization

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationRepository : JpaRepository<Organization, UUID> {

    fun existsByName(name: String): Boolean

    fun existsBySlug(slug: String): Boolean

    fun findByName(name: String): Organization?

    fun findBySlug(slug: String): Organization?
}