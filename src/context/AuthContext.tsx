"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { User, LoginCredentials } from "@/types/auth";
import authService from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from cookies / localStorage on client mount
  useEffect(() => {
    try {
      const storedToken = Cookies.get("auth_token");
      const storedUserRaw = Cookies.get("auth_user") || localStorage.getItem("auth_user");

      if (storedToken && storedUserRaw) {
        const parsedUser = JSON.parse(storedUserRaw) as User;
        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch {
      // Clear corrupt tokens
      Cookies.remove("auth_token");
      Cookies.remove("auth_user");
      localStorage.removeItem("auth_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const userData = await authService.login(credentials);
    const accessToken = userData.accessToken;

    // Save token and user in cookies for middleware and localStorage for context resilience
    Cookies.set("auth_token", accessToken, { expires: 7, path: "/" });
    Cookies.set("auth_user", JSON.stringify(userData), { expires: 7, path: "/" });
    localStorage.setItem("auth_user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("auth_token", { path: "/" });
    Cookies.remove("auth_user", { path: "/" });
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
