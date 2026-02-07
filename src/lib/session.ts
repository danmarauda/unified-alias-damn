import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  organizationId?: string;
  organizationName?: string;
}

export interface SessionData {
  user: User;
  accessToken: string;
}

const SESSION_COOKIE_NAME = "workos-session";
const USER_COOKIE_NAME = "workos-user";

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const userCookie = cookieStore.get(USER_COOKIE_NAME);

    if (!sessionCookie || !userCookie) {
      return null;
    }

    const user: User = JSON.parse(userCookie.value);

    return {
      user,
      accessToken: sessionCookie.value,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAuthUser(): Promise<User> {
  const session = await requireAuth();
  return session.user;
}

export function isAuthenticated(): Promise<boolean> {
  return getSession().then((session) => !!session);
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  if (!session) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

export function getUserDisplayName(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return user.email;
}

export function getUserInitials(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.firstName) {
    return user.firstName[0].toUpperCase();
  }
  return user.email[0].toUpperCase();
}
