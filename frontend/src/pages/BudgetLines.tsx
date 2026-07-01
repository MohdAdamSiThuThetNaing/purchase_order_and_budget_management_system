import { useEffect, useState } from "react";

import BudgetLineTable from "../components/BudgetLineTable";

import {
  getBudgetLines,
  createBudgetLine,
  deleteBudgetLine,
} from "../api/budgetLineApi";

import type { BudgetLine, CreateBudgetLineRequest } from "../types/budgetLine";

import "../layouts/BudgetLine.css";

const BudgetLines = () => {
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);

  const [form, setForm] = useState<CreateBudgetLineRequest>({
    projectId: "",
    budgetId: "",
    categoryId: "",
    name: "",
    budgetAmount: 0,
    description: "",
  });

  const loadBudgetLines = async () => {
    try {
      const data = await getBudgetLines();
      setBudgetLines(data);
    } catch (error) {
      console.error("Failed to load budget lines:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadBudgetLines();
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.projectId || !form.budgetId || !form.categoryId)
      return;

    try {
      await createBudgetLine(form);

      setForm({
        projectId: form.projectId,
        budgetId: form.budgetId,
        categoryId: form.categoryId,
        name: "",
        budgetAmount: 0,
        description: "",
      });

      await loadBudgetLines();
    } catch (error) {
      console.error("Failed to create budget line:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudgetLine(id);
      await loadBudgetLines();
    } catch (error) {
      console.error("Failed to delete budget line:", error);
    }
  };

  return (
    <div className="budget-line-page">
      <div className="budget-line-header">
        <h1>Budget Lines</h1>
        <p>Manage budget lines.</p>
      </div>

      <div className="budget-line-card">
        <div className="budget-line-toolbar">
          <input
            className="budget-line-input"
            placeholder="Project ID"
            value={form.projectId}
            onChange={(e) =>
              setForm({
                ...form,
                projectId: e.target.value,
              })
            }
          />

          <input
            className="budget-line-input"
            placeholder="Budget ID"
            value={form.budgetId}
            onChange={(e) =>
              setForm({
                ...form,
                budgetId: e.target.value,
              })
            }
          />

          <input
            className="budget-line-input"
            placeholder="Category ID"
            value={form.categoryId}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: e.target.value,
              })
            }
          />

          <input
            className="budget-line-input"
            placeholder="Budget Line Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="budget-line-input"
            type="number"
            placeholder="Budget Amount"
            value={form.budgetAmount}
            onChange={(e) =>
              setForm({
                ...form,
                budgetAmount: Number(e.target.value),
              })
            }
          />

          <input
            className="budget-line-input"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button className="budget-line-button" onClick={handleCreate}>
            Create Budget Line
          </button>
        </div>
      </div>

      <div className="budget-line-card">
        <BudgetLineTable budgetLines={budgetLines} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default BudgetLines;
