export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBudgetCategoryRequest {
  name: string;
  description?: string;
}
