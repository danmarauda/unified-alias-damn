/**
 * OAuth Callback Route
 *
 * This is the OAuth callback endpoint where WorkOS redirects users after authentication.
 * The handleAuth() function automatically:
 * 1. Exchanges the authorization code for access tokens
 * 2. Creates a secure session
 * 3. Sets session cookies
 * 4. Redirects the user to the appropriate page (returnPathname or default)
 */

import { handleAuth } from "@workos-inc/authkit-nextjs";

export const GET = handleAuth();
