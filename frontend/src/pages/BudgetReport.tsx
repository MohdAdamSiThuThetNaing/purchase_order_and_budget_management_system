import { useEffect, useState } from "react";

import { getBudgetReport } from "../api/budgetReportApi";
import type { BudgetReport as BudgetReportType } from "../types/budgetReport";

import "../layouts/BudgetReport.css";

const BudgetReport = () => {
  const [report, setReport] = useState<BudgetReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);

        const data = await getBudgetReport();

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
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );

  if (!report) return <div>No data found</div>;

  return (
    <div className="budget-report-page">
      <h1>Budget Report</h1>

      <div className="summary">
        <p>Total Budget: {report.totalBudget}</p>
        <p>Total Spent: {report.totalSpent}</p>
        <p>Remaining: {report.remaining}</p>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Remaining</th>
            </tr>
          </thead>

          <tbody>
            {report?.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.projectName}</td>
                <td>{item.categoryName}</td>
                <td>{item.budget}</td>
                <td>{item.spent}</td>
                <td>{item.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetReport;
