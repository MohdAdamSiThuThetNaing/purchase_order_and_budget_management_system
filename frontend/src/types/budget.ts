export interface Budget {
  id: string;

  name: string;

  amount: number;

  fiscalYear: number;

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateBudgetRequest {
  name: string;

  amount: number;

  fiscalYear: number;
}

export interface UpdateBudgetRequest {
  name: string;

  amount: number;

  fiscalYear: number;
}
