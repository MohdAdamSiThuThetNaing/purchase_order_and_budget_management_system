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

export interface BudgetReportFilter {
  projectId?: string;
  categoryId?: string;
}
