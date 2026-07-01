import type { Budget } from "../types/budget";

interface BudgetTableProps {
  budgets: Budget[];
  onDelete: (id: string) => void;
}

const BudgetTable = ({ budgets, onDelete }: BudgetTableProps) => {
  if (budgets.length === 0) {
    return <p>No budgets found.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Amount</th>
          <th style={thStyle}>Fiscal Year</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {budgets.map((budget) => (
          <tr key={budget.id}>
            <td style={tdStyle}>{budget.name}</td>

            <td style={tdStyle}>{budget.amount.toLocaleString()}</td>

            <td style={tdStyle}>{budget.fiscalYear}</td>

            <td style={tdStyle}>
              <button
                style={deleteButtonStyle}
                onClick={() => onDelete(budget.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const thStyle: React.CSSProperties = {
  borderBottom: "2px solid #ddd",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#f5f5f5",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const deleteButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default BudgetTable;
