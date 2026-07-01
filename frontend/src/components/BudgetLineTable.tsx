import type { BudgetLine } from "../types/budgetLine";

interface Props {
  budgetLines?: BudgetLine[];
  onDelete: (id: string) => void;
}

const BudgetLineTable = ({ budgetLines = [], onDelete }: Props) => {
  const safeLines = Array.isArray(budgetLines) ? budgetLines : [];

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Allocated Amount</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {safeLines.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No budget lines found.
              </td>
            </tr>
          ) : (
            safeLines.map((line) => (
              <tr key={line.id}>
                <td>{line.name}</td>

                <td>
                  {typeof line.allocatedAmount === "number"
                    ? line.allocatedAmount.toLocaleString()
                    : line.allocatedAmount ?? "-"}
                </td>

                <td>{line.description ?? "-"}</td>

                <td>
                  {line.createdAt
                    ? new Date(line.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(line.id)}
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

export default BudgetLineTable;
