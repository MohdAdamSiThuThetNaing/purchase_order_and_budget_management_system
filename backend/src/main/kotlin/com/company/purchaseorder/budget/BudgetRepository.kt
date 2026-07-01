import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID
import com.company.purchaseorder.budget.Budget

@Repository
interface BudgetRepository : JpaRepository<Budget, UUID> {

    @EntityGraph(attributePaths = ["organization", "project", "createdBy"])
    fun findAllByOrganization_Id(
        organizationId: UUID
    ): List<Budget>

    @EntityGraph(attributePaths = ["organization", "project", "createdBy"])
    fun findByIdAndOrganization_Id(
        id: UUID,
        organizationId: UUID
    ): Budget?

    fun findAllByProject_Id(
        projectId: UUID
    ): List<Budget>

    fun existsByNameAndProject_Id(
        name: String,
        projectId: UUID
    ): Boolean
}