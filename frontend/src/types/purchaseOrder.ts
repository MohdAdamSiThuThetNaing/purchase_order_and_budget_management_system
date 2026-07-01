export type PurchaseOrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  projectId: string;
  vendorId: string;
  approvalWorkflowId?: string | null;
  currentApprovalStep: number;
  poNumber: string;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdBy: string;
  submittedAt?: string | null;
  decidedAt?: string | null;
  version: number;
}

export interface CreatePurchaseOrderRequest {
  projectId: string;
  title: string;
  description?: string;
  amount: number;
  vendor: string;
  orderDate: string;
  status: PurchaseOrderStatus;
}

export interface UpdatePurchaseOrderRequest {
  title: string;
  description?: string;
  amount: number;
  vendor: string;
  orderDate: string;
  status: PurchaseOrderStatus;
}
