import { apiClient } from "./apiClient";

import type {
  Organization,
  CreateOrganizationRequest,
} from "../types/organization";

export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get("/organizations");
  return response.data;
};

export const getOrganization = async (id: string): Promise<Organization> => {
  const response = await apiClient.get(`/organizations/${id}`);
  return response.data;
};

export const createOrganization = async (
  request: CreateOrganizationRequest
): Promise<Organization> => {
  const response = await apiClient.post("/organizations", request);
  return response.data;
};

export const deleteOrganization = async (id: string): Promise<void> => {
  await apiClient.delete(`/organizations/${id}`);
};
