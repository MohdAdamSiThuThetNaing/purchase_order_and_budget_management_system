import { apiClient } from "./apiClient";
import type { PurchaseOrder } from "../types/purchaseOrder";

export type PurchaseOrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

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

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const { data } = await apiClient.get<PurchaseOrder[]>("/purchase-orders");
  return data;
};

export const getPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const { data } = await apiClient.get<PurchaseOrder>(`/purchase-orders/${id}`);
  return data;
};

export const createPurchaseOrder = async (
  request: CreatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const { data } = await apiClient.post<PurchaseOrder>(
    "/purchase-orders",
    request
  );

  return data;
};

export const updatePurchaseOrder = async (
  id: string,
  request: UpdatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const { data } = await apiClient.put<PurchaseOrder>(
    `/purchase-orders/${id}`,
    request
  );

  return data;
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/purchase-orders/${id}`);
};
