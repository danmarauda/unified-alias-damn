"use client";

import { useWorkOS } from "./use-work-os";

export function useAuth() {
  const { workosUser, isAuthenticated, isLoading } = useWorkOS();

  /**
   * Sign out the user via WorkOS AuthKit.
   * Redirects to the logout endpoint which clears the session
   * and redirects back to the home page.
   */
  const signOut = async () => {
    // WorkOS AuthKit handles sign-out via the /api/auth/logout endpoint
    // which clears the session cookie and optionally signs out from the IdP
    window.location.href = "/api/auth/logout";
    return Promise.resolve();
  };

  return {
    user: workosUser,
    isAuthenticated,
    isLoading,
    signOut,
  };
}
