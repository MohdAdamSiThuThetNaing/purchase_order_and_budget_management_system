import { useEffect, useState } from "react";

import BudgetCategoryTable from "../components/BudgetCategoryTable";

import {
  getBudgetCategories,
  createBudgetCategory,
  deleteBudgetCategory,
} from "../api/budgetCategoryApi";

import type {
  BudgetCategory,
  CreateBudgetCategoryRequest,
} from "../types/budgetCategory";

import "./BudgetCategory.css";

const BudgetCategories = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  const [form, setForm] = useState<CreateBudgetCategoryRequest>({
    name: "",
    description: "",
  });

  const loadCategories = async () => {
    try {
      const data = await getBudgetCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load budget categories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadCategories();
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return;

    try {
      await createBudgetCategory(form);

      setForm({
        name: "",
        description: "",
      });

      await loadCategories();
    } catch (error) {
      console.error("Failed to create budget category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudgetCategory(id);
      await loadCategories();
    } catch (error) {
      console.error("Failed to delete budget category:", error);
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
          <input
            className="budget-category-input"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="budget-category-input"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button className="budget-category-button" onClick={handleCreate}>
            Create Category
          </button>
        </div>
      </div>

      <div className="budget-category-card">
        <BudgetCategoryTable categories={categories} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default BudgetCategories;
