export interface BudgetLine {
  id: string;
  organizationId: string;
  projectId: string;
  budgetId: string;
  categoryId: string;
  name: string;
  description?: string;
  budgetAmount: number;
  committedAmount: number;
  actualAmount: number;
  remainingAmount: number;
}

export interface CreateBudgetLineRequest {
  projectId: string;
  budgetId: string;
  categoryId: string;
  name: string;
  description?: string;
  budgetAmount: number;
}
