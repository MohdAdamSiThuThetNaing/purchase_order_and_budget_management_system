import { useEffect, useState } from "react";

import { getBudgetReport } from "../api/budgetReportApi";
import type { BudgetReport as BudgetReportType } from "../types/budgetReport";
import { getProjects } from "../api/projectApi";
import { getBudgetCategories } from "../api/budgetCategoryApi";
import type { Project } from "../types/project";
import type { BudgetCategory } from "../types/budgetCategory";

import "../layouts/BudgetReport.css";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const BudgetReport = () => {
  const [report, setReport] = useState<BudgetReportType | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);

        const data = await getBudgetReport({
          projectId: projectId || undefined,
          categoryId: categoryId || undefined,
        });

        setReport(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load budget report");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [projectId, categoryId]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [projectData, categoryData] = await Promise.all([
          getProjects(),
          getBudgetCategories(),
        ]);
        setProjects(projectData);
        setCategories(categoryData);

        if (!projectId && projectData.length > 0) {
          setProjectId(projectData[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div className="budget-report-page">
        <div className="budget-report-card budget-report-header">
          <h1>Budget Report</h1>
          <p>Summary of budget lines, committed, and actual spend.</p>
        </div>

        <div className="budget-report-card">
          <p className="error">{error}</p>
        </div>
      </div>
    );

  if (!report) return <div>No data found</div>;

  return (
    <div className="budget-report-page">
      <div className="budget-report-card budget-report-header">
        <div>
          <h1>Budget Report</h1>
          <p>Track budget, committed amounts, and actuals.</p>
        </div>

        <div className="budget-report-filters">
          <select
            value={projectId}
            onChange={(e) => {
              setProjectId(e.target.value);
              setCategoryId("");
            }}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={!projectId && categories.length === 0}
          >
            <option value="">All Categories</option>
            {categories
              .filter((c) => (!projectId ? true : c.projectId === projectId))
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="budget-report-summary">
        <div className="summary-tile">
          <span>Total Budget</span>
          <strong>{formatCurrency(report.totalBudget)}</strong>
        </div>
        <div className="summary-tile">
          <span>Total Committed</span>
          <strong>{formatCurrency(report.totalCommitted)}</strong>
        </div>
        <div className="summary-tile">
          <span>Total Actual</span>
          <strong>{formatCurrency(report.totalActual)}</strong>
        </div>
        <div className="summary-tile">
          <span>Total Remaining</span>
          <strong>{formatCurrency(report.totalRemaining)}</strong>
        </div>
      </div>

      <div className="budget-report-card table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget Line</th>
              <th>Budget</th>
              <th>Committed</th>
              <th>Actual</th>
              <th>Remaining</th>
            </tr>
          </thead>

          <tbody>
            {report?.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.budgetLine}</td>
                <td>{formatCurrency(item.budget)}</td>
                <td>{formatCurrency(item.committed)}</td>
                <td>{formatCurrency(item.actual)}</td>
                <td>{formatCurrency(item.remaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetReport;
