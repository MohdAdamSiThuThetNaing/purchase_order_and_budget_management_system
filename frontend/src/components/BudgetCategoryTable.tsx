import type { BudgetCategory } from "../types/budgetCategory";

interface Props {
  categories?: BudgetCategory[];
  onDelete: (id: string) => void;
}

const BudgetCategoryTable = ({ categories, onDelete }: Props) => {
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {safeCategories.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No budget categories found.
              </td>
            </tr>
          ) : (
            safeCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description || "-"}</td>
                <td>
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetCategoryTable;
