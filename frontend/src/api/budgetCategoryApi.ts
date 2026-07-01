import { apiClient } from "./apiClient";

import type {
  BudgetCategory,
  CreateBudgetCategoryRequest,
} from "../types/budgetCategory";

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
