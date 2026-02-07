"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AuthSession, AuthUser } from "./auth-server";

type AuthContextType = {
  user: AuthUser | null;
  sessionId?: string;
  organizationId?: string;
  role?: string;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

type AuthProviderProps = {
  children: ReactNode;
  initialAuth: AuthSession;
};

/**
 * Custom auth provider that receives initial auth state from server
 * This avoids the Server Action issue with AuthKitProvider in Next.js 16
 */
export function CustomAuthProvider({ children, initialAuth }: AuthProviderProps) {
  // Handle case where initialAuth might be undefined (server error)
  const safeAuth = initialAuth || { user: null };

  const value: AuthContextType = {
    user: safeAuth.user,
    sessionId: safeAuth.sessionId,
    organizationId: safeAuth.organizationId,
    role: safeAuth.role,
    loading: false,
    isAuthenticated: !!safeAuth.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth state from the custom context
 */
export function useCustomAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCustomAuth must be used within a CustomAuthProvider");
  }
  return context;
}
