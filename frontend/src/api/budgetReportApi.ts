import axios from "axios";

export interface BudgetReportFilter {
  projectId?: string;
  categoryId?: string;
}

export interface BudgetReportItem {
  projectName: string;
  categoryName: string;
  budget: number;
  spent: number;
  remaining: number;
}

export interface BudgetReport {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
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

  const response = await axios.get(`/budget-reports?${params.toString()}`);

  return response.data;
};
