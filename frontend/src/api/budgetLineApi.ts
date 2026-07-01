import { apiClient } from "./apiClient";
import type {
  BudgetLine,
  CreateBudgetLineRequest,
} from "../types/budgetLine";

export const getBudgetLines = async (): Promise<BudgetLine[]> => {
  const { data } = await apiClient.get("/budget-lines");
  return data;
};

export const createBudgetLine = async (
  payload: CreateBudgetLineRequest
): Promise<BudgetLine> => {
  const { data } = await apiClient.post("/budget-lines", payload);
  return data;
};

export const deleteBudgetLine = async (id: string): Promise<void> => {
  await apiClient.delete(`/budget-lines/${id}`);
};
