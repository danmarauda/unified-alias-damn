/**
 * Server-side auth utilities that read session directly from cookies
 * This bypasses the withAuth Server Action issue in Next.js 16
 */

import { cookies } from "next/headers";
import { unsealData } from "iron-session";

// Read cookie name as constant (fallback to default)
const WORKOS_COOKIE_NAME = process.env.WORKOS_COOKIE_NAME || "wos-session";

// Helper function to get password at runtime (in case env vars are loaded late)
function getCookiePassword(): string {
  return process.env.WORKOS_COOKIE_PASSWORD || "";
}

export type AuthUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
  emailVerified: boolean;
  organizationId?: string;
  role?: string;
};

export type AuthSession = {
  user: AuthUser | null;
  sessionId?: string;
  organizationId?: string;
  role?: string;
  accessToken?: string;
};

// WorkOS session structure
interface WorkOSSession {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePictureUrl?: string | null;
    emailVerified?: boolean;
    object?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  impersonator?: unknown;
}

/**
 * Get the current user from the session cookie (server-side only)
 * This can be called from Server Components without requiring middleware headers
 */
export async function getServerAuth(): Promise<AuthSession> {
  try {
    const password = getCookiePassword();
    if (!password) {
      console.error("[auth-server] WORKOS_COOKIE_PASSWORD not configured");
      return { user: null };
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(WORKOS_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return { user: null };
    }

    // Use iron-session's unsealData - same as WorkOS uses internally
    const session = await unsealData<WorkOSSession>(sessionCookie.value, {
      password,
    });

    if (!session?.user) {
      return { user: null };
    }

    // Map WorkOS user to our AuthUser type
    const user: AuthUser = {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName ?? null,
      lastName: session.user.lastName ?? null,
      profilePictureUrl: session.user.profilePictureUrl ?? null,
      emailVerified: session.user.emailVerified ?? false,
    };

    return {
      user,
      accessToken: session.accessToken,
    };
  } catch (error) {
    console.error("[auth-server] Error reading session:", error);
    return { user: null };
  }
}
