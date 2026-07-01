import { useEffect, useState } from "react";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  deletePurchaseOrder,
} from "../api/purchaseOrderApi";

import type {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "../types/purchaseOrder";

import PurchaseOrderTable from "../components/PurchaseOrderTable";

import "./PurchaseOrder.css";

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [status, setStatus] = useState<PurchaseOrderStatus>("PENDING");

  const loadPurchaseOrders = async () => {
    try {
      const data = await getPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadPurchaseOrders();
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!projectId || !title || !amount || !vendor || !orderDate) {
      return;
    }

    try {
      await createPurchaseOrder({
        projectId,
        title,
        description,
        amount: Number(amount),
        vendor,
        orderDate,
        status,
      });

      setProjectId("");
      setTitle("");
      setDescription("");
      setAmount("");
      setVendor("");
      setOrderDate("");
      setStatus("PENDING");

      await loadPurchaseOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePurchaseOrder(id);
      await loadPurchaseOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="purchase-order-page">
      <div className="purchase-order-header">
        <h1>Purchase Orders</h1>
        <p>Manage purchase orders for your organization.</p>
      </div>

      <div className="purchase-order-card">
        <div className="purchase-order-toolbar">
          <input
            className="purchase-order-input"
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />

          <input
            className="purchase-order-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="purchase-order-textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="purchase-order-input"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="purchase-order-input"
            placeholder="Vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />

          <input
            className="purchase-order-input"
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />

          <select
            className="purchase-order-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as PurchaseOrderStatus)}
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <button className="purchase-order-button" onClick={handleCreate}>
            Create Purchase Order
          </button>
        </div>
      </div>

      <div className="purchase-order-card">
        <PurchaseOrderTable
          purchaseOrders={purchaseOrders}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PurchaseOrders;
