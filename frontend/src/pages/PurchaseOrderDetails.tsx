import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPurchaseOrder } from "../api/purchaseOrderApi";
import type { PurchaseOrder } from "../types/purchaseOrder";

import "./PurchaseOrderDetails.css";

const PurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [po, setPo] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPO = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const data = await getPurchaseOrder(id);

      setPo(data);
      setError("");
    } catch {
      setError("Failed to load purchase order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await getPurchaseOrder(id);

        setPo(data);
        setError("");
      } catch {
        setError("Failed to load purchase order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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

        <button onClick={() => navigate("/purchase-orders")}>Back</button>
      </div>

      <div className={`po-status ${po.status ?? "pending"}`}>
        Status: {po.status}
      </div>

      <div className="po-card">
        <h3>Basic Information</h3>

        <p>
          <strong>Vendor ID:</strong> {po.vendorId}
        </p>

        <p>
          <strong>Project ID:</strong> {po.projectId}
        </p>

        <p>
          <strong>Total Amount:</strong> {po.totalAmount}
        </p>

        <p>
          <strong>Created By:</strong> {po.createdBy}
        </p>

        <p>
          <strong>Submitted At:</strong>{" "}
          {po.submittedAt ? new Date(po.submittedAt).toLocaleString() : "-"}
        </p>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
