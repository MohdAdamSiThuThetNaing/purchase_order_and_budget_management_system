import axios from "axios";

export interface CreateBudgetLineRequest {
  name: string;
  allocatedAmount: number;
  description?: string;
}

export interface BudgetLine {
  id: string;
  name: string;
  allocatedAmount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getBudgetLines = async (): Promise<BudgetLine[]> => {
  const response = await axios.get("/budget-lines");
  return response.data;
};

export const createBudgetLine = async (
  payload: CreateBudgetLineRequest
): Promise<BudgetLine> => {
  const response = await axios.post("/budget-lines", payload);
  return response.data;
};

export const deleteBudgetLine = async (id: string): Promise<void> => {
  await axios.delete(`/budget-lines/${id}`);
};
