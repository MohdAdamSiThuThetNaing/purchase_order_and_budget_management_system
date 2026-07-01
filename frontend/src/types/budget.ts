export interface Budget {
  id: string;

  organizationId: string;

  projectId: string;

  projectName: string;

  name: string;

  amount: number;

  description?: string;

  active: boolean;
}

export interface CreateBudgetRequest {
  projectId: string;

  name: string;

  amount: number;

  description?: string;

  active: boolean;
}

export interface UpdateBudgetRequest {
  name: string;

  amount: number;

  description?: string;

  active: boolean;
}
