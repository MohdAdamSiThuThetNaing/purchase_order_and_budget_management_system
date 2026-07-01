export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
