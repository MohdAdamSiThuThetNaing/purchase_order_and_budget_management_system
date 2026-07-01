import { useEffect, useState } from "react";

import {
  getPurchaseOrders,
  updatePurchaseOrder,
} from "../api/purchaseOrderApi";

import type { PurchaseOrder } from "../types/purchaseOrder";

import "./ApprovalQueue.css";

const ApprovalQueue = () => {
  const [items, setItems] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQueue = async () => {
    try {
      setLoading(true);

      const data = await getPurchaseOrders();

      setItems(data.filter((po) => po.status === "PENDING"));

      setError("");
    } catch {
      setError("Failed to load approval queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const data = await getPurchaseOrders();

        if (mounted) {
          setItems(data.filter((p) => p.status === "PENDING"));
          setError("");
        }
      } catch {
        if (mounted) {
          setError("Failed to load approval queue");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleApprove = async (po: PurchaseOrder) => {
    try {
      await updatePurchaseOrder(po.id, {
        status: "APPROVED",
        title: po.poNumber,
        amount: po.totalAmount,
        vendor: po.vendorId,
        orderDate: po.submittedAt ?? new Date().toISOString(),
      });

      loadQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (po: PurchaseOrder) => {
    try {
      await updatePurchaseOrder(po.id, {
        title: po.poNumber,
        amount: po.totalAmount,
        vendor: po.vendorId,
        orderDate: po.submittedAt ?? new Date().toISOString(),
        status: "REJECTED",
      });

      loadQueue();
    } catch (err) {
      console.error(err);
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

      {items.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Project</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((po) => (
              <tr key={po.id}>
                <td>{po.poNumber}</td>
                <td>{po.projectId}</td>
                <td>{po.vendorId}</td>
                <td>{po.totalAmount}</td>

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
