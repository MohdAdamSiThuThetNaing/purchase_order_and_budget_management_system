import { useEffect, useState } from "react";
import BudgetTable from "../components/BudgetTable";
import "../layouts/Budget.css";

import { getBudgets, createBudget, deleteBudget } from "../api/budgetApi";
import { getProjects } from "../api/projectApi";

import type { Budget, CreateBudgetRequest } from "../types/budget";
import type { Project } from "../types/project";

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [form, setForm] = useState<CreateBudgetRequest>({
    projectId: "",
    name: "",
    amount: 0,
    description: "",
    active: true,
  });

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to load budgets:", error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);

      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          projectId: data[0].id,
        }));
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadBudgets(), loadProjects()]);
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.projectId) {
      alert("Please select a project.");
      return;
    }

    if (!form.name.trim()) {
      alert("Please enter a budget name.");
      return;
    }

    try {
      console.log("Create Budget:", form);

      await createBudget(form);

      setForm((prev) => ({
        projectId: prev.projectId,
        name: "",
        amount: 0,
        description: "",
        active: true,
      }));

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
          <select
            className="budget-input"
            value={form.projectId}
            onChange={(e) =>
              setForm({
                ...form,
                projectId: e.target.value,
              })
            }
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

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
            placeholder="Description"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({
                  ...form,
                  active: e.target.checked,
                })
              }
            />
            Active
          </label>

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
