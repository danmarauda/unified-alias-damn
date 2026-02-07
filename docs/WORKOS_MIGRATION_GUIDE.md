# WorkOS Migration Guide

Complete guide for migrating from Better Auth to WorkOS User Management + AuthKit.

## Table of Contents

1. [Overview](#overview)
2. [Why WorkOS?](#why-workos)
3. [Migration Timeline](#migration-timeline)
4. [Prerequisites](#prerequisites)
5. [Step-by-Step Migration](#step-by-step-migration)
6. [Implementation Files](#implementation-files)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Rollback Plan](#rollback-plan)

---

## Overview

This migration replaces Better Auth (with in-memory SQLite) with **WorkOS User Management**, providing:

- ✅ **Persistent sessions** - No more data loss on restart
- ✅ **Enterprise SSO** - SAML, OAuth support built-in
- ✅ **Hosted authentication** - AuthKit provides secure, customizable login UI
- ✅ **Production-ready** - Battle-tested by companies like Vercel, Linear, Loom
- ✅ **Session management** - Encrypted cookies with automatic refresh
- ✅ **User management APIs** - Complete user/org management
- ✅ **Webhooks** - Real-time event notifications

---

## Why WorkOS?

### Current Issues with Better Auth

| Problem | Impact | WorkOS Solution |
|---------|--------|-----------------|
| **In-memory database** | Sessions lost on restart | Persistent sessions via encrypted cookies |
| **No SSO support** | Can't support enterprise customers | Native SAML/OAuth SSO |
| **Mock HTTP handlers** | Not production-ready | Production-grade hosted auth |
| **Manual session management** | Complex to implement correctly | Automatic session refresh |
| **No user management UI** | Must build custom admin panel | Admin portal included |

### WorkOS Advantages

- **Faster to production** - Complete auth in hours, not weeks
- **Security best practices** - OWASP compliance, automatic security updates
- **Scalability** - Handles millions of users out of the box
- **Compliance** - SOC 2, GDPR, HIPAA ready
- **Convex integration** - Works seamlessly with your existing Convex backend

---

## Migration Timeline

### Phase 1: Setup & Configuration (30 minutes)
- Sign up for WorkOS
- Install dependencies
- Configure environment variables
- Set up redirect URIs

### Phase 2: Implementation (2-3 hours)
- Implement middleware
- Create callback/login routes
- Update Convex schema
- Replace auth hooks

### Phase 3: Testing (1 hour)
- Test sign up flow
- Test sign in flow
- Test session management
- Test protected routes

### Phase 4: Deployment (30 minutes)
- Deploy to staging
- Verify production config
- Deploy to production
- Monitor for issues

**Total Estimated Time: 4-5 hours**

---

## Prerequisites

### 1. WorkOS Account Setup

1. Sign up at [https://dashboard.workos.com](https://dashboard.workos.com)
2. Create a new project
3. Note your **API Key** and **Client ID**

### 2. Configure WorkOS Dashboard

#### Redirect URIs
In _Redirects_ section of WorkOS Dashboard:

```
Development:
http://localhost:3000/callback

Production:
https://your-domain.com/callback
```

#### Initiate Login URL
```
Development:
http://localhost:3000/login

Production:
https://your-domain.com/login
```

#### Logout Redirect
```
Development:
http://localhost:3000

Production:
https://your-domain.com
```

### 3. Generate Cookie Password

```bash
# Generate a secure 32-character password
openssl rand -base64 32
```

---

## Step-by-Step Migration

### Step 1: Install WorkOS SDK

```bash
# Remove Better Auth dependencies
bun remove better-auth @convex-dev/better-auth next-auth

# Install WorkOS Next.js SDK
bun add @workos-inc/authkit-nextjs
```

### Step 2: Update Environment Variables

Create/update `.env.local`:

```bash
# WorkOS Configuration
WORKOS_API_KEY='sk_test_...'              # From WorkOS Dashboard
WORKOS_CLIENT_ID='client_...'             # From WorkOS Dashboard
WORKOS_COOKIE_PASSWORD='<32-char-pass>'   # Generated with openssl

# Redirect URI (must match dashboard config)
NEXT_PUBLIC_WORKOS_REDIRECT_URI='http://localhost:3000/callback'

# Convex (keep existing)
NEXT_PUBLIC_CONVEX_URL='https://...'
CONVEX_DEPLOYMENT='...'

# Application
NEXT_PUBLIC_APP_URL='http://localhost:3000'
```

### Step 3: Update Convex Schema

Update `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Update users table for WorkOS
  users: defineTable({
    // WorkOS user ID (primary identifier)
    workosUserId: v.string(),

    // User profile
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),

    // Email verification
    emailVerified: v.boolean(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workos_id", ["workosUserId"])
    .index("by_email", ["email"]),

  // Add sessions table for WorkOS
  sessions: defineTable({
    userId: v.id("users"),
    workosSessionId: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workos_session", ["workosSessionId"]),

  // Keep existing tables (stats, projectActivities, etc.)
  stats: defineTable({
    type: v.string(),
    value: v.number(),
    timestamp: v.number(),
  }).index("by_type", ["type"]),

  // ... rest of your existing tables
});
```

### Step 4: Create Middleware

Create `middleware.ts` in project root:

```typescript
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  debug: process.env.NODE_ENV === 'development',

  // Routes that don't require authentication
  publicRoutes: [
    '/',
    '/login',
    '/callback',
  ],

  // Middleware auth mode - redirect to login if no session
  middlewareAuth: {
    enabled: true,
    unauthenticatedUrl: '/login',
  },
});

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
```

### Step 5: Create Callback Route

Create `src/app/callback/route.ts`:

```typescript
import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth();
```

### Step 6: Create Login Route

Create `src/app/login/route.ts`:

```typescript
import { getAuthorizationUrl } from '@workos-inc/authkit-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the authorization URL from WorkOS
  const authorizationUrl = await getAuthorizationUrl({
    screenHint: 'sign-in', // or 'sign-up' for sign-up flow
    returnPathname: request.nextUrl.searchParams.get('returnTo') ?? undefined,
  });

  // Redirect to AuthKit
  return NextResponse.redirect(authorizationUrl);
}
```

### Step 7: Update App Layout with Provider

Update `src/app/layout.tsx`:

```typescript
import { AuthKitProvider } from '@workos-inc/authkit-nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthKitProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
```

### Step 8: Create Auth Hook for Client Components

Create `src/lib/hooks/useWorkOS.ts`:

```typescript
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

export function useWorkOS() {
  const { user: workosUser, isLoading } = useAuth();

  // Sync WorkOS user to Convex
  const convexUser = useQuery(
    api.users.getByWorkOSId,
    workosUser ? { workosUserId: workosUser.id } : 'skip'
  );

  const syncUser = useMutation(api.users.syncFromWorkOS);

  // Sync user to Convex on first load
  React.useEffect(() => {
    if (workosUser && !convexUser) {
      syncUser({
        workosUserId: workosUser.id,
        email: workosUser.email,
        firstName: workosUser.firstName ?? undefined,
        lastName: workosUser.lastName ?? undefined,
        profilePictureUrl: workosUser.profilePictureUrl ?? undefined,
        emailVerified: workosUser.emailVerified,
      });
    }
  }, [workosUser, convexUser, syncUser]);

  return {
    workosUser,
    convexUser,
    isLoading,
    isAuthenticated: !!workosUser,
  };
}
```

### Step 9: Create Auth Utilities for Server Components

Create `src/lib/workos-server.ts`:

```typescript
import { withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

/**
 * Server-side auth helper for protected pages
 */
export async function requireAuth() {
  return withAuth({
    ensureSignedIn: true,
    onUnauthenticated: () => redirect('/login'),
  });
}

/**
 * Server-side auth helper for optional auth
 */
export async function getOptionalAuth() {
  return withAuth();
}

/**
 * Get sign-out URL
 */
export async function getSignOutUrl() {
  const { signOut } = await import('@workos-inc/authkit-nextjs');
  return signOut();
}
```

### Step 10: Create Convex User Management Functions

Create `convex/users.ts`:

```typescript
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Sync user from WorkOS to Convex
 */
export const syncFromWorkOS = mutation({
  args: {
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosUserId', args.workosUserId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        profilePictureUrl: args.profilePictureUrl,
        emailVerified: args.emailVerified,
        updatedAt: Date.now(),
      });

      return { userId: existingUser._id };
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      workosUserId: args.workosUserId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      profilePictureUrl: args.profilePictureUrl,
      emailVerified: args.emailVerified,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId };
  },
});

/**
 * Get user by WorkOS ID
 */
export const getByWorkOSId = query({
  args: { workosUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosUserId', args.workosUserId))
      .first();
  },
});

/**
 * Get user by Convex ID
 */
export const getById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    userId: v.id('users'),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
```

### Step 11: Update Header Component

Update `src/components/layout/Header.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { useWorkOS } from '@/lib/hooks/useWorkOS';
import { Button } from '@/components/ui/button';

export function Header() {
  const { workosUser, isLoading } = useWorkOS();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          ALIAS MOSAIC
        </Link>

        <nav className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-24 bg-neutral-800 animate-pulse rounded" />
          ) : workosUser ? (
            <>
              <span className="text-sm text-neutral-400">
                {workosUser.email}
              </span>
              <Button asChild variant="outline">
                <a href="/api/auth/logout">Sign Out</a>
              </Button>
            </>
          ) : (
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
```

### Step 12: Update Login Page

Create `src/app/login/page.tsx`:

```typescript
import { redirect } from 'next/navigation';
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function LoginPage() {
  // If already authenticated, redirect to dashboard
  const { user } = await withAuth();

  if (user) {
    redirect('/');
  }

  // The actual redirect to WorkOS happens in /login/route.ts
  redirect('/login');
}
```

### Step 13: Add Logout Route

Create `src/app/api/auth/logout/route.ts`:

```typescript
import { getSignOutUrl } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const signOutUrl = await getSignOutUrl();
  return NextResponse.redirect(signOutUrl);
}
```

### Step 14: Update Protected Pages

Example: Update `src/app/projects/page.tsx`:

```typescript
import { requireAuth } from '@/lib/workos-server';
import { ProjectsList } from '@/components/projects/ProjectsList';

export default async function ProjectsPage() {
  // Ensure user is authenticated
  const { user } = await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ProjectsList userId={user.id} />
    </div>
  );
}
```

### Step 15: Clean Up Old Auth Files

Delete these files:

```bash
# Better Auth files (no longer needed)
rm src/lib/auth.ts
rm src/lib/auth-client.ts
rm src/app/api/auth/[...all]/route.ts
rm convex/auth.ts

# Update convex/http.ts (remove auth routes)
```

Update `convex/http.ts`:

```typescript
import { httpRouter } from "convex/server";

const http = httpRouter();

// Add your other HTTP routes here if needed

export default http;
```

### Step 16: Update Package.json Scripts

No changes needed! Your existing scripts work as-is:

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel 'dev:*'",
    "dev:next": "next dev -H 0.0.0.0 --turbopack",
    "dev:convex": "convex dev",
    "build": "next build && convex deploy"
  }
}
```

---

## Testing

### 1. Test Development Environment

```bash
# Start development servers
bun run dev

# Open browser
open http://localhost:3000
```

### 2. Test Authentication Flow

#### Sign Up Flow
1. Navigate to `http://localhost:3000/login`
2. Click "Sign Up"
3. Enter email and password
4. Verify email (check inbox)
5. Should redirect to homepage

#### Sign In Flow
1. Navigate to `http://localhost:3000/login`
2. Enter credentials
3. Should redirect to homepage
4. Should see user email in header

#### Protected Routes
1. Sign out
2. Try to access `/projects`
3. Should redirect to `/login`
4. Sign in
5. Should access `/projects` successfully

#### Session Persistence
1. Sign in
2. Refresh page
3. Should remain signed in
4. Restart Next.js server
5. Should remain signed in ✅ (Fixed!)

### 3. Test Convex Integration

Check that users sync to Convex:

1. Sign in with WorkOS
2. Open Convex Dashboard
3. Check `users` table
4. Should see your user with `workosUserId`

---

## Deployment

### 1. Configure Production Environment

Update `.env.production`:

```bash
WORKOS_API_KEY='sk_prod_...'
WORKOS_CLIENT_ID='client_...'
WORKOS_COOKIE_PASSWORD='<secure-32-char-password>'
NEXT_PUBLIC_WORKOS_REDIRECT_URI='https://your-domain.com/callback'
NEXT_PUBLIC_APP_URL='https://your-domain.com'
```

### 2. Update WorkOS Dashboard (Production)

1. Add production redirect URIs
2. Add production logout redirect
3. Add production initiate login URL

### 3. Deploy to Netlify

```bash
# Build and deploy
bun run build

# Netlify will automatically deploy
# Set environment variables in Netlify dashboard
```

### 4. Verify Production

1. Test sign up flow
2. Test sign in flow
3. Test session persistence
4. Check Convex data sync
5. Monitor for errors

---

## Rollback Plan

If issues occur, you can quickly rollback:

### Option 1: Revert to Better Auth (Git)

```bash
git revert <migration-commit-hash>
git push
```

### Option 2: Keep Both Systems Temporarily

During migration, you can run both auth systems:

1. Keep Better Auth routes at `/auth/legacy/*`
2. Run WorkOS at `/auth/*`
3. Gradually migrate users
4. Remove Better Auth after full migration

---

## Benefits After Migration

### Before (Better Auth)
- ❌ Sessions lost on restart
- ❌ In-memory database
- ❌ Mock HTTP handlers
- ❌ No SSO support
- ❌ Manual session management
- ❌ Not production-ready

### After (WorkOS)
- ✅ Persistent sessions
- ✅ Production-grade database
- ✅ Real authentication handlers
- ✅ Enterprise SSO ready
- ✅ Automatic session refresh
- ✅ Production-ready from day 1

---

## Support

- **WorkOS Docs:** https://workos.com/docs/user-management
- **WorkOS Dashboard:** https://dashboard.workos.com
- **WorkOS Support:** support@workos.com
- **Next.js SDK:** https://github.com/workos/authkit-nextjs

---

## Next Steps

After migration:

1. ✅ **Enable SSO** - Add SAML/OAuth for enterprise customers
2. ✅ **Add MFA** - Enable multi-factor authentication
3. ✅ **Configure branding** - Customize AuthKit appearance
4. ✅ **Set up webhooks** - Listen for user events
5. ✅ **Add organizations** - Multi-tenant support
6. ✅ **Implement impersonation** - For customer support

**Migration complete! 🎉**
