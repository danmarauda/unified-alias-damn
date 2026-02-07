# WorkOS Migration - Quick Start

**Time to complete: 30 minutes**

This is the condensed version for rapid migration. For full details, see [WORKOS_MIGRATION_GUIDE.md](./WORKOS_MIGRATION_GUIDE.md).

---

## Prerequisites

1. **WorkOS Account:** Sign up at [https://dashboard.workos.com](https://dashboard.workos.com)
2. **API Keys:** Get your API Key and Client ID from WorkOS Dashboard
3. **Cookie Password:** Generate with `openssl rand -base64 32`

---

## Step 1: Install Dependencies (1 minute)

```bash
# Remove Better Auth
bun remove better-auth @convex-dev/better-auth next-auth

# Install WorkOS
bun add @workos-inc/authkit-nextjs
```

---

## Step 2: Environment Variables (2 minutes)

Update `.env.local`:

```bash
# WorkOS Configuration
WORKOS_API_KEY='sk_test_...'
WORKOS_CLIENT_ID='client_...'
WORKOS_COOKIE_PASSWORD='<openssl-rand-base64-32>'
NEXT_PUBLIC_WORKOS_REDIRECT_URI='http://localhost:3000/callback'
```

---

## Step 3: WorkOS Dashboard Configuration (3 minutes)

In [WorkOS Dashboard](https://dashboard.workos.com):

1. **Redirect URIs:**
   - `http://localhost:3000/callback`
   - `https://your-domain.com/callback` (production)

2. **Initiate Login URL:**
   - `http://localhost:3000/login`

3. **Logout Redirect:**
   - `http://localhost:3000`

---

## Step 4: Create Core Files (10 minutes)

### `middleware.ts` (root)

```typescript
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  publicRoutes: ['/', '/login', '/callback'],
  middlewareAuth: {
    enabled: true,
    unauthenticatedUrl: '/login',
  },
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*

)'],
};
```

### `src/app/callback/route.ts`

```typescript
import { handleAuth } from '@workos-inc/authkit-nextjs';
export const GET = handleAuth();
```

### `src/app/login/route.ts`

```typescript
import { getAuthorizationUrl } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const authorizationUrl = await getAuthorizationUrl({ screenHint: 'sign-in' });
  return NextResponse.redirect(authorizationUrl);
}
```

### `src/app/api/auth/logout/route.ts`

```typescript
import { getSignOutUrl } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const signOutUrl = await getSignOutUrl();
  return NextResponse.redirect(signOutUrl);
}
```

### Update `src/app/layout.tsx`

```typescript
import { AuthKitProvider } from '@workos-inc/authkit-nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthKitProvider>
          {/* Your existing providers */}
          {children}
        </AuthKitProvider>
      </body>
    </html>
  );
}
```

---

## Step 5: Update Convex Schema (5 minutes)

Update `convex/schema.ts`:

```typescript
users: defineTable({
  workosUserId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  profilePictureUrl: v.optional(v.string()),
  emailVerified: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_workos_id", ["workosUserId"])
  .index("by_email", ["email"]),
```

Create `convex/users.ts`:

```typescript
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

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
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosUserId', args.workosUserId))
      .first();

    if (existingUser) {
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

    const userId = await ctx.db.insert('users', {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId };
  },
});

export const getByWorkOSId = query({
  args: { workosUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosUserId', args.workosUserId))
      .first();
  },
});
```

---

## Step 6: Create Auth Hook (3 minutes)

Create `src/lib/hooks/useWorkOS.ts`:

```typescript
'use client';

import { useAuth } from '@workos-inc/authkit-nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useEffect } from 'react';

export function useWorkOS() {
  const { user: workosUser, isLoading } = useAuth();

  const convexUser = useQuery(
    api.users.getByWorkOSId,
    workosUser ? { workosUserId: workosUser.id } : 'skip'
  );

  const syncUser = useMutation(api.users.syncFromWorkOS);

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
    workosUser,
    convexUser,
    isLoading,
    isAuthenticated: !!workosUser,
  };
}
```

---

## Step 7: Server-Side Auth Helper (2 minutes)

Create `src/lib/workos-server.ts`:

```typescript
import { withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  return withAuth({
    ensureSignedIn: true,
    onUnauthenticated: () => redirect('/login'),
  });
}

export async function getOptionalAuth() {
  return withAuth();
}
```

---

## Step 8: Delete Old Files (1 minute)

```bash
rm src/lib/auth.ts
rm src/lib/auth-client.ts
rm src/app/api/auth/[...all]/route.ts
rm convex/auth.ts
```

Update `convex/http.ts`:

```typescript
import { httpRouter } from "convex/server";
const http = httpRouter();
export default http;
```

---

## Step 9: Update Components (3 minutes)

### Header Component

```typescript
'use client';

import { useWorkOS } from '@/lib/hooks/useWorkOS';

export function Header() {
  const { workosUser, isLoading } = useWorkOS();

  return (
    <header>
      {isLoading ? (
        <div>Loading...</div>
      ) : workosUser ? (
        <>
          <span>{workosUser.email}</span>
          <a href="/api/auth/logout">Sign Out</a>
        </>
      ) : (
        <a href="/login">Sign In</a>
      )}
    </header>
  );
}
```

### Protected Page Example

```typescript
import { requireAuth } from '@/lib/workos-server';

export default async function ProtectedPage() {
  const { user } = await requireAuth();

  return <div>Welcome, {user.email}!</div>;
}
```

---

## Step 10: Test (5 minutes)

```bash
# Start development
bun run dev

# Open browser
open http://localhost:3000
```

### Test Checklist

- [ ] Click "Sign In" → Redirects to WorkOS AuthKit
- [ ] Sign up with email/password
- [ ] Verify email (check inbox)
- [ ] Should redirect back to app
- [ ] Should see user email in header
- [ ] Refresh page → Should stay signed in
- [ ] Click "Sign Out" → Should log out
- [ ] Try accessing protected route while logged out → Redirects to login
- [ ] Check Convex Dashboard → User should be in `users` table

---

## Troubleshooting

### "Invalid redirect URI"
- Ensure redirect URI in WorkOS Dashboard exactly matches `NEXT_PUBLIC_WORKOS_REDIRECT_URI`
- Include protocol (`http://` or `https://`)

### "User not syncing to Convex"
- Check browser console for errors
- Verify `convex/users.ts` is deployed
- Check Convex Dashboard for function logs

### "Session not persisting"
- Ensure `WORKOS_COOKIE_PASSWORD` is set and at least 32 characters
- Check browser cookies (should see `wos-session`)

### "Middleware not working"
- Verify `middleware.ts` is in root directory (not `src/`)
- Check `matcher` pattern includes your routes

---

## Production Deployment

1. **Update environment variables** in Netlify/Vercel:
   ```bash
   WORKOS_API_KEY='sk_prod_...'
   WORKOS_CLIENT_ID='client_...'
   WORKOS_COOKIE_PASSWORD='<secure-password>'
   NEXT_PUBLIC_WORKOS_REDIRECT_URI='https://your-domain.com/callback'
   ```

2. **Update WorkOS Dashboard** with production URLs

3. **Deploy:**
   ```bash
   bun run build
   # Netlify auto-deploys
   ```

---

## Done! 🎉

Your app now has:
- ✅ Persistent sessions (survives restarts)
- ✅ Production-ready authentication
- ✅ Enterprise SSO ready
- ✅ Automatic session refresh
- ✅ Secure cookie management

**Next Steps:**
- Enable SSO for enterprise customers
- Customize AuthKit branding
- Add multi-factor authentication
- Set up webhooks for events

For detailed documentation, see [WORKOS_MIGRATION_GUIDE.md](./WORKOS_MIGRATION_GUIDE.md)
