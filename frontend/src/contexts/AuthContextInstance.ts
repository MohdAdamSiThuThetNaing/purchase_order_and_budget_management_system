import { createContext } from "react";
import type { LoginRequest, UserSummary } from "../types/auth";

export interface AuthContextValue {
  user: UserSummary | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
