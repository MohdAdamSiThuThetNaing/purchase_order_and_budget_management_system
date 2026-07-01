export type PurchaseOrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface PurchaseOrderItem {
  id: string;
  budgetLineId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  projectId: string;
  vendorId: string;
  poNumber: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdBy: string;
  submittedAt?: string;
  decidedAt?: string;
  version: number;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItemRequest {
  budgetLineId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdatePurchaseOrderItemRequest extends PurchaseOrderItemRequest {
  id?: string;
}

export interface CreatePurchaseOrderRequest {
  projectId: string;
  vendorId: string;
  items: PurchaseOrderItemRequest[];
}

export interface UpdatePurchaseOrderRequest {
  projectId: string;
  vendorId: string;
  items: UpdatePurchaseOrderItemRequest[];
}
