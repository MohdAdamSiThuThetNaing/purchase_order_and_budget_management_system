import { useEffect, useState } from "react";
import {
  getPurchaseOrders,
  approvePurchaseOrder,
  rejectPurchaseOrder,
} from "../api/purchaseOrderApi";
import { getVendors } from "../api/vendorApi";
import { getProjects } from "../api/projectApi";
import type { PurchaseOrder } from "../types/purchaseOrder";
import type { Vendor } from "../types/vendor";
import type { Project } from "../types/project";
import "../layouts/ApprovalQueue.css";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const ApprovalQueue = () => {
  const [items, setItems] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const vendorName = (vendorId: string) =>
    vendors.find((v) => v.id === vendorId)?.name ?? vendorId;

  const projectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.name ?? projectId;

  const loadQueue = async () => {
    try {
      setLoading(true);
      const [data, vendorData, projectData] = await Promise.all([
        getPurchaseOrders(),
        getVendors(),
        getProjects(),
      ]);
      setItems(data.filter((po) => po.status === "SUBMITTED"));
      setVendors(vendorData);
      setProjects(projectData);
      setError("");
    } catch {
      setError("Failed to load approval queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleApprove = async (po: PurchaseOrder) => {
    try {
      await approvePurchaseOrder(po.id);
      loadQueue();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to approve purchase order.";
      alert(message);
    }
  };

  const handleReject = async (po: PurchaseOrder) => {
    try {
      await rejectPurchaseOrder(po.id);
      loadQueue();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to reject purchase order.";
      alert(message);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={loadQueue}>Retry</button>
      </div>
    );

  return (
    <div className="approval-page">
      <h1>Approval Queue</h1>
      <p>Review submitted purchase orders</p>

      {items.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Project</th>
              <th>Vendor</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((po) => (
              <tr key={po.id}>
                <td>{po.poNumber}</td>
                <td>{projectName(po.projectId)}</td>
                <td>{vendorName(po.vendorId)}</td>
                <td>{po.items?.length ?? 0}</td>
                <td>{formatCurrency(po.totalAmount)}</td>

                <td>
                  <button onClick={() => handleApprove(po)}>Approve</button>
                  <button onClick={() => handleReject(po)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovalQueue;
