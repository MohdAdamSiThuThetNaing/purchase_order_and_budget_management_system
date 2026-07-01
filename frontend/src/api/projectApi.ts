import { apiClient } from "./apiClient";

import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/projects");
  return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (
  request: CreateProjectRequest
): Promise<Project> => {
  const response = await apiClient.post("/projects", request);
  return response.data;
};

export const updateProject = async (
  id: string,
  request: UpdateProjectRequest
): Promise<Project> => {
  const response = await apiClient.put(`/projects/${id}`, request);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};
