export interface BudgetCategory {
  id: string;

  organizationId: string;

  projectId: string;

  budgetId: string;

  budgetName: string;

  name: string;

  description?: string;

  active: boolean;
}
export interface CreateBudgetCategoryRequest {
  budgetId: string;
  projectId: string;
  name: string;
  description?: string;
}
