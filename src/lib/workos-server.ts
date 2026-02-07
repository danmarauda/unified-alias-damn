/**
 * WorkOS Server-Side Authentication Utilities
 *
 * These utilities provide server-side authentication helpers for Next.js 15.
 * They can be used in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * DO NOT use these in Client Components - they only work on the server.
 */

import type { UserInfo } from "@workos-inc/authkit-nextjs";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

type AuthResult = {
  user: UserInfo;
};

type OptionalAuthResult = {
  user: UserInfo | null;
};

/**
 * Require Authentication (Protected Pages)
 *
 * Use this for server components and actions that require authentication.
 * If the user is not authenticated, they will be redirected to /login.
 *
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const { user, session } = await requireAuth();
 *   return <div>Welcome, {user.email}!</div>;
 * }
 *
 * // In a Server Action
 * async function updateProfile() {
 *   "use server";
 *   const { user } = await requireAuth();
 *   // Update profile logic...
 * }
 * ```
 *
 * @returns {Promise<AuthResult>} User and session objects
 * @throws Redirects to /login if not authenticated
 */
export async function requireAuth(): Promise<AuthResult> {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/login");
  }

  return { user: auth };
}

/**
 * Optional Authentication (Public Pages with Auth Features)
 *
 * Use this for pages that work with or without authentication.
 * The user and session will be null if not authenticated.
 *
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function PublicPage() {
 *   const { user } = await getOptionalAuth();
 *
 *   return (
 *     <div>
 *       {user ? `Welcome back, ${user.email}!` : "Welcome, guest!"}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {Promise<OptionalAuthResult>} User and session objects (can be null)
 */
export async function getOptionalAuth(): Promise<OptionalAuthResult> {
  const auth = await withAuth();
  return { user: auth.user ? auth : null };
}
