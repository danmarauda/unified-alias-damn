# WorkOS + Convex Architecture

## Executive Summary

ALIAS MOSAIC uses **WorkOS AuthKit** for enterprise-grade authentication with **Convex** as the real-time backend database. This architecture provides:

- OAuth 2.0 authentication with WorkOS managed identity
- Encrypted session management with secure cookies
- Real-time data synchronization via Convex
- Type-safe API with full TypeScript support
- Automatic user profile syncing between WorkOS and Convex

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  BROWSER (Client)                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────┐         ┌─────────────────────────────────────┐             │
│  │  Login Page      │         │   Header with User Profile           │             │
│  │  (/login)        │         │   - useWorkOS() hook                 │             │
│  │                  │         │   - Avatar, name, sign out button    │             │
│  │  [Button: Sign   │◄───────►│   - Conditional rendering            │             │
│  │   In with        │         └─────────────────────────────────────┘             │
│  │   WorkOS]        │                                                               │
│  └────────┬─────────┘                                                               │
│           │                                                                          │
│           │ Click redirects to /api/auth/login                                      │
│           │                                                                          │
│  ┌────────▼──────────────────────────────────────────────────────────────────────┐ │
│  │                  WorkOS AuthKit Client Hook                                    │ │
│  │                  (@workos-inc/authkit-nextjs)                                  │ │
│  │                                                                                 │ │
│  │  useAuth() - Returns: { user, isLoading }                                     │ │
│  │  - Automatically reads session cookies                                         │ │
│  │  - Provides user data if authenticated                                         │ │
│  │  - null if not authenticated                                                   │ │
│  └────────────────────────────────────┬───────────────────────────────────────────┘ │
│                                       │                                              │
│  ┌────────────────────────────────────▼───────────────────────────────────────────┐ │
│  │                  Custom Hook: useWorkOS()                                      │ │
│  │                  (@/lib/hooks/useWorkOS.ts)                                    │ │
│  │                                                                                 │ │
│  │  Combines WorkOS auth + Convex user data:                                     │ │
│  │  - workosUser: User from WorkOS (auth state)                                  │ │
│  │  - convexUser: User from Convex database                                      │ │
│  │  - Auto-syncs workosUser → Convex on first login                              │ │
│  │  - isAuthenticated: true if both exist                                         │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │ HTTPS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS SERVER (15.x + App Router)                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                    API Route: GET /api/auth/login                             │ │
│  │                    (src/app/login/route.ts)                                   │ │
│  │                                                                                │ │
│  │  1. Call getAuthorizationUrl({ screenHint: 'sign-in' })                      │ │
│  │  2. Returns WorkOS hosted auth page URL                                       │ │
│  │  3. Redirects user to WorkOS                                                  │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                       │                                             │
│                                       │ Redirect to WorkOS                          │
│                                       ▼                                             │
└───────────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            WORKOS AUTHKIT (Hosted)                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                      WorkOS Hosted Login Page                                 │ │
│  │                                                                                │ │
│  │  - Email/password form                                                         │ │
│  │  - OAuth providers (Google, GitHub, Microsoft, etc.)                          │ │
│  │  - SSO connectors for enterprises                                             │ │
│  │  - MFA support                                                                 │ │
│  │  - Fully customizable branding                                                 │ │
│  │                                                                                │ │
│  │  User enters credentials → WorkOS validates → Creates session                 │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                       │                                             │
│                                       │ Redirect with auth code                     │
│                                       ▼                                             │
└───────────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS SERVER (Callback Handler)                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │               API Route: GET /callback                                        │ │
│  │               (src/app/callback/route.ts)                                     │ │
│  │                                                                                │ │
│  │  export const GET = handleAuth();                                             │ │
│  │                                                                                │ │
│  │  WorkOS handleAuth() automatically:                                           │ │
│  │  1. Exchanges authorization code for access token                             │ │
│  │  2. Validates token with WorkOS API                                           │ │
│  │  3. Retrieves user profile from WorkOS                                        │ │
│  │  4. Creates encrypted session                                                 │ │
│  │  5. Sets secure HTTP-only cookies:                                            │ │
│  │     - wos-session (encrypted with WORKOS_COOKIE_PASSWORD)                    │ │
│  │     - httpOnly, secure, sameSite: lax                                         │ │
│  │  6. Redirects to returnPathname or /                                          │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │            Server-Side Auth Utilities (workos-server.ts)                      │ │
│  │                                                                                │ │
│  │  requireAuth() - For protected server components/actions                      │ │
│  │    - Calls withAuth() from WorkOS                                             │ │
│  │    - Returns { user, session } or redirects to /login                         │ │
│  │                                                                                │ │
│  │  getOptionalAuth() - For public pages with auth features                      │ │
│  │    - Returns { user, session } or { null, null }                              │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │               API Route: GET /api/auth/logout                                 │ │
│  │               (src/app/api/auth/logout/route.ts)                              │ │
│  │                                                                                │ │
│  │  1. Call getSignOutUrl()                                                      │ │
│  │  2. Redirects to WorkOS sign-out endpoint                                     │ │
│  │  3. WorkOS clears session and redirects back                                  │ │
│  │  4. Session cookies are removed                                               │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │ WebSocket / HTTPS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              CONVEX BACKEND                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                      User Sync Functions (convex/users.ts)                    │ │
│  │                                                                                │ │
│  │  Mutations:                                                                    │ │
│  │  - syncFromWorkOS(workosUserId, email, ...) → Creates/updates user           │ │
│  │  - updateProfile(userId, firstName, ...) → Updates user profile              │ │
│  │                                                                                │ │
│  │  Queries:                                                                      │ │
│  │  - getByWorkOSId(workosUserId) → Returns Convex user or null                 │ │
│  │  - getById(userId) → Returns user by Convex ID                                │ │
│  │  - getByEmail(email) → Returns user by email                                  │ │
│  └────────────────────────────┬─────────────────────────────────────────────────┘ │
│                                │                                                    │
│  ┌─────────────────────────────▼──────────────────────────────────────────────┐  │
│  │                    Convex Database Schema                                    │  │
│  │                                                                               │  │
│  │  users: defineTable({                                                         │  │
│  │    workosUserId: string,          // Primary WorkOS identifier               │  │
│  │    email: string,                  // User email                             │  │
│  │    firstName?: string,             // First name                             │  │
│  │    lastName?: string,              // Last name                              │  │
│  │    profilePictureUrl?: string,     // Avatar URL                            │  │
│  │    emailVerified: boolean,         // Email verification status             │  │
│  │    createdAt: number,              // Unix timestamp                         │  │
│  │    updatedAt: number               // Unix timestamp                         │  │
│  │  })                                                                           │  │
│  │    .index("by_workos_id", ["workosUserId"])  // Fast lookup                 │  │
│  │    .index("by_email", ["email"])              // Email search                │  │
│  │                                                                               │  │
│  │  + Application tables: stats, projects, agentMetrics, etc.                  │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  Real-time WebSocket Connection:                                                    │
│  - Client subscribes to user queries                                                │
│  - Convex pushes updates automatically                                              │
│  - No polling or manual refresh needed                                              │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Authentication Flow

### 1. OAuth 2.0 Authorization Code Flow

```
Step 1: Initiate Login
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Click "Sign In with WorkOS"
     ▼
┌─────────────────┐
│  Login Page     │
│  (/login)       │
└────┬────────────┘
     │ 2. <Link href="/api/auth/login">
     ▼
┌─────────────────────────┐
│  GET /api/auth/login    │
│  (route handler)        │
└────┬────────────────────┘
     │ 3. getAuthorizationUrl({ screenHint: 'sign-in' })
     │ 4. Returns: https://auth.workos.com/authorize?
     │            client_id=...&
     │            redirect_uri=http://localhost:3000/callback&
     │            response_type=code&
     │            state=...
     ▼
┌─────────────────────────┐
│  Redirect to WorkOS     │
│  Hosted Auth Page       │
└────┬────────────────────┘
     │
     ▼

Step 2: User Authentication at WorkOS
┌─────────────────────────────────────┐
│  WorkOS Hosted Login Page           │
│  (auth.workos.com)                  │
├─────────────────────────────────────┤
│                                     │
│  Email: [user@example.com]         │
│  Password: [**********]             │
│                                     │
│  [Sign In Button]                   │
│                                     │
│  OR                                 │
│                                     │
│  [Continue with Google]             │
│  [Continue with GitHub]             │
│  [Continue with Microsoft]          │
│                                     │
└────┬────────────────────────────────┘
     │ 5. User enters credentials
     │ 6. WorkOS validates credentials
     │ 7. WorkOS creates session
     │ 8. WorkOS generates authorization code
     ▼
┌─────────────────────────────────────┐
│  Redirect to Callback with Code     │
│  http://localhost:3000/callback?    │
│    code=wos_auth_123...&            │
│    state=...                        │
└────┬────────────────────────────────┘
     │
     ▼

Step 3: Token Exchange & Session Creation
┌─────────────────────────────────────┐
│  GET /callback                      │
│  (handleAuth() automatic)           │
└────┬────────────────────────────────┘
     │ 9. Extract authorization code from URL
     ▼
┌─────────────────────────────────────┐
│  POST https://api.workos.com/       │
│    sso/token                        │
│                                     │
│  Body:                              │
│    grant_type: authorization_code   │
│    code: wos_auth_123...            │
│    client_id: ...                   │
│    client_secret: WORKOS_API_KEY    │
└────┬────────────────────────────────┘
     │ 10. WorkOS validates code
     │ 11. Returns access token & user data
     ▼
┌─────────────────────────────────────┐
│  Response:                          │
│  {                                  │
│    access_token: "...",             │
│    user: {                          │
│      id: "user_123...",             │
│      email: "user@example.com",     │
│      firstName: "John",             │
│      lastName: "Doe",               │
│      emailVerified: true,           │
│      profilePictureUrl: "..."       │
│    }                                │
│  }                                  │
└────┬────────────────────────────────┘
     │ 12. Create encrypted session
     │     (using WORKOS_COOKIE_PASSWORD)
     ▼
┌─────────────────────────────────────┐
│  Set Cookies:                       │
│                                     │
│  wos-session=encrypted_data...      │
│    - httpOnly: true                 │
│    - secure: true (production)      │
│    - sameSite: lax                  │
│    - path: /                        │
│    - maxAge: 7 days (default)       │
└────┬────────────────────────────────┘
     │ 13. Redirect to /
     ▼
┌─────────────────────────────────────┐
│  User lands on Dashboard            │
│  - Cookies sent automatically       │
│  - useAuth() reads session          │
│  - User data available              │
└─────────────────────────────────────┘
```

### 2. Session Validation Flow (Every Request)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Every Page Load / Request                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Client Component (e.g., Header.tsx):                               │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  const { user, isLoading } = useAuth();                │        │
│  │  // WorkOS client hook                                  │        │
│  └────────────────────────────┬───────────────────────────┘        │
│                                │                                     │
│                                ▼                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  WorkOS Client checks cookies:                            │   │
│  │  - Reads wos-session cookie                               │   │
│  │  - Parses encrypted session data                          │   │
│  │  - Validates signature                                     │   │
│  │  - Checks expiration                                       │   │
│  └────────────────┬───────────────────────────────────────────┘   │
│                   │                                                 │
│                   ▼                                                 │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  If session valid:                                         │   │
│  │    { user: {...}, isLoading: false }                       │   │
│  │                                                             │   │
│  │  If session expired/invalid:                               │   │
│  │    { user: null, isLoading: false }                        │   │
│  │                                                             │   │
│  │  While checking:                                            │   │
│  │    { user: null, isLoading: true }                         │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Server Components/Actions (e.g., protected page):                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  const { user } = await requireAuth();                 │        │
│  │  // Redirects to /login if not authenticated            │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 3. User Profile Sync Flow (WorkOS → Convex)

```
┌─────────────────────────────────────────────────────────────────────┐
│              Automatic User Sync on First Login                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Component mounts with useWorkOS() hook:                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  1. useAuth() → Returns WorkOS user                    │        │
│  │     { id, email, firstName, ... }                      │        │
│  └────────────────┬───────────────────────────────────────┘        │
│                   │                                                 │
│                   ▼                                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  2. useQuery(api.users.getByWorkOSId, { workosUserId })│        │
│  │     → Checks if user exists in Convex                  │        │
│  └────────────────┬───────────────────────────────────────┘        │
│                   │                                                 │
│                   ▼                                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  3a. If user EXISTS in Convex:                         │        │
│  │      - Returns existing user data                       │        │
│  │      - Sync complete                                    │        │
│  │                                                         │        │
│  │  3b. If user DOES NOT exist:                           │        │
│  │      - useEffect triggers                               │        │
│  │      - Calls syncFromWorkOS mutation                    │        │
│  └────────────────┬───────────────────────────────────────┘        │
│                   │                                                 │
│                   ▼ (if 3b)                                         │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  4. useMutation(api.users.syncFromWorkOS)              │        │
│  │     {                                                   │        │
│  │       workosUserId: "user_123...",                     │        │
│  │       email: "user@example.com",                       │        │
│  │       firstName: "John",                               │        │
│  │       lastName: "Doe",                                 │        │
│  │       profilePictureUrl: "https://...",                │        │
│  │       emailVerified: true                              │        │
│  │     }                                                   │        │
│  └────────────────┬───────────────────────────────────────┘        │
│                   │                                                 │
│                   ▼                                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  5. Convex mutation executes:                          │        │
│  │     - Checks if user exists by workosUserId            │        │
│  │     - If exists: Updates with latest data              │        │
│  │     - If not: Inserts new user record                  │        │
│  │     - Returns userId                                    │        │
│  └────────────────┬───────────────────────────────────────┘        │
│                   │                                                 │
│                   ▼                                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  6. useQuery automatically re-runs:                    │        │
│  │     - Detects new user in database                     │        │
│  │     - Returns complete Convex user                     │        │
│  │     - Component renders with full data                 │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Result:                                                             │
│  {                                                                   │
│    workosUser: { id, email, ... },     // From WorkOS               │
│    convexUser: { _id, workosUserId, ... }, // From Convex           │
│    isAuthenticated: true,                                            │
│    isLoading: false                                                  │
│  }                                                                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 4. Sign Out Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Click "Sign Out"
     ▼
┌─────────────────────────┐
│  Header.tsx             │
│  onClick={signOut}      │
└────┬────────────────────┘
     │ 2. <Link href="/api/auth/logout">
     ▼
┌─────────────────────────────┐
│  GET /api/auth/logout       │
│  (route handler)            │
└────┬────────────────────────┘
     │ 3. getSignOutUrl()
     │ 4. Returns: https://auth.workos.com/signout?
     │            client_id=...&
     │            redirect_uri=http://localhost:3000
     ▼
┌─────────────────────────────┐
│  Redirect to WorkOS         │
│  Sign Out Endpoint          │
└────┬────────────────────────┘
     │ 5. WorkOS clears session
     │ 6. Removes cookies
     ▼
┌─────────────────────────────┐
│  Redirect back to /         │
│  - No session cookies        │
│  - useAuth() returns null    │
│  - User sees logged-out UI   │
└─────────────────────────────┘
```

## Security Architecture

### 1. Session Security

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SESSION SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Layer 1: Cookie Security                                            │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  wos-session cookie attributes:                        │        │
│  │                                                         │        │
│  │  - httpOnly: true                                      │        │
│  │    → Prevents JavaScript access (XSS protection)       │        │
│  │                                                         │        │
│  │  - secure: true (production)                           │        │
│  │    → Only sent over HTTPS                              │        │
│  │                                                         │        │
│  │  - sameSite: "lax"                                     │        │
│  │    → CSRF protection                                    │        │
│  │    → Sent on same-site requests                         │        │
│  │    → Sent on top-level navigation (GET)                 │        │
│  │    → Not sent on cross-site POST/PUT/DELETE            │        │
│  │                                                         │        │
│  │  - path: "/"                                           │        │
│  │    → Available app-wide                                 │        │
│  │                                                         │        │
│  │  - maxAge: 604800 (7 days default)                    │        │
│  │    → Automatic expiration                               │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Layer 2: Encryption                                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  WORKOS_COOKIE_PASSWORD (32+ character secret)        │        │
│  │                                                         │        │
│  │  - Session data encrypted with AES-256-GCM             │        │
│  │  - Includes HMAC for integrity verification            │        │
│  │  - Tampering detection                                  │        │
│  │  - Cannot be read without secret key                    │        │
│  │                                                         │        │
│  │  Cookie contents (encrypted):                          │        │
│  │  {                                                      │        │
│  │    user: { id, email, ... },                           │        │
│  │    expiresAt: timestamp,                               │        │
│  │    signature: hmac_digest                              │        │
│  │  }                                                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Layer 3: Token Validation                                           │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Every request validates:                              │        │
│  │                                                         │        │
│  │  1. Cookie signature (HMAC)                            │        │
│  │     → Prevents tampering                                │        │
│  │                                                         │        │
│  │  2. Expiration timestamp                                │        │
│  │     → Auto-logout after 7 days                          │        │
│  │                                                         │        │
│  │  3. User ID exists in WorkOS                           │        │
│  │     → Validates against source of truth                 │        │
│  │                                                         │        │
│  │  4. Optional: Check if user still active               │        │
│  │     → Can query Convex for user status                 │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Layer 4: HTTPS Transport                                            │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  All traffic encrypted in transit:                     │        │
│  │  - TLS 1.3 (latest protocol)                           │        │
│  │  - End-to-end encryption                                │        │
│  │  - Certificate validation                               │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 2. Environment Variable Security

```
┌─────────────────────────────────────────────────────────────────────┐
│                  REQUIRED ENVIRONMENT VARIABLES                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Server-Only (Never exposed to client):                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  WORKOS_API_KEY (starts with 'sk_')                    │        │
│  │  - Secret API key for WorkOS API calls                 │        │
│  │  - Never sent to browser                                │        │
│  │  - Used in server-side route handlers                   │        │
│  │                                                         │        │
│  │  WORKOS_COOKIE_PASSWORD (32+ characters)               │        │
│  │  - Encryption key for session cookies                   │        │
│  │  - Generate: openssl rand -base64 32                    │        │
│  │  - CRITICAL: Never commit to git                        │        │
│  │  - Rotate periodically in production                    │        │
│  │                                                         │        │
│  │  CONVEX_DEPLOYMENT (deployment name)                   │        │
│  │  - Used for server-side Convex operations              │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Public (Safe to expose):                                            │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  WORKOS_CLIENT_ID (starts with 'client_')             │        │
│  │  - Public identifier for OAuth flows                    │        │
│  │  - Safe to expose in browser                            │        │
│  │  - Used in authorization URLs                           │        │
│  │                                                         │        │
│  │  NEXT_PUBLIC_CONVEX_URL                                │        │
│  │  - Public Convex deployment URL                         │        │
│  │  - Used by client for WebSocket connection             │        │
│  │                                                         │        │
│  │  NEXT_PUBLIC_WORKOS_REDIRECT_URI                       │        │
│  │  - OAuth callback URL                                   │        │
│  │  - Must match WorkOS dashboard configuration           │        │
│  │                                                         │        │
│  │  NEXT_PUBLIC_APP_URL                                   │        │
│  │  - Base URL for the application                         │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 3. OAuth Security Measures

```
┌─────────────────────────────────────────────────────────────────────┐
│                     OAUTH 2.0 SECURITY FEATURES                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Authorization Code Flow (Most Secure)                            │
│     ✓ Code exchanged server-side                                     │
│     ✓ Client secret never exposed                                    │
│     ✓ Token obtained via backend                                     │
│                                                                      │
│  2. State Parameter (CSRF Protection)                                │
│     ✓ Random state generated per request                             │
│     ✓ Validated on callback                                          │
│     ✓ Prevents cross-site request forgery                            │
│                                                                      │
│  3. PKCE (Proof Key for Code Exchange)                               │
│     ✓ Code verifier + challenge                                      │
│     ✓ Prevents authorization code interception                       │
│     ✓ Additional security layer                                      │
│                                                                      │
│  4. Redirect URI Validation                                          │
│     ✓ Must match exactly in WorkOS dashboard                         │
│     ✓ Prevents redirect attacks                                      │
│     ✓ Whitelist-based approach                                       │
│                                                                      │
│  5. Short-Lived Authorization Codes                                  │
│     ✓ Code expires in seconds                                        │
│     ✓ Single-use only                                                │
│     ✓ Cannot be reused                                               │
│                                                                      │
│  6. HTTPS Only                                                       │
│     ✓ All OAuth flows over TLS                                       │
│     ✓ Prevents man-in-the-middle attacks                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Client-Side Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                   CLIENT COMPONENT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Authentication Layer:                                               │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  useWorkOS() Hook (src/lib/hooks/useWorkOS.ts)        │        │
│  │                                                         │        │
│  │  Returns:                                               │        │
│  │  {                                                      │        │
│  │    workosUser: {                                       │        │
│  │      id: string,                                       │        │
│  │      email: string,                                    │        │
│  │      firstName?: string,                               │        │
│  │      lastName?: string,                                │        │
│  │      profilePictureUrl?: string,                       │        │
│  │      emailVerified: boolean                            │        │
│  │    },                                                   │        │
│  │    convexUser: {                                       │        │
│  │      _id: Id<"users">,                                 │        │
│  │      workosUserId: string,                             │        │
│  │      // ... rest of user fields                         │        │
│  │    },                                                   │        │
│  │    isLoading: boolean,                                 │        │
│  │    isAuthenticated: boolean                            │        │
│  │  }                                                      │        │
│  │                                                         │        │
│  │  Features:                                              │        │
│  │  - Combines WorkOS + Convex user data                  │        │
│  │  - Auto-syncs on first login                           │        │
│  │  - Real-time updates via Convex                        │        │
│  │  - Type-safe with TypeScript                           │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Usage Example:                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  "use client";                                         │        │
│  │                                                         │        │
│  │  function Header() {                                   │        │
│  │    const { workosUser, convexUser, isLoading,         │        │
│  │            isAuthenticated } = useWorkOS();            │        │
│  │                                                         │        │
│  │    if (isLoading) return <LoadingSpinner />;          │        │
│  │                                                         │        │
│  │    if (!isAuthenticated) {                             │        │
│  │      return <Link href="/login">Sign In</Link>;       │        │
│  │    }                                                    │        │
│  │                                                         │        │
│  │    return (                                             │        │
│  │      <div>                                              │        │
│  │        <img src={workosUser.profilePictureUrl} />     │        │
│  │        <span>{workosUser.firstName}</span>            │        │
│  │        <Link href="/api/auth/logout">Sign Out</Link> │        │
│  │      </div>                                             │        │
│  │    );                                                   │        │
│  │  }                                                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Server-Side Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                  SERVER COMPONENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Protected Page Pattern:                                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  import { requireAuth } from '@/lib/workos-server';    │        │
│  │                                                         │        │
│  │  export default async function ProfilePage() {         │        │
│  │    const { user, session } = await requireAuth();     │        │
│  │    // Automatically redirects to /login if not auth   │        │
│  │                                                         │        │
│  │    return (                                             │        │
│  │      <div>                                              │        │
│  │        <h1>Welcome, {user.firstName}!</h1>            │        │
│  │        <p>Email: {user.email}</p>                     │        │
│  │      </div>                                             │        │
│  │    );                                                   │        │
│  │  }                                                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Optional Auth Pattern (Public Page):                               │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  import { getOptionalAuth } from '@/lib/workos-server';│        │
│  │                                                         │        │
│  │  export default async function HomePage() {            │        │
│  │    const { user } = await getOptionalAuth();          │        │
│  │                                                         │        │
│  │    return (                                             │        │
│  │      <div>                                              │        │
│  │        {user ? (                                       │        │
│  │          <h1>Welcome back, {user.firstName}!</h1>     │        │
│  │        ) : (                                            │        │
│  │          <h1>Welcome, guest!</h1>                     │        │
│  │        )}                                               │        │
│  │      </div>                                             │        │
│  │    );                                                   │        │
│  │  }                                                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Server Action Pattern:                                              │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  'use server';                                         │        │
│  │                                                         │        │
│  │  import { requireAuth } from '@/lib/workos-server';    │        │
│  │  import { api } from '@/convex/_generated/api';        │        │
│  │                                                         │        │
│  │  export async function updateProfile(formData) {       │        │
│  │    const { user } = await requireAuth();              │        │
│  │                                                         │        │
│  │    // Call Convex mutation                             │        │
│  │    await convex.mutation(api.users.updateProfile, {   │        │
│  │      userId: user.id,                                  │        │
│  │      ...formData                                        │        │
│  │    });                                                  │        │
│  │  }                                                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Provider Hierarchy

```
app/layout.tsx
│
├─ <html>
│  └─ <body>
│     │
│     ├─ ConvexClientProvider
│     │  │ Purpose: Provides Convex real-time database context
│     │  │ Features: useQuery, useMutation hooks
│     │  │ Connection: WebSocket to Convex backend
│     │  │
│     │  └─ ThemeProvider (next-themes)
│     │     │ Purpose: Dark/light mode management
│     │     │ Features: useTheme hook, persistent preference
│     │     │
│     │     └─ Application Components
│     │        │ Access to: useAuth(), useWorkOS(), useQuery, useMutation
│     │        │ WorkOS auth: Automatic via cookies
│     │        │ Convex data: Real-time subscriptions
│     │        │
│     │        ├─ Header (auth-aware)
│     │        ├─ Main Content
│     │        └─ Footer
│
└─ No WorkOS Provider needed!
   (WorkOS works via cookies + server-side validation)
```

## Data Synchronization Architecture

### WorkOS ↔ Convex Sync Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│              WORKOS-CONVEX DATA SYNCHRONIZATION                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  WorkOS (Source of Truth for Auth):                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  - User authentication                                  │        │
│  │  - Session management                                   │        │
│  │  - Email verification                                   │        │
│  │  - OAuth connections                                    │        │
│  │  - MFA status                                           │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Convex (Source of Truth for Application Data):                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  - User profiles (synced from WorkOS)                  │        │
│  │  - Application data (projects, agents, stats)          │        │
│  │  - User preferences and settings                        │        │
│  │  - Relationships and associations                       │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Sync Triggers:                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  1. First Login (New User):                            │        │
│  │     - useWorkOS() detects workosUser exists            │        │
│  │     - convexUser is null                                │        │
│  │     - Triggers syncFromWorkOS mutation                  │        │
│  │     - Creates user record in Convex                     │        │
│  │                                                         │        │
│  │  2. Subsequent Logins (Existing User):                 │        │
│  │     - useWorkOS() finds existing convexUser            │        │
│  │     - Optionally updates with latest WorkOS data       │        │
│  │     - Quick lookup via by_workos_id index              │        │
│  │                                                         │        │
│  │  3. Profile Updates:                                    │        │
│  │     - User updates profile in app                       │        │
│  │     - Convex mutation updates convexUser               │        │
│  │     - WorkOS data remains unchanged                     │        │
│  │     - Two-way sync not required                         │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Data Flow:                                                          │
│  ┌────────────────────────────────────────────────────────┐        │
│  │                                                         │        │
│  │  WorkOS User              Convex User                   │        │
│  │  ┌────────────┐           ┌────────────┐              │        │
│  │  │ id         │──────────>│workosUserId│              │        │
│  │  │ email      │──────────>│email       │              │        │
│  │  │ firstName  │──────────>│firstName   │              │        │
│  │  │ lastName   │──────────>│lastName    │              │        │
│  │  │ profile... │──────────>│profile...  │              │        │
│  │  │ emailVer...│──────────>│emailVer... │              │        │
│  │  └────────────┘           └────────────┘              │        │
│  │                                  │                      │        │
│  │                                  ├─> _id (Convex ID)   │        │
│  │                                  ├─> createdAt         │        │
│  │                                  └─> updatedAt         │        │
│  │                                                         │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Real-Time Updates

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONVEX REAL-TIME FEATURES                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Automatic Subscriptions:                                            │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  const user = useQuery(api.users.getByWorkOSId, {     │        │
│  │    workosUserId: workosUser.id                         │        │
│  │  });                                                    │        │
│  │                                                         │        │
│  │  - Establishes WebSocket connection                    │        │
│  │  - Subscribes to query results                         │        │
│  │  - Automatically re-runs on data changes               │        │
│  │  - React re-renders with new data                      │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Change Detection:                                                   │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  When data changes in Convex:                          │        │
│  │  1. Mutation executes (e.g., updateProfile)            │        │
│  │  2. Database record updated                             │        │
│  │  3. Convex detects affected queries                    │        │
│  │  4. Pushes update to subscribed clients                │        │
│  │  5. React components re-render instantly               │        │
│  │                                                         │        │
│  │  Benefits:                                              │        │
│  │  - No polling required                                  │        │
│  │  - No manual cache invalidation                        │        │
│  │  - Multi-tab synchronization                           │        │
│  │  - Collaborative features out-of-the-box               │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Optimistic Updates:                                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  const update = useMutation(api.users.updateProfile); │        │
│  │                                                         │        │
│  │  // UI updates instantly                                │        │
│  │  await update({ userId, firstName: "John" });         │        │
│  │                                                         │        │
│  │  // If mutation fails, Convex rolls back UI            │        │
│  │  // If mutation succeeds, UI already reflects change   │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Hosting Platform (Netlify/Vercel):                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Next.js 15 Application                                 │        │
│  │  - Static pages (SSG)                                   │        │
│  │  - Server components (SSR)                              │        │
│  │  - API routes (/login, /callback, /api/auth/logout)    │        │
│  │  - Edge runtime support                                 │        │
│  │  - Automatic HTTPS                                      │        │
│  │  - CDN distribution                                     │        │
│  └────────────────────────────────────────────────────────┘        │
│                   │                                                  │
│                   │ HTTPS / WebSocket                                │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Convex Cloud                                           │        │
│  │  - Serverless functions                                 │        │
│  │  - Real-time database                                   │        │
│  │  - WebSocket server                                     │        │
│  │  - Automatic scaling                                    │        │
│  │  - Global distribution                                  │        │
│  │  - Built-in monitoring                                  │        │
│  └────────────────────────────────────────────────────────┘        │
│                   │                                                  │
│                   │ HTTPS (OAuth)                                    │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  WorkOS Cloud                                           │        │
│  │  - Hosted authentication pages                          │        │
│  │  - OAuth provider integrations                          │        │
│  │  - Session management                                   │        │
│  │  - MFA services                                         │        │
│  │  - SSO connectors                                       │        │
│  │  - User directory                                       │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Required Environment Variables:                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  # WorkOS                                               │        │
│  │  WORKOS_API_KEY=sk_...                                 │        │
│  │  WORKOS_CLIENT_ID=client_...                           │        │
│  │  WORKOS_COOKIE_PASSWORD=<32+ char secret>             │        │
│  │  NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://...          │        │
│  │                                                         │        │
│  │  # Convex                                               │        │
│  │  NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud       │        │
│  │  CONVEX_DEPLOYMENT=prod:...                            │        │
│  │                                                         │        │
│  │  # Application                                          │        │
│  │  NEXT_PUBLIC_APP_URL=https://your-domain.com          │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Security Checklist:                                                 │
│  ☑ HTTPS enforced (automatic with Netlify/Vercel)                   │
│  ☑ Secure cookies (httpOnly, secure, sameSite)                      │
│  ☑ WORKOS_COOKIE_PASSWORD rotated regularly                         │
│  ☑ Redirect URIs whitelisted in WorkOS dashboard                    │
│  ☑ CORS configured properly                                         │
│  ☑ Rate limiting on authentication endpoints                        │
│  ☑ CSP headers configured                                           │
│  ☑ Environment variables never committed to git                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Error Handling & Edge Cases

### Authentication Errors

```typescript
// Login route error handling
export async function GET(request: NextRequest) {
  try {
    const authorizationUrl = await getAuthorizationUrl({
      screenHint: 'sign-in',
    });
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error('Error generating authorization URL:', error);
    // Fallback to home page
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Callback route (handleAuth() includes built-in error handling)
// - Invalid authorization code → Redirects to login
// - Expired code → Redirects to login
// - Network errors → Shows error page
```

### Session Expiration

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SESSION EXPIRATION HANDLING                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Scenario 1: Session Expires (7 days)                               │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  - useAuth() returns { user: null, isLoading: false }  │        │
│  │  - Component shows logged-out state                     │        │
│  │  - User clicks "Sign In"                                │        │
│  │  - Redirects to /login                                  │        │
│  │  - Normal login flow resumes                            │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Scenario 2: Server-Side Protection                                 │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  - User tries to access protected page                  │        │
│  │  - requireAuth() checks session                         │        │
│  │  - Session expired or invalid                           │        │
│  │  - Automatic redirect('/login')                         │        │
│  │  - User logs in again                                   │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  Scenario 3: Tab Synchronization                                    │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  - User logs out in Tab A                               │        │
│  │  - Session cookie removed                               │        │
│  │  - Tab B: useAuth() detects no session                 │        │
│  │  - Tab B automatically shows logged-out state           │        │
│  │  - No manual sync required                              │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Offline Handling

```
Convex Client (Offline Resilience):
┌────────────────────────────────────────────────────────┐
│  - Queued mutations when offline                       │
│  - Automatic reconnection when online                   │
│  - Applies queued operations in order                   │
│  - Optimistic UI updates                                │
│  - Rollback on failure                                  │
└────────────────────────────────────────────────────────┘

WorkOS Sessions (Cookie-Based):
┌────────────────────────────────────────────────────────┐
│  - Session persists during offline periods             │
│  - No network calls needed to check auth               │
│  - Cookie validation works offline                     │
│  - Re-validates with WorkOS when online                │
└────────────────────────────────────────────────────────┘
```

## Performance Optimizations

### 1. Authentication Performance

- **Cookie-Based Sessions**: No database lookups on every request
- **Server-Side Caching**: WorkOS client caches user data
- **Minimal Network Calls**: Session validated locally via cookie signature
- **Fast Redirects**: OAuth redirects handled at edge

### 2. Data Fetching

```typescript
// Efficient: Single query combines auth + data
const { convexUser } = useWorkOS(); // Includes user sync
const projects = useQuery(api.projects.getUserProjects, {
  userId: convexUser?._id,
});

// Less efficient: Separate queries
const user = useQuery(api.users.get, {});
const projects = useQuery(api.projects.get, { userId: user?._id });
```

### 3. Real-Time Efficiency

- **Single WebSocket**: One connection for all subscriptions
- **Selective Updates**: Only changed data pushed to clients
- **Automatic Batching**: Multiple updates batched together
- **Smart Caching**: Convex client caches query results

## Monitoring and Observability

### Current Capabilities

```
Console Logging:
┌────────────────────────────────────────────────────────┐
│  - WorkOS authentication flow events                   │
│  - Convex sync operations                              │
│  - User profile updates                                │
│  - Error traces with stack                             │
└────────────────────────────────────────────────────────┘

WorkOS Dashboard:
┌────────────────────────────────────────────────────────┐
│  - Active users                                        │
│  - Login attempts                                      │
│  - Failed authentications                              │
│  - OAuth provider usage                                │
│  - MFA adoption rates                                  │
└────────────────────────────────────────────────────────┘

Convex Dashboard:
┌────────────────────────────────────────────────────────┐
│  - Function execution logs                             │
│  - Database query performance                          │
│  - Real-time connection count                          │
│  - Mutation success/failure rates                      │
│  - Storage and bandwidth usage                         │
└────────────────────────────────────────────────────────┘
```

### Recommended Additions

```typescript
// Add structured logging
import { logger } from '@/lib/logger';

logger.info('User authenticated', {
  workosUserId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
});

// Add error tracking (e.g., Sentry)
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: {
    component: 'auth',
    action: 'login',
  },
  user: {
    id: user?.id,
    email: user?.email,
  },
});
```

## Future Enhancements

### 1. Role-Based Access Control (RBAC)

```typescript
// Add roles to schema
users: defineTable({
  workosUserId: v.string(),
  email: v.string(),
  role: v.union(
    v.literal("admin"),
    v.literal("developer"),
    v.literal("viewer")
  ),
  // ... existing fields
})

// Enforce in Convex functions
export const deleteProject = mutation({
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new Error("Unauthorized: Admin role required");
    }
    // ... deletion logic
  },
});
```

### 2. Multi-Factor Authentication (MFA)

WorkOS supports MFA out-of-the-box:

```typescript
// Enable in WorkOS Dashboard
// MFA options:
// - TOTP (Google Authenticator, Authy)
// - SMS
// - Email
// - WebAuthn (fingerprint, Face ID)

// No code changes required!
// WorkOS handles MFA flow automatically
```

### 3. Enterprise SSO

```typescript
// WorkOS makes SSO trivial:
// 1. Admin configures SSO in WorkOS Dashboard
// 2. Select provider (Okta, Azure AD, Google Workspace)
// 3. Configure SAML/OIDC settings
// 4. Users authenticate via their corporate identity

// No code changes needed in application!
```

### 4. Audit Logging

```typescript
// Track authentication events
export const logAuthEvent = mutation({
  args: {
    userId: v.id("users"),
    event: v.union(
      v.literal("login"),
      v.literal("logout"),
      v.literal("password_change")
    ),
    ipAddress: v.string(),
    userAgent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
```

### 5. Session Management Dashboard

```typescript
// Allow users to view and revoke active sessions
export const listActiveSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Query WorkOS API for active sessions
    // Return session list with device info
  },
});

export const revokeSession = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Call WorkOS API to revoke session
  },
});
```

## Summary

This architecture provides:

### Security
- **OAuth 2.0** with WorkOS managed identity
- **Encrypted sessions** with secure HTTP-only cookies
- **CSRF protection** via sameSite cookies
- **HTTPS** enforced in production
- **No secrets** in client-side code

### Developer Experience
- **Type-safe** with full TypeScript support
- **Automatic sync** between WorkOS and Convex
- **Real-time updates** via Convex WebSocket
- **Simple auth hooks** for both client and server
- **Minimal boilerplate** with WorkOS AuthKit

### Scalability
- **Serverless architecture** with Convex
- **Global CDN** with Netlify/Vercel
- **Automatic scaling** for both auth and data
- **WebSocket connections** for real-time features
- **Enterprise-ready** with SSO and MFA support

### Maintainability
- **Separation of concerns** (auth vs data)
- **Clear data flow** (WorkOS → Next.js → Convex)
- **Modular components** with custom hooks
- **Comprehensive error handling** at every layer
- **Production-ready** with monitoring and logging

**Next Steps**: See `ARCHITECTURE_CHANGES.md` for migration decisions and `docs/WORKOS_QUICKSTART.md` for setup instructions.
