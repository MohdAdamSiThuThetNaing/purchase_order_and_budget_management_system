import { apiClient } from "./apiClient";

import type {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "../types/budget";

export const getBudgets = async (): Promise<Budget[]> => {
  const { data } = await apiClient.get<Budget[]>("/budgets");
  return data;
};

export const getBudget = async (id: string): Promise<Budget> => {
  const { data } = await apiClient.get<Budget>(`/budgets/${id}`);
  return data;
};

export const createBudget = async (
  request: CreateBudgetRequest
): Promise<Budget> => {
  const { data } = await apiClient.post<Budget>("/budgets", request);
  return data;
};

export const updateBudget = async (
  id: string,
  request: UpdateBudgetRequest
): Promise<Budget> => {
  const { data } = await apiClient.put<Budget>(`/budgets/${id}`, request);
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await apiClient.delete(`/budgets/${id}`);
};
