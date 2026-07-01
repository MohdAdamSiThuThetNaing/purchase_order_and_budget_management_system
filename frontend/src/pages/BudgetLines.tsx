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
    name: "",
    allocatedAmount: 0,
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
    if (!form.name.trim()) return;

    try {
      await createBudgetLine(form);

      setForm({
        name: "",
        allocatedAmount: 0,
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
            placeholder="Allocated Amount"
            value={form.allocatedAmount}
            onChange={(e) =>
              setForm({
                ...form,
                allocatedAmount: Number(e.target.value),
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
