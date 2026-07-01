import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPurchaseOrder,
  submitPurchaseOrder,
  cancelPurchaseOrder,
} from "../api/purchaseOrderApi";
import { getProjects } from "../api/projectApi";
import { getVendors } from "../api/vendorApi";
import { getBudgetLines } from "../api/budgetLineApi";
import type { PurchaseOrder } from "../types/purchaseOrder";
import type { Project } from "../types/project";
import type { Vendor } from "../types/vendor";
import type { BudgetLine } from "../types/budgetLine";
import "../layouts/PurchaseOrderDetails.css";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const statusClass = (status: string) => status.toLowerCase();

const PurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [po, setPo] = useState<PurchaseOrder | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const projectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.name ?? projectId;

  const vendorName = (vendorId: string) =>
    vendors.find((v) => v.id === vendorId)?.name ?? vendorId;

  const budgetLineName = (budgetLineId: string) =>
    budgetLines.find((b) => b.id === budgetLineId)?.name ?? budgetLineId;

  const loadPO = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [order, projectData, vendorData, budgetLineData] =
        await Promise.all([
          getPurchaseOrder(id),
          getProjects(),
          getVendors(),
          getBudgetLines(),
        ]);
      setPo(order);
      setProjects(projectData);
      setVendors(vendorData);
      setBudgetLines(budgetLineData);
      setError("");
    } catch {
      setError("Failed to load purchase order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPO();
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !window.confirm("Submit this purchase order for approval?"))
      return;

    try {
      const updated = await submitPurchaseOrder(id);
      setPo(updated);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to submit purchase order.";
      alert(message);
    }
  };

  const handleCancel = async () => {
    if (!id || !window.confirm("Cancel this purchase order?")) return;

    try {
      const updated = await cancelPurchaseOrder(id);
      setPo(updated);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to cancel purchase order.";
      alert(message);
    }
  };

  if (loading) {
    return <div className="po-details-page">Loading...</div>;
  }

  if (error) {
    return (
      <div className="po-details-page">
        <p className="error">{error}</p>
        <button onClick={loadPO}>Retry</button>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="po-details-page">
        <p>Purchase order not found.</p>
      </div>
    );
  }

  return (
    <div className="po-details-page">
      <div className="po-header">
        <div>
          <h1>Purchase Order Details</h1>
          <p>PO Number: {po.poNumber}</p>
        </div>

        <div className="po-header-actions">
          {po.status === "DRAFT" && (
            <>
              <button
                className="btn-edit"
                onClick={() => navigate(`/purchase-orders/${po.id}/edit`)}
              >
                Edit
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Submit
              </button>
            </>
          )}
          {(po.status === "DRAFT" || po.status === "SUBMITTED") && (
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button onClick={() => navigate("/purchase-orders")}>Back</button>
        </div>
      </div>

      <div className={`po-status ${statusClass(po.status)}`}>
        Status: {po.status}
      </div>

      <div className="po-card">
        <h3>Basic Information</h3>
        <div className="po-info-grid">
          <p>
            <strong>Vendor:</strong> {vendorName(po.vendorId)}
          </p>
          <p>
            <strong>Project:</strong> {projectName(po.projectId)}
          </p>
          <p>
            <strong>Total Amount:</strong> {formatCurrency(po.totalAmount)}
          </p>
          <p>
            <strong>Submitted At:</strong>{" "}
            {po.submittedAt
              ? new Date(po.submittedAt).toLocaleString()
              : "-"}
          </p>
          {po.decidedAt && (
            <p>
              <strong>Decided At:</strong>{" "}
              {new Date(po.decidedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="po-card">
        <h3>Items</h3>
        {po.items.length === 0 ? (
          <p>No items on this purchase order.</p>
        ) : (
          <table className="po-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Budget</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{budgetLineName(item.budgetLineId)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
