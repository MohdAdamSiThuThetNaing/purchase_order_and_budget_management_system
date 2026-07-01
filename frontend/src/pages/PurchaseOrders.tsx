import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  getPurchaseOrders,
  deletePurchaseOrder,
  submitPurchaseOrder,
  cancelPurchaseOrder,
} from "../api/purchaseOrderApi";
import { getVendors } from "../api/vendorApi";
import type { PurchaseOrder } from "../types/purchaseOrder";
import type { Vendor } from "../types/vendor";
import "../layouts/PurchaseOrder.css";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const statusClass = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "status-draft";
    case "SUBMITTED":
      return "status-submitted";
    case "APPROVED":
      return "status-approved";
    case "REJECTED":
      return "status-rejected";
    case "CANCELLED":
      return "status-cancelled";
    default:
      return "";
  }
};

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const vendorName = (vendorId: string) =>
    vendors.find((v) => v.id === vendorId)?.name ?? vendorId;

  const load = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const [orderData, vendorData] = await Promise.all([
        getPurchaseOrders(),
        getVendors(),
      ]);

      setOrders(orderData);
      setVendors(vendorData);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to load purchase orders.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this draft purchase order?")) return;

    try {
      await deletePurchaseOrder(id);
      await load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to delete purchase order.";
      alert(message);
    }
  };

  const handleSubmit = async (id: string) => {
    if (!window.confirm("Submit this purchase order for approval?")) return;

    try {
      await submitPurchaseOrder(id);
      await load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to submit purchase order.";
      alert(message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this purchase order?")) return;

    try {
      await cancelPurchaseOrder(id);
      await load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to cancel purchase order.";
      alert(message);
    }
  };

  return (
    <div className="purchase-order-page">
      <div className="purchase-order-header">
        <div>
          <h1>Purchase Orders</h1>
          <p>Create, edit, submit, and view purchase orders</p>
        </div>
        <Link className="purchase-order-button" to="/purchase-orders/new">
          New Purchase Order
        </Link>
      </div>

      {error && <p className="purchase-order-error">{error}</p>}

      <div className="purchase-order-card">
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p className="purchase-order-empty">No purchase orders yet.</p>
        ) : (
          <table className="purchase-order-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Vendor</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/purchase-orders/${order.id}`}>
                      {order.poNumber}
                    </Link>
                  </td>
                  <td>{vendorName(order.vendorId)}</td>
                  <td>
                    <span
                      className={`purchase-order-status ${statusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.items?.length ?? 0}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td className="purchase-order-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/purchase-orders/${order.id}`)}
                    >
                      View
                    </button>
                    {order.status === "DRAFT" && (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() =>
                            navigate(`/purchase-orders/${order.id}/edit`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn-submit"
                          onClick={() => handleSubmit(order.id)}
                        >
                          Submit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {(order.status === "DRAFT" ||
                      order.status === "SUBMITTED") && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancel(order.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;
