export interface BudgetLine {
  id: string;
  name: string;
  allocatedAmount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBudgetLineRequest {
  name: string;
  allocatedAmount: number;
  description?: string;
}
