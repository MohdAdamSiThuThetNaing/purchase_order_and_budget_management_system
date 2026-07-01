import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPurchaseOrder,
  getPurchaseOrder,
  updatePurchaseOrder,
} from "../api/purchaseOrderApi";
import { getProjects } from "../api/projectApi";
import { getVendors } from "../api/vendorApi";
import { getBudgetLines } from "../api/budgetLineApi";
import type {
  PurchaseOrderItemRequest,
  UpdatePurchaseOrderItemRequest,
} from "../types/purchaseOrder";
import type { Project } from "../types/project";
import type { Vendor } from "../types/vendor";
import type { BudgetLine } from "../types/budgetLine";
import "../layouts/PurchaseOrder.css";

const emptyItem = (): PurchaseOrderItemRequest => ({
  budgetLineId: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
});

const lineTotal = (item: PurchaseOrderItemRequest) =>
  item.quantity * item.unitPrice;

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [projectId, setProjectId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [items, setItems] = useState<PurchaseOrderItemRequest[]>([emptyItem()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredBudgetLines = budgetLines.filter(
    (line) => !projectId || line.projectId === projectId
  );

  const grandTotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [projectData, vendorData, budgetLineData] = await Promise.all([
          getProjects(),
          getVendors(),
          getBudgetLines(),
        ]);
        setProjects(projectData);
        setVendors(vendorData);
        setBudgetLines(budgetLineData);

        if (!isEdit && projectData.length > 0) {
          setProjectId(projectData[0].id);
        }
        if (!isEdit && vendorData.length > 0) {
          setVendorId(vendorData[0].id);
        }
      } catch {
        setError("Failed to load form options.");
      }
    };

    loadOptions();
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const order = await getPurchaseOrder(id);

        if (order.status !== "DRAFT") {
          navigate(`/purchase-orders/${id}`);
          return;
        }

        setProjectId(order.projectId);
        setVendorId(order.vendorId);
        setItems(
          order.items.map((item) => ({
            budgetLineId: item.budgetLineId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }))
        );
        setError("");
      } catch {
        setError("Failed to load purchase order.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, isEdit, navigate]);

  const updateItem = (
    index: number,
    field: keyof PurchaseOrderItemRequest,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const removeItem = (index: number) => {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const validate = (): string | null => {
    if (!projectId) return "Project is required.";
    if (!vendorId) return "Vendor is required.";
    if (items.length === 0) return "At least one item is required.";

    for (const [index, item] of items.entries()) {
      if (!item.budgetLineId) {
        return `Item ${index + 1}: budget is required.`;
      }
      if (!item.description.trim()) {
        return `Item ${index + 1}: description is required.`;
      }
      if (item.quantity <= 0) {
        return `Item ${index + 1}: quantity must be greater than 0.`;
      }
      if (item.unitPrice < 0) {
        return `Item ${index + 1}: unit price cannot be negative.`;
      }
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEdit && id) {
        const updateItems: UpdatePurchaseOrderItemRequest[] = items.map(
          (item) => ({ ...item })
        );
        await updatePurchaseOrder(id, {
          projectId,
          vendorId,
          items: updateItems,
        });
        navigate(`/purchase-orders/${id}`);
      } else {
        const created = await createPurchaseOrder({
          projectId,
          vendorId,
          items,
        });
        navigate(`/purchase-orders/${created.id}`);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save purchase order.";
      setError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="purchase-order-page">Loading...</div>;
  }

  return (
    <div className="purchase-order-page">
      <div className="purchase-order-header">
        <div>
          <h1>{isEdit ? "Edit Purchase Order" : "New Purchase Order"}</h1>
          <p>
            {isEdit
              ? "Update draft purchase order details and items"
              : "Create a new draft purchase order"}
          </p>
        </div>
        <button
          className="purchase-order-button secondary"
          onClick={() => navigate("/purchase-orders")}
        >
          Back to List
        </button>
      </div>

      {error && <p className="purchase-order-error">{error}</p>}

      <div className="purchase-order-card">
        <h3>Order Details</h3>
        <div className="purchase-order-form-grid">
          <label>
            Project
            <select
              className="purchase-order-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Vendor
            <select
              className="purchase-order-select"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="purchase-order-card">
        <div className="purchase-order-items-header">
          <h3>Items</h3>
          <button className="purchase-order-button" onClick={addItem}>
            Add Item
          </button>
        </div>

        <table className="purchase-order-table items-table">
          <thead>
            <tr>
              <th>Budget</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <select
                    className="purchase-order-select"
                    value={item.budgetLineId}
                    onChange={(e) =>
                      updateItem(index, "budgetLineId", e.target.value)
                    }
                  >
                    <option value="">Select budget line</option>
                    {filteredBudgetLines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.name} (${line.remainingAmount.toFixed(2)} left)
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="purchase-order-input"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="Item description"
                  />
                </td>
                <td>
                  <input
                    className="purchase-order-input narrow"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    className="purchase-order-input narrow"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, "unitPrice", Number(e.target.value))
                    }
                  />
                </td>
                <td>${lineTotal(item).toFixed(2)}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="purchase-order-total">
          <strong>Total Amount:</strong> ${grandTotal.toFixed(2)}
        </div>
      </div>

      <div className="purchase-order-card">
        <div className="purchase-order-form-actions">
          <button
            className="purchase-order-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
