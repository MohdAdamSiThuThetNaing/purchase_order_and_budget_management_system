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
          <th style={headerStyle}>PO Number</th>
          <th style={headerStyle}>Vendor ID</th>
          <th style={headerStyle}>Total Amount</th>
          <th style={headerStyle}>Approval Step</th>
          <th style={headerStyle}>Status</th>
          <th style={headerStyle}>Action</th>
        </tr>
      </thead>

      <tbody>
        {purchaseOrders.map((purchaseOrder) => (
          <tr key={purchaseOrder.id}>
            <td style={cellStyle}>{purchaseOrder.poNumber}</td>

            <td style={cellStyle}>{purchaseOrder.vendorId}</td>

            <td style={cellStyle}>
              {Number(purchaseOrder.totalAmount).toLocaleString()}
            </td>

            <td style={cellStyle}>{purchaseOrder.currentApprovalStep}</td>

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
