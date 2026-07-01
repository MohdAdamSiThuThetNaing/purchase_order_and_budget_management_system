import { useEffect, useState } from "react";

import BudgetLineTable from "../components/BudgetLineTable";

import {
  getBudgetLines,
  createBudgetLine,
  deleteBudgetLine,
} from "../api/budgetLineApi";

import type { BudgetLine, CreateBudgetLineRequest } from "../types/budgetLine";
import type { Project } from "../types/project";
import type { Budget } from "../types/budget";
import type { BudgetCategory } from "../types/budgetCategory";

import { getProjects } from "../api/projectApi";
import { getBudgets } from "../api/budgetApi";
import { getBudgetCategories } from "../api/budgetCategoryApi";

import "../layouts/BudgetLine.css";

const BudgetLines = () => {
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const loadLookups = async () => {
    try {
      setError("");
      const [projectData, budgetData, categoryData] = await Promise.all([
        getProjects(),
        getBudgets(),
        getBudgetCategories(),
      ]);

      setProjects(projectData);
      setBudgets(budgetData);
      setCategories(categoryData);

      // pick sensible defaults
      if (projectData.length > 0 && !form.projectId) {
        const projectId = projectData[0].id;
        const firstBudget = budgetData.find((b) => b.projectId === projectId);
        const budgetId = firstBudget?.id ?? "";
        const firstCategory = categoryData.find((c) => c.budgetId === budgetId);
        const categoryId = firstCategory?.id ?? "";

        setForm((prev) => ({
          ...prev,
          projectId,
          budgetId,
          categoryId,
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to load dropdown data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([loadBudgetLines(), loadLookups()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!form.projectId) return alert("Please select a project.");
    if (!form.budgetId) return alert("Please select a budget.");
    if (!form.categoryId) return alert("Please select a category.");
    if (!form.name.trim()) return alert("Please enter a budget line name.");

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

  const filteredBudgets = budgets.filter(
    (budget) => !form.projectId || budget.projectId === form.projectId
  );

  const filteredCategories = categories.filter(
    (category) =>
      (!form.projectId || category.projectId === form.projectId) &&
      (!form.budgetId || category.budgetId === form.budgetId)
  );

  return (
    <div className="budget-line-page">
      <div className="budget-line-header">
        <h1>Budget Lines</h1>
        <p>Manage budget lines.</p>
      </div>

      <div className="budget-line-card">
        <div className="budget-line-toolbar">
          <select
            className="budget-line-input"
            value={form.projectId}
            onChange={(e) => {
              const projectId = e.target.value;
              const nextBudget = budgets.find((b) => b.projectId === projectId);
              const budgetId = nextBudget?.id ?? "";
              const nextCategory = categories.find((c) => c.budgetId === budgetId);
              const categoryId = nextCategory?.id ?? "";

              setForm((prev) => ({
                ...prev,
                projectId,
                budgetId,
                categoryId,
              }));
            }}
            disabled={loading}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            className="budget-line-input"
            value={form.budgetId}
            onChange={(e) => {
              const budgetId = e.target.value;
              const budget = budgets.find((b) => b.id === budgetId);
              const projectId = budget?.projectId ?? form.projectId;
              const nextCategory = categories.find((c) => c.budgetId === budgetId);

              setForm((prev) => ({
                ...prev,
                projectId,
                budgetId,
                categoryId: nextCategory?.id ?? "",
              }));
            }}
            disabled={loading || !form.projectId}
          >
            <option value="">Select Budget</option>
            {filteredBudgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>

          <select
            className="budget-line-input"
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            disabled={loading || !form.budgetId}
          >
            <option value="">Select Category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

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
        {error && (
          <div style={{ marginBottom: 12, color: "#dc2626" }}>{error}</div>
        )}
        <BudgetLineTable budgetLines={budgetLines} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default BudgetLines;
