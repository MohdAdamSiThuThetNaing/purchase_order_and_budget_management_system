import { apiClient } from "./apiClient";
import type { Role } from "../types/role";

export const getRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get("/roles");
  return response.data;
};
