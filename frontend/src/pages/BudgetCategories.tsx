import { useEffect, useState } from "react";

import BudgetCategoryTable from "../components/BudgetCategoryTable";

import { getBudgets } from "../api/budgetApi";
import type { Budget } from "../types/budget";

import {
  getBudgetCategories,
  createBudgetCategory,
  deleteBudgetCategory,
} from "../api/budgetCategoryApi";

import type {
  BudgetCategory,
  CreateBudgetCategoryRequest,
} from "../types/budgetCategory";

import "../layouts/BudgetCategory.css";

const BudgetCategories = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateBudgetCategoryRequest>({
    budgetId: "",
    projectId: "",
    name: "",
    description: "",
  });

  const loadCategories = async () => {
    try {
      setError("");

      const data = await getBudgetCategories();
      setCategories(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? "Failed to load budget categories."
      );
    }
  };

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();

      setBudgets(data);

      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          budgetId: data[0].id,
          projectId: data[0].projectId,
        }));
      }
    } catch (error) {
      console.error("Failed to load budgets:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadCategories(), loadBudgets()]);
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.budgetId) {
      alert("Please select a budget.");
      return;
    }

    if (!form.name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    try {
      setError("");

      await createBudgetCategory(form);

      setForm((prev) => ({
        ...prev,
        name: "",
        description: "",
      }));

      await loadCategories();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You do not have permission to create budget categories.");
        setError("You do not have permission to create budget categories.");
      } else {
        const message =
          err.response?.data?.message ?? "Failed to create budget category.";

        alert(message);
        setError(message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudgetCategory(id);

      await loadCategories();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You do not have permission to delete this budget category.");
        setError("You do not have permission to delete this budget category.");
      } else {
        const message =
          err.response?.data?.message ?? "Failed to delete budget category.";

        alert(message);
        setError(message);
      }
    }
  };

  return (
    <div className="budget-category-page">
      <div className="budget-category-header">
        <h1>Budget Categories</h1>
        <p>Manage budget categories.</p>
      </div>

      <div className="budget-category-card">
        <div className="budget-category-toolbar">
          <select
            className="budget-category-input"
            value={form.budgetId}
            onChange={(e) => {
              const budget = budgets.find((b) => b.id === e.target.value);

              setForm((prev) => ({
                ...prev,
                budgetId: e.target.value,
                projectId: budget?.projectId ?? "",
              }));
            }}
          >
            <option value="">Select Budget</option>

            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>

          <input
            className="budget-category-input"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <input
            className="budget-category-input"
            placeholder="Description"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <button className="budget-category-button" onClick={handleCreate}>
            Create Category
          </button>
        </div>
      </div>

      <div className="budget-category-card">
        {error && <div className="budget-category-error">{error}</div>}

        <BudgetCategoryTable categories={categories} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default BudgetCategories;
