/**
 * WorkOS AuthKit Proxy (Next.js 16)
 *
 * This proxy handles authentication for the entire application using WorkOS AuthKit.
 * It properly manages the session cookie (wos-session) and provides auth context.
 *
 * Next.js 16 Migration:
 * - middleware.ts → proxy.ts
 * - export default middleware → export function proxy
 * - Runtime changed from 'edge' to 'nodejs'
 *
 * Configuration Strategy:
 * - middlewareAuth.enabled = false: Proxy runs on ALL routes without redirecting
 * - This allows public pages (like /) to still access user info via useAuth hook
 * - Protected pages handle auth requirements individually via withAuth/requireAuth
 *
 * This approach is required when:
 * - You have public pages that display user info (e.g., username in header)
 * - The useAuth hook needs to work on public pages
 * - Server actions on public pages need session context
 */

import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import type { NextFetchEvent, NextRequest } from "next/server";

// Create the WorkOS AuthKit handler
const authkitHandler = authkitMiddleware({
  // IMPORTANT: Set to false so proxy runs on ALL routes
  // This ensures useAuth hook works everywhere (including public pages)
  // Auth requirements are enforced per-page via withAuth({ ensureSignedIn: true })
  middlewareAuth: {
    enabled: false,
    unauthenticatedPaths: [],
  },
  // Enable debug logging during development
  debug: process.env.NODE_ENV === "development",
});

/**
 * Next.js 16 Proxy function
 *
 * Replaces the deprecated middleware pattern.
 * The proxy runs on Node.js runtime (not edge) and handles
 * request interception before pages are rendered.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authkitHandler(request, event);
}

/**
 * Matcher configuration
 *
 * Run proxy on all routes except:
 * - Static files (_next/static/*)
 * - Image optimization (_next/image/*)
 * - Favicon (favicon.ico)
 * - Public folder (public/*)
 */
export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
