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

export interface BudgetReportFilter {
  projectId?: string;
  categoryId?: string;
}
