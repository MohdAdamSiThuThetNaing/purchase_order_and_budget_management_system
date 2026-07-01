import { apiClient } from "./apiClient";
import type {
  PurchaseOrder,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from "../types/purchaseOrder";

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const { data } = await apiClient.get("/purchase-orders");
  return data;
};

export const getPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const { data } = await apiClient.get(`/purchase-orders/${id}`);
  return data;
};

export const createPurchaseOrder = async (
  request: CreatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const { data } = await apiClient.post("/purchase-orders", request);
  return data;
};

export const updatePurchaseOrder = async (
  id: string,
  request: UpdatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const { data } = await apiClient.put(`/purchase-orders/${id}`, request);
  return data;
};

export const submitPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const { data } = await apiClient.post(`/purchase-orders/${id}/submit`);
  return data;
};

export const cancelPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const { data } = await apiClient.post(`/purchase-orders/${id}/cancel`);
  return data;
};

export const approvePurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const { data } = await apiClient.post(`/purchase-orders/${id}/approve`);
  return data;
};

export const rejectPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const { data } = await apiClient.post(`/purchase-orders/${id}/reject`);
  return data;
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/purchase-orders/${id}`);
};
