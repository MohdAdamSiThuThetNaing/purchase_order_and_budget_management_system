import { useEffect, useState } from "react";
import BudgetTable from "../components/BudgetTable";
import "../layouts/Budget.css";

import { getBudgets, createBudget, deleteBudget } from "../api/budgetApi";

import type { Budget, CreateBudgetRequest } from "../types/budget";

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [form, setForm] = useState<CreateBudgetRequest>({
    name: "",
    amount: 0,
    fiscalYear: new Date().getFullYear(),
  });

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to load budgets:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadBudgets();
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return;

    try {
      await createBudget(form);

      setForm({
        name: "",
        amount: 0,
        fiscalYear: new Date().getFullYear(),
      });

      await loadBudgets();
    } catch (error) {
      console.error("Failed to create budget:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      await loadBudgets();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h1>Budgets</h1>
        <p>Manage organization budgets.</p>
      </div>

      <div className="budget-card">
        <div className="budget-toolbar">
          <input
            className="budget-input"
            placeholder="Budget Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="budget-input"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: Number(e.target.value),
              })
            }
          />

          <input
            className="budget-input"
            type="number"
            placeholder="Fiscal Year"
            value={form.fiscalYear}
            onChange={(e) =>
              setForm({
                ...form,
                fiscalYear: Number(e.target.value),
              })
            }
          />

          <button className="budget-button" onClick={handleCreate}>
            Create Budget
          </button>
        </div>
      </div>

      <div className="budget-card">
        <BudgetTable budgets={budgets} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Budgets;
