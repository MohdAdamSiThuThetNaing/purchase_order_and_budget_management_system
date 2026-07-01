import { apiClient } from "./apiClient";

export interface BudgetReportFilter {
  projectId?: string;
  categoryId?: string;
}

export interface BudgetReportItem {
  category: string;
  budgetLine: string;
  budget: number;
  committed: number;
  actual: number;
  remaining: number;
}

export interface BudgetReport {
  totalBudget: number;
  totalCommitted: number;
  totalActual: number;
  totalRemaining: number;
  items: BudgetReportItem[];
}

export const getBudgetReport = async (
  filter?: BudgetReportFilter
): Promise<BudgetReport> => {
  const params = new URLSearchParams();

  if (filter?.projectId) {
    params.append("projectId", filter.projectId);
  }

  if (filter?.categoryId) {
    params.append("categoryId", filter.categoryId);
  }

  const { data } = await apiClient.get<BudgetReport>(
    `/budget-reports?${params.toString()}`
  );

  return data;
};
