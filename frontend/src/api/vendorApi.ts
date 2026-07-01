import { apiClient } from "./apiClient";
import type { Vendor } from "../types/vendor";

export const getVendors = async (): Promise<Vendor[]> => {
  const { data } = await apiClient.get("/vendors");
  return data;
};

export const getVendor = async (id: string): Promise<Vendor> => {
  const { data } = await apiClient.get(`/vendors/${id}`);
  return data;
};
