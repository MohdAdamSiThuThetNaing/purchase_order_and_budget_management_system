import type { PurchaseOrder } from "../types/purchaseOrder";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  onDelete: (id: string) => void;
}

const PurchaseOrderTable = ({
  purchaseOrders,
  onDelete,
}: PurchaseOrderTableProps) => {
  if (purchaseOrders.length === 0) {
    return <p>No purchase orders found.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 20,
      }}
    >
      <thead>
        <tr>
          <th style={headerStyle}>Title</th>
          <th style={headerStyle}>Vendor</th>
          <th style={headerStyle}>Amount</th>
          <th style={headerStyle}>Order Date</th>
          <th style={headerStyle}>Status</th>
          <th style={headerStyle}>Action</th>
        </tr>
      </thead>

      <tbody>
        {purchaseOrders.map((purchaseOrder) => (
          <tr key={purchaseOrder.id}>
            <td style={cellStyle}>{purchaseOrder.title}</td>

            <td style={cellStyle}>{purchaseOrder.vendor}</td>

            <td style={cellStyle}>{purchaseOrder.amount.toLocaleString()}</td>

            <td style={cellStyle}>{purchaseOrder.orderDate}</td>

            <td style={cellStyle}>{purchaseOrder.status}</td>

            <td style={cellStyle}>
              <button
                onClick={() => onDelete(purchaseOrder.id)}
                style={deleteButtonStyle}
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

const headerStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f5f5f5",
  textAlign: "left",
};

const cellStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default PurchaseOrderTable;
