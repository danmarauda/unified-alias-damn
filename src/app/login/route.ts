/**
 * Login Route
 *
 * Initiates the OAuth authentication flow with WorkOS AuthKit.
 * Users are redirected to WorkOS for authentication, then return via /callback.
 *
 * Query Parameters:
 * - returnPathname: Optional path to redirect to after successful authentication
 *
 * Screen Hints:
 * - 'sign-in': Show sign-in form (default)
 * - 'sign-up': Show sign-up form
 */

import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract optional return path from query parameters
    const returnPathname = request.nextUrl.searchParams.get("returnPathname");

    // Get the WorkOS sign-in URL
    // Note: returnPathname is stored in session state by WorkOS AuthKit middleware
    const signInUrl = await getSignInUrl();

    // If returnPathname is provided, append it as state parameter
    const url = new URL(signInUrl);
    if (returnPathname) {
      url.searchParams.set("state", returnPathname);
    }

    // Redirect to WorkOS for authentication
    return NextResponse.redirect(url.toString());
  } catch {
    // Fallback to home page on error
    return NextResponse.redirect(new URL("/", request.url));
  }
}
