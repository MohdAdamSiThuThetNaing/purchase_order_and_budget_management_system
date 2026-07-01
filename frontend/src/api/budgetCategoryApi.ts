import axios from "axios";

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
  const response = await axios.get("/budget-categories");
  return response.data;
};

export const createBudgetCategory = async (
  payload: CreateBudgetCategoryRequest
): Promise<BudgetCategory> => {
  const response = await axios.post("/budget-categories", payload);
  return response.data;
};

export const deleteBudgetCategory = async (id: string): Promise<void> => {
  await axios.delete(`/budget-categories/${id}`);
};
