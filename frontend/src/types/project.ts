export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  active: boolean;
}
