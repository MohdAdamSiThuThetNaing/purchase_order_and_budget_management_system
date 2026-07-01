import { apiClient } from "./apiClient";

import type { User, CreateUserRequest } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (request: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post("/users", request);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
