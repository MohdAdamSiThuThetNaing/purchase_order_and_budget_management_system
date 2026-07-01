import { apiClient } from "./apiClient";

export interface CreateBudgetCategoryRequest {
  name: string;
  description?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getBudgetCategories = async (): Promise<BudgetCategory[]> => {
  const { data } = await apiClient.get<BudgetCategory[]>("/budget-categories");

  return data;
};

export const createBudgetCategory = async (
  payload: CreateBudgetCategoryRequest
): Promise<BudgetCategory> => {
  const { data } = await apiClient.post<BudgetCategory>(
    "/budget-categories",
    payload
  );

  return data;
};

export const deleteBudgetCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/budget-categories/${id}`);
};
