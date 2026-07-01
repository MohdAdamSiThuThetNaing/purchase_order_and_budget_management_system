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
            <th>Budget Amount</th>
            <th>Remaining</th>
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
                  {typeof line.budgetAmount === "number"
                    ? line.budgetAmount.toLocaleString()
                    : "-"}
                </td>

                <td>
                  {typeof line.remainingAmount === "number"
                    ? line.remainingAmount.toLocaleString()
                    : "-"}
                </td>

                <td>{line.description ?? "-"}</td>

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
