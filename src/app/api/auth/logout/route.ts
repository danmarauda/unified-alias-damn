/**
 * Logout Route
 *
 * Initiates the sign-out flow with WorkOS AuthKit.
 * This route:
 * 1. Gets the WorkOS sign-out URL
 * 2. Redirects the user to WorkOS to clear their session
 * 3. WorkOS will redirect back to the app after sign-out is complete
 *
 * The session cookies are cleared during this process.
 */

import { signOut } from "@workos-inc/authkit-nextjs";

export async function GET() {
  // Clear the WorkOS session and redirect (signOut handles the redirect internally)
  await signOut();
}
