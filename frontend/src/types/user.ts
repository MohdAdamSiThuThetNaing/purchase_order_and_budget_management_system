export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface CreateUserRequest {
  organizationId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
}

export interface UpdateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roleIds: string[];
}
