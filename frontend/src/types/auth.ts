export interface UserSummary {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: UserSummary;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string | null;
}
