import { useEffect, useState, type ReactNode, useContext } from "react";
import { authApi } from "../api/authApi";
import { registerAuthCallbacks, setAccessToken } from "../api/apiClient";
import { refreshTokenStorage } from "../services/tokenStorage";
import type { LoginRequest, UserSummary } from "../types/auth";
import { AuthContext } from "./AuthContextInstance";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerAuthCallbacks({
      onTokenRefreshed: (token: string) => {
        setAccessToken(token);
      },
      onRefreshFailed: () => {
        setUser(null);
        setAccessToken(null);
        refreshTokenStorage.clear();
      },
    });

    const bootstrap = async () => {
      const refreshToken = refreshTokenStorage.get();

      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.refresh(refreshToken);

        setAccessToken(response.accessToken);
        refreshTokenStorage.set(response.refreshToken);
        setUser(response.user);
      } catch {
        refreshTokenStorage.clear();
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  async function login(credentials: LoginRequest) {
    const response = await authApi.login(credentials);

    setAccessToken(response.accessToken);
    refreshTokenStorage.set(response.refreshToken);
    setUser(response.user);
  }

  async function logout() {
    const refreshToken = refreshTokenStorage.get();

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } finally {
      setAccessToken(null);
      refreshTokenStorage.clear();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
