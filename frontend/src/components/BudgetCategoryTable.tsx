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
            <th>Budget</th>
            <th>Category</th>
            <th>Description</th>
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
                <td>{category.budgetName}</td>
                <td>{category.name}</td>
                <td>{category.description || "-"}</td>
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
