# Post-Migration Steps - WorkOS Integration

**Project:** Unified ALIAS Mosaic Platform
**Last Updated:** October 16, 2025
**Estimated Time:** 4-5 hours

---

## Overview

This document provides step-by-step instructions to complete the WorkOS migration. The infrastructure and documentation are in place, but **manual implementation is required**.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **WorkOS Account** - Sign up at https://dashboard.workos.com
- [ ] **Terminal Access** - Command line access to project directory
- [ ] **Editor** - VSCode, Cursor, or similar
- [ ] **30-45 minutes** - For setup and configuration
- [ ] **2-3 hours** - For implementation
- [ ] **1 hour** - For testing

---

## Phase 1: WorkOS Dashboard Setup (15 minutes)

### Step 1.1: Create WorkOS Account

1. Navigate to https://dashboard.workos.com
2. Sign up with your email
3. Verify your email address
4. Create a new project

### Step 1.2: Configure Project Settings

In the WorkOS Dashboard:

1. **Project Name:** Unified ALIAS Mosaic
2. **Environment:** Development (create separate for production later)

### Step 1.3: Get API Credentials

1. Navigate to **Configuration** → **API Keys**
2. Copy your **API Key** (starts with `sk_test_...`)
3. Copy your **Client ID** (starts with `client_...`)

**Save these for Step 2.1**

### Step 1.4: Configure Redirect URIs

Navigate to **Configuration** → **Redirects**:

**Development Settings:**
```
Redirect URI:         http://localhost:3000/callback
Sign-out Redirect:    http://localhost:3000
Initiate Login:       http://localhost:3000/login
```

**Production Settings (add later):**
```
Redirect URI:         https://your-domain.com/callback
Sign-out Redirect:    https://your-domain.com
Initiate Login:       https://your-domain.com/login
```

---

## Phase 2: Environment Configuration (5 minutes)

### Step 2.1: Generate Cookie Password

In your terminal:

```bash
# Generate a secure 32-character password
openssl rand -base64 32
```

**Copy the output** - you'll need this for the next step.

### Step 2.2: Update .env.local

Create or update `.env.local`:

```bash
# =============================================================================
# WorkOS Configuration
# =============================================================================

# From WorkOS Dashboard → API Keys
WORKOS_API_KEY='sk_test_...'              # Replace with your API key
WORKOS_CLIENT_ID='client_...'             # Replace with your Client ID
WORKOS_COOKIE_PASSWORD='<paste-output>'   # Paste the openssl output

# Must match WorkOS Dashboard → Redirects
NEXT_PUBLIC_WORKOS_REDIRECT_URI='http://localhost:3000/callback'

# =============================================================================
# Convex Configuration (KEEP EXISTING)
# =============================================================================

NEXT_PUBLIC_CONVEX_URL='https://calm-caiman-179.convex.cloud'
CONVEX_DEPLOYMENT='dev:calm-caiman-179'

# =============================================================================
# Application Configuration
# =============================================================================

NEXT_PUBLIC_APP_URL='http://localhost:3000'
```

**IMPORTANT:** Never commit `.env.local` to version control!

### Step 2.3: Verify .gitignore

Ensure `.gitignore` contains:

```gitignore
.env.local
.env*.local
```

---

## Phase 3: Install Dependencies (5 minutes)

### Step 3.1: Install WorkOS SDK

```bash
cd /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835

# Install WorkOS Next.js SDK
bun add @workos-inc/authkit-nextjs
```

### Step 3.2: Remove Better Auth (Optional - do after WorkOS is working)

**WAIT UNTIL WORKOS IS TESTED BEFORE REMOVING:**

```bash
# Only run this after WorkOS is fully tested and working
bun remove better-auth @convex-dev/better-auth next-auth
```

### Step 3.3: Verify Installation

```bash
bun list | grep workos
# Should show: @workos-inc/authkit-nextjs@X.X.X
```

---

## Phase 4: Implement Core Files (2 hours)

### Step 4.1: Create OAuth Callback Handler

**Create:** `src/app/callback/route.ts`

```typescript
/**
 * WorkOS OAuth Callback Handler
 *
 * This route handles the OAuth callback from WorkOS after authentication.
 * It processes the authorization code and establishes a session.
 */

import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth();
```

### Step 4.2: Create Login Route

**Create:** `src/app/login/route.ts`

```typescript
/**
 * WorkOS Login Initiation
 *
 * This route redirects users to WorkOS AuthKit for authentication.
 * Supports both sign-in and sign-up flows.
 */

import { getAuthorizationUrl } from '@workos-inc/authkit-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the authorization URL from WorkOS
  const authorizationUrl = await getAuthorizationUrl({
    // Use 'sign-in' or 'sign-up' as the screen hint
    screenHint: 'sign-in',

    // Support return path after authentication
    returnPathname: request.nextUrl.searchParams.get('returnTo') ?? undefined,
  });

  // Redirect to WorkOS AuthKit
  return NextResponse.redirect(authorizationUrl);
}
```

### Step 4.3: Create Logout Route

**Create:** `src/app/api/auth/logout/route.ts`

```typescript
/**
 * WorkOS Logout Handler
 *
 * This route signs out the user and redirects to the homepage.
 */

import { getSignOutUrl } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  // Get the sign-out URL from WorkOS
  const signOutUrl = await getSignOutUrl();

  // Redirect to sign-out URL (clears session)
  return NextResponse.redirect(signOutUrl);
}
```

### Step 4.4: Create Client-Side Auth Hook

**Create:** `src/lib/hooks/useWorkOS.ts`

```typescript
/**
 * useWorkOS Hook
 *
 * Client-side hook for accessing WorkOS authentication state.
 * Automatically syncs users to Convex database.
 */

'use client';

import { useAuth } from '@workos-inc/authkit-nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useEffect } from 'react';

export function useWorkOS() {
  // Get WorkOS authentication state
  const { user: workosUser, isLoading } = useAuth();

  // Query Convex for user data
  const convexUser = useQuery(
    api.users.getByWorkOSId,
    workosUser ? { workosUserId: workosUser.id } : 'skip'
  );

  // Mutation to sync user to Convex
  const syncUser = useMutation(api.users.syncFromWorkOS);

  // Automatically sync user to Convex on first load
  useEffect(() => {
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
    // WorkOS user data
    workosUser,

    // Convex user data (synced)
    convexUser,

    // Loading state
    isLoading,

    // Computed authentication state
    isAuthenticated: !!workosUser,
  };
}
```

### Step 4.5: Create Server-Side Auth Utilities

**Create:** `src/lib/workos-server.ts`

```typescript
/**
 * WorkOS Server Utilities
 *
 * Server-side helpers for authentication in Server Components and API routes.
 */

import { withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

/**
 * Require authentication for a page
 *
 * Usage in Server Components:
 * ```typescript
 * export default async function ProtectedPage() {
 *   const { user } = await requireAuth();
 *   return <div>Hello {user.email}</div>;
 * }
 * ```
 */
export async function requireAuth() {
  return withAuth({
    ensureSignedIn: true,
    onUnauthenticated: () => redirect('/login'),
  });
}

/**
 * Get optional authentication state
 *
 * Usage in Server Components:
 * ```typescript
 * export default async function HomePage() {
 *   const { user } = await getOptionalAuth();
 *   return <div>{user ? `Hello ${user.email}` : 'Please sign in'}</div>;
 * }
 * ```
 */
export async function getOptionalAuth() {
  return withAuth();
}

/**
 * Get sign-out URL
 *
 * Usage:
 * ```typescript
 * const signOutUrl = await getSignOutUrl();
 * ```
 */
export async function getSignOutUrl() {
  const { signOut } = await import('@workos-inc/authkit-nextjs');
  return signOut();
}
```

### Step 4.6: Create Convex User Management

**Create:** `convex/users.ts`

```typescript
/**
 * Convex User Management
 *
 * Functions for managing users synced from WorkOS.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Sync user from WorkOS to Convex
 *
 * Called automatically by useWorkOS hook when user signs in.
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
    // Check if user already exists
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

/**
 * Get all users
 */
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  },
});
```

---

## Phase 5: Update Existing Files (1 hour)

### Step 5.1: Update App Layout

**Update:** `src/app/layout.tsx`

Add the `AuthKitProvider` wrapper:

```typescript
import { AuthKitProvider } from '@workos-inc/authkit-nextjs';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ALIAS Mosaic',
  description: 'Distributed Agent Intelligence System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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

### Step 5.2: Update Convex Schema

**Update:** `convex/schema.ts`

Replace the `users` table definition:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Updated users table for WorkOS
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

  // Keep all existing tables below
  stats: defineTable({
    type: v.string(),
    value: v.number(),
    timestamp: v.number(),
  }).index("by_type", ["type"]),

  // ... rest of your existing tables
});
```

### Step 5.3: Update Header Component

**Update:** `src/components/layout/Header.tsx`

Replace the authentication logic:

```typescript
'use client';

import Link from 'next/link';
import { useWorkOS } from '@/lib/hooks/useWorkOS';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  const { workosUser, isLoading } = useWorkOS();

  return (
    <header className="border-b border-neutral-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          ALIAS MOSAIC
        </Link>

        <nav className="flex items-center gap-4">
          <ThemeToggle />

          {isLoading ? (
            <div className="h-10 w-24 bg-neutral-800 animate-pulse rounded" />
          ) : workosUser ? (
            <>
              <span className="text-sm text-neutral-400">
                {workosUser.email}
              </span>
              <Button asChild variant="outline" size="sm">
                <a href="/api/auth/logout">Sign Out</a>
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <a href="/login">Sign In</a>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
```

### Step 5.4: Update Convex HTTP Routes

**Update:** `convex/http.ts`

Remove Better Auth routes:

```typescript
import { httpRouter } from "convex/server";

const http = httpRouter();

// Add your other HTTP routes here if needed
// DO NOT add Better Auth routes

export default http;
```

---

## Phase 6: Deploy Convex Schema (5 minutes)

### Step 6.1: Deploy Schema Changes

```bash
cd /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835

# Deploy the updated schema
convex deploy
```

### Step 6.2: Verify Schema in Dashboard

1. Open Convex Dashboard: https://dashboard.convex.dev
2. Navigate to your project
3. Check that `users` table has new fields:
   - `workosUserId`
   - `emailVerified`
   - `createdAt`
   - `updatedAt`
4. Verify `sessions` table exists

---

## Phase 7: Testing (1 hour)

### Step 7.1: Start Development Servers

```bash
cd /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835

# Start both Next.js and Convex dev servers
bun run dev
```

### Step 7.2: Test Sign-Up Flow

1. **Navigate to login**
   - Open http://localhost:3000/login
   - Should redirect to WorkOS AuthKit

2. **Create account**
   - Click "Sign Up"
   - Enter email and password
   - Should receive verification email

3. **Verify email**
   - Check your inbox
   - Click verification link
   - Should redirect to homepage

4. **Check Convex sync**
   - Open Convex Dashboard
   - Check `users` table
   - Should see your user with `workosUserId`

### Step 7.3: Test Sign-In Flow

1. **Sign out**
   - Click "Sign Out" in header
   - Should redirect to homepage
   - Header should show "Sign In" button

2. **Sign in**
   - Click "Sign In"
   - Enter credentials
   - Should redirect to homepage
   - Header should show your email

### Step 7.4: Test Session Persistence

1. **Refresh page**
   - Press F5 or Cmd+R
   - Should remain signed in
   - Email should still show in header

2. **Restart server**
   - Stop dev server (Ctrl+C)
   - Start again: `bun run dev`
   - Open http://localhost:3000
   - Should STILL be signed in ✅ (This is the fix!)

3. **Close and reopen browser**
   - Close browser completely
   - Reopen and navigate to localhost:3000
   - Should remain signed in

### Step 7.5: Test Protected Routes

1. **Sign out**
   - Ensure you're signed out

2. **Try to access protected page**
   - Navigate to http://localhost:3000/projects
   - Should redirect to /login

3. **Sign in and retry**
   - Sign in
   - Navigate to /projects again
   - Should access successfully

### Step 7.6: Test Edge Cases

1. **Multiple tabs**
   - Open app in two browser tabs
   - Sign out in one tab
   - Other tab should also sign out (refresh to verify)

2. **Invalid credentials**
   - Try to sign in with wrong password
   - Should show error message
   - Should not crash

3. **Network errors**
   - Disconnect network
   - Try to sign in
   - Should show appropriate error
   - Reconnect network
   - Should work normally

---

## Phase 8: Clean Up (30 minutes)

### Step 8.1: Remove Better Auth Files (AFTER TESTING)

**ONLY DO THIS AFTER WORKOS IS FULLY TESTED AND WORKING:**

```bash
cd /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835

# Delete old auth files
rm src/lib/auth.ts
rm src/lib/auth-client.ts
rm src/app/api/auth/[...all]/route.ts
rm convex/auth.ts
```

### Step 8.2: Remove Better Auth Dependencies

```bash
bun remove better-auth @convex-dev/better-auth next-auth
```

### Step 8.3: Fix TypeScript Errors

```bash
# Run type checker
bunx tsc --noEmit

# Fix any remaining errors
# Run linter
bun run lint --write
```

### Step 8.4: Verify Build

```bash
# Build for production
bun run build

# Should complete without errors
```

---

## Phase 9: Documentation (15 minutes)

### Step 9.1: Update README

Add WorkOS setup instructions to `README.md`:

```markdown
## Authentication

This project uses [WorkOS User Management](https://workos.com/docs/user-management) for authentication.

### Setup

1. Sign up at https://dashboard.workos.com
2. Create a new project
3. Configure environment variables in `.env.local`:
   ```bash
   WORKOS_API_KEY=sk_test_...
   WORKOS_CLIENT_ID=client_...
   WORKOS_COOKIE_PASSWORD=<32-char-password>
   NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
   ```

### Features

- ✅ Email/password authentication
- ✅ Persistent sessions
- ✅ Enterprise SSO ready
- ✅ Automatic user sync to Convex
- ✅ Protected routes
```

### Step 9.2: Create .env.example

Create `.env.local.example`:

```bash
# WorkOS Configuration
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...
WORKOS_COOKIE_PASSWORD=<32-char-password>
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=your-deployment

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Phase 10: Production Deployment (30 minutes)

### Step 10.1: Configure Production Environment

Create `.env.production`:

```bash
# WorkOS Configuration (PRODUCTION)
WORKOS_API_KEY='sk_prod_...'              # Production API key
WORKOS_CLIENT_ID='client_...'             # Production Client ID
WORKOS_COOKIE_PASSWORD='<secure-password>' # Generate new for production
NEXT_PUBLIC_WORKOS_REDIRECT_URI='https://your-domain.com/callback'

# Convex (PRODUCTION)
NEXT_PUBLIC_CONVEX_URL='https://your-production.convex.cloud'
CONVEX_DEPLOYMENT='production:your-deployment'

# Application
NEXT_PUBLIC_APP_URL='https://your-domain.com'
```

### Step 10.2: Update WorkOS Dashboard (Production)

1. Create production environment in WorkOS
2. Configure production redirect URIs:
   ```
   Redirect URI:      https://your-domain.com/callback
   Sign-out Redirect: https://your-domain.com
   Initiate Login:    https://your-domain.com/login
   ```

### Step 10.3: Set Netlify Environment Variables

In Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add all production variables from `.env.production`
3. **DO NOT** commit `.env.production` to git

### Step 10.4: Deploy to Production

```bash
# Build and deploy
bun run build

# Netlify will automatically deploy
# Or manually deploy:
netlify deploy --prod
```

### Step 10.5: Verify Production

1. Test sign-up flow on production URL
2. Test sign-in flow
3. Test session persistence
4. Check Convex production data
5. Monitor for errors in Netlify logs

---

## Troubleshooting

### Issue: Middleware not working

**Symptoms:** Redirects not working, authentication bypassed

**Solutions:**
1. Verify `middleware.ts` is in project root (not in `src/`)
2. Check `config.matcher` includes the routes you need
3. Ensure `@workos-inc/authkit-nextjs` is installed
4. Restart dev server

### Issue: Sessions not persisting

**Symptoms:** Signed out after page refresh

**Solutions:**
1. Verify `WORKOS_COOKIE_PASSWORD` is set and 32+ characters
2. Check browser allows cookies
3. Ensure HTTPS in production (required for secure cookies)
4. Check WorkOS Dashboard session settings

### Issue: Users not syncing to Convex

**Symptoms:** User appears in WorkOS but not in Convex `users` table

**Solutions:**
1. Open browser console, check for errors
2. Verify `convex/users.ts` exists and is deployed
3. Check Convex logs for errors
4. Ensure `useWorkOS` hook is being used in components

### Issue: Redirect URI mismatch

**Symptoms:** Error "redirect_uri_mismatch" from WorkOS

**Solutions:**
1. Verify `.env.local` `NEXT_PUBLIC_WORKOS_REDIRECT_URI` matches WorkOS Dashboard
2. Check protocol (http vs https)
3. Check port (include :3000 for localhost)
4. Ensure no trailing slashes

### Issue: TypeScript errors

**Symptoms:** Build fails with type errors

**Solutions:**
1. Run `bunx tsc --noEmit` to see all errors
2. Install WorkOS types: `bun add -d @types/node`
3. Restart TypeScript server in VSCode
4. Check for missing imports

### Issue: Environment variables not loading

**Symptoms:** `undefined` errors for env vars

**Solutions:**
1. Verify `.env.local` exists in project root
2. Restart dev server after changing env vars
3. Check for typos in variable names
4. Ensure `NEXT_PUBLIC_` prefix for client-side vars

---

## Success Checklist

Mark each item when complete:

### Setup
- [ ] WorkOS account created
- [ ] API credentials obtained
- [ ] Cookie password generated
- [ ] Environment variables configured
- [ ] WorkOS Dashboard configured

### Dependencies
- [ ] WorkOS SDK installed
- [ ] Better Auth removed (after testing)
- [ ] No dependency conflicts

### Implementation
- [ ] 6 new files created
- [ ] 4 existing files updated
- [ ] 4 old files deleted
- [ ] Convex schema deployed

### Testing
- [ ] Sign-up flow works
- [ ] Sign-in flow works
- [ ] Sign-out flow works
- [ ] Sessions persist across restarts
- [ ] Protected routes work
- [ ] User syncs to Convex
- [ ] Edge cases handled

### Deployment
- [ ] TypeScript compiles without errors
- [ ] Build succeeds
- [ ] Production environment configured
- [ ] Deployed to staging
- [ ] Deployed to production
- [ ] Production verified

### Documentation
- [ ] README updated
- [ ] .env.example created
- [ ] Migration documented
- [ ] Team notified

---

## Next Steps After Migration

### Optional Enhancements

1. **Enable SSO** (Enterprise feature)
   - SAML authentication
   - Google OAuth
   - Microsoft OAuth
   - GitHub OAuth

2. **Add Multi-Factor Authentication**
   - SMS verification
   - Authenticator apps
   - Email codes

3. **Customize AuthKit Branding**
   - Match your brand colors
   - Add logo
   - Custom welcome messages

4. **Set Up Webhooks**
   - Listen for user events
   - Sync to analytics
   - Trigger automations

5. **Add Organizations**
   - Multi-tenant support
   - Team management
   - Role-based access control

6. **Implement User Impersonation**
   - Customer support feature
   - Debugging tool
   - Audit logging

---

## Support Resources

### WorkOS
- **Documentation:** https://workos.com/docs/user-management
- **Dashboard:** https://dashboard.workos.com
- **Support:** support@workos.com
- **Status:** https://status.workos.com

### Convex
- **Documentation:** https://docs.convex.dev
- **Dashboard:** https://dashboard.convex.dev
- **Discord:** https://convex.dev/community

### Next.js
- **Documentation:** https://nextjs.org/docs
- **GitHub:** https://github.com/vercel/next.js

---

## Rollback Procedure

If something goes wrong:

### Quick Rollback (Keep Both Systems)

1. **Disable WorkOS middleware**
   ```bash
   mv middleware.ts middleware.ts.backup
   ```

2. **Revert to Better Auth**
   - Better Auth files are still present
   - Application will work with in-memory sessions

3. **Fix the issue**
   - Debug the problem
   - Apply fix

4. **Re-enable WorkOS**
   ```bash
   mv middleware.ts.backup middleware.ts
   ```

### Complete Rollback (Remove WorkOS)

1. **Remove WorkOS files**
   ```bash
   rm middleware.ts
   rm -rf src/app/callback
   rm -rf src/app/api/auth/logout
   rm src/lib/hooks/useWorkOS.ts
   rm src/lib/workos-server.ts
   rm convex/users.ts
   ```

2. **Restore Better Auth**
   ```bash
   bun add better-auth @convex-dev/better-auth next-auth
   ```

3. **Revert schema changes**
   - Restore original `convex/schema.ts`
   - Run `convex deploy`

4. **Update layout**
   - Remove `AuthKitProvider`
   - Application returns to previous state

---

## Estimated Time Breakdown

| Phase | Task | Time |
|-------|------|------|
| 1 | WorkOS Dashboard Setup | 15 min |
| 2 | Environment Configuration | 5 min |
| 3 | Install Dependencies | 5 min |
| 4 | Implement Core Files | 2 hours |
| 5 | Update Existing Files | 1 hour |
| 6 | Deploy Convex Schema | 5 min |
| 7 | Testing | 1 hour |
| 8 | Clean Up | 30 min |
| 9 | Documentation | 15 min |
| 10 | Production Deployment | 30 min |
| **Total** | | **~5-6 hours** |

---

## Completion

When all steps are complete:

1. ✅ **Mark all checklist items**
2. ✅ **Test all functionality**
3. ✅ **Deploy to production**
4. ✅ **Document lessons learned**
5. ✅ **Celebrate!** 🎉

---

**Migration guide created by:** Migration Coordinator Agent
**Last updated:** October 16, 2025
**Version:** 1.0

**Good luck with your migration!** 🚀
