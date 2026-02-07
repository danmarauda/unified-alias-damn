# WorkOS Authentication Migration Design

**Date:** 2025-11-02
**Status:** Approved
**Migration Type:** Complete replacement with source project auth

## Overview

Migrate authentication system from simple session cookie checking to sophisticated WorkOS AuthKit implementation with organization-based multi-tenancy, matching the source project at `/Users/alias/Downloads/alias-x-maker-coffee-ai-presentation (1)/alias-awe/alias-enterprise-convex-workos-starter`.

## Goals

1. **Complete auth system replacement** - Replace current middleware with source project's implementation
2. **Organization/onboarding flow** - Implement multi-tenant organization support
3. **Route structure alignment** - Match source project's auth routes exactly
4. **Protect all routes** - Secure all existing feature routes with new auth system

## Current State vs. Target State

### Current Authentication (35 lines)
- Simple session cookie checking (`workos-session`)
- Basic redirect to `/login` for unauthenticated users
- No organization handling
- No session refresh
- Limited route configuration

### Target Authentication (135 lines from source)
- WorkOS AuthKit official library integration
- Session + Organization state management
- Structured route configuration (ROUTE_CONFIG)
- Debug logging for development
- Session refresh error handling
- Organization-based redirects
- Onboarding flow for users without organizations

## Architecture

### 1. Middleware Structure

**Copy source middleware.ts exactly with route adaptations:**

```typescript
import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

// Route configurations - centralized and easier to maintain
const ROUTE_CONFIG = {
  signIn: ['/sign-in', '/sign-up', '/verify', '/reset-password', '/new-password', '/select-organization'],
  protected: [
    // Source project routes
    '/dashboard',
    '/onboarding',
    '/chat',

    // Current project routes (all protected)
    '/agents', '/agents/metrics', '/agents/library', '/agents/designer', '/agents/management',
    '/projects', '/projects/activities',
    '/client-profiles', '/client-profiles/new',
    '/research-hub', '/research-hub/new',
    '/ontology',
    '/knowledge-base',
    '/deploy',
    '/profile',
    '/(dashboard)/skills',
    '/ai-demo',
    '/run-node',
    '/generate-data'
  ],
  skipAuth: ['/api/auth/callback', '/callback', '/api/auth'],
  public: ['/'],
};
```

**Helper functions** (from source):
- `isSignInRoute(pathname)` - Check if route is sign-in related
- `isProtectedRoute(pathname)` - Check if route requires authentication
- `shouldSkipAuthLogic(pathname)` - Check if route bypasses auth
- `createRedirectUrl(request, path)` - Build redirect URLs
- `logMiddleware(message, data)` - Debug logging

**Core middleware logic:**
1. Skip auth for callback/API routes
2. Call `authkit(request, options)` to get session
3. Check `session.user` and `session.organizationId`
4. Redirect authenticated users away from sign-in routes
5. Redirect unauthenticated users from protected routes
6. Handle organization-specific redirects:
   - User without org → `/onboarding`
   - User with org trying to access onboarding → `/dashboard`

### 2. Route Changes

**Rename existing routes:**
- `src/app/login/` → `src/app/sign-in/`

**Create new auth routes:**
- `src/app/sign-up/page.tsx` - Registration page
- `src/app/verify/page.tsx` - Email verification
- `src/app/reset-password/page.tsx` - Password reset request
- `src/app/new-password/page.tsx` - Password reset confirmation
- `src/app/select-organization/page.tsx` - Organization selection
- `src/app/onboarding/page.tsx` - Organization creation/joining

**Create new feature routes:**
- `src/app/chat/page.tsx` - Chat interface (from source)

**Keep existing routes** (all become protected):
- All `/agents/*` routes
- All `/projects/*` routes
- All `/client-profiles/*` routes
- All `/research-hub/*` routes
- Other feature routes

### 3. Authentication Flow

```
User visits protected route
  ↓
Middleware checks session
  ↓
No session? → Redirect to /sign-in with ?redirect=<original-path>
  ↓
Has session + organization? → Allow access
  ↓
Has session but no organization? → Redirect to /onboarding
  ↓
User on /onboarding with organization? → Redirect to /dashboard
```

### 4. Organization Logic

**Session state checked:**
- `session.user` - User authenticated (boolean)
- `session.organizationId` - User has organization (boolean)

**Redirect rules:**
1. **No user + protected route** → `/sign-in?redirect=<path>`
2. **Has user + sign-in route** → `/dashboard` or `/onboarding`
3. **Has user but no org + protected route (except /onboarding)** → `/onboarding`
4. **Has user + org + /onboarding** → `/dashboard`

**Note:** Organization data is stored in WorkOS session, NOT in Convex database (hybrid approach). Organization persistence in Convex can be added later if needed.

### 5. Environment Variables

**Required in `.env.local`:**
```bash
# Convex (existing)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# WorkOS (existing)
WORKOS_CLIENT_ID=client_01...
WORKOS_API_KEY=sk_test_...

# WorkOS (NEW - MUST ADD)
WORKOS_COOKIE_PASSWORD=<32+ character random string>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate cookie password:**
```bash
openssl rand -base64 32
```

### 6. Dependencies

**Check package.json has:**
```json
{
  "dependencies": {
    "@workos-inc/authkit-nextjs": "^2.5.0"
  }
}
```

If version doesn't match source (2.5.0), update and reinstall.

## Implementation Plan

### Phase 1: Middleware Migration
1. Backup current `src/middleware.ts`
2. Copy source middleware.ts
3. Update ROUTE_CONFIG with current project routes
4. Test dev server starts without errors

### Phase 2: Route Renaming
1. `mv src/app/login src/app/sign-in`
2. Update any imports referencing `/login`
3. Update links/redirects pointing to `/login`

### Phase 3: Create Auth Routes
1. Create `src/app/sign-up/page.tsx` (placeholder)
2. Create `src/app/verify/page.tsx` (placeholder)
3. Create `src/app/reset-password/page.tsx` (placeholder)
4. Create `src/app/new-password/page.tsx` (placeholder)
5. Create `src/app/select-organization/page.tsx` (placeholder)
6. Create `src/app/onboarding/page.tsx` (organization setup UI)
7. Create `src/app/chat/page.tsx` (placeholder)

### Phase 4: Environment Configuration
1. Add `WORKOS_COOKIE_PASSWORD` to `.env.local`
2. Verify all WorkOS variables are set
3. Test environment validation

### Phase 5: Testing
1. Test unauthenticated redirect to `/sign-in`
2. Test authenticated access to protected routes
3. Test organization-based redirects
4. Test session refresh
5. Update E2E tests for new auth flows

### Phase 6: Cleanup
1. Remove old login route files
2. Update documentation
3. Commit changes with descriptive message

## Migration Checklist

- [ ] Backup current middleware.ts
- [ ] Copy source middleware.ts
- [ ] Update ROUTE_CONFIG
- [ ] Rename /login → /sign-in
- [ ] Create 7 new auth route pages
- [ ] Add WORKOS_COOKIE_PASSWORD
- [ ] Test auth flows
- [ ] Update E2E tests
- [ ] Update documentation
- [ ] Commit changes

## Success Criteria

1. ✅ Dev server starts without middleware errors
2. ✅ Unauthenticated users redirect to `/sign-in`
3. ✅ Authenticated users can access all protected routes
4. ✅ Organization logic works (onboarding redirect)
5. ✅ Session refresh works without errors
6. ✅ Debug logging appears in development
7. ✅ All existing routes remain protected

## Risks & Mitigation

**Risk:** Breaking existing authenticated sessions
**Mitigation:** Users may need to log in again after migration

**Risk:** Route path mismatches causing infinite redirects
**Mitigation:** Test each route individually, check middleware logs

**Risk:** Missing WORKOS_COOKIE_PASSWORD causes auth failure
**Mitigation:** Add environment variable validation on startup

**Risk:** Organization flow blocks access to features
**Mitigation:** Onboarding page provides clear organization setup

## Rollback Plan

If migration fails:
1. Restore backed up `src/middleware.ts`
2. Revert route renames (`sign-in` → `login`)
3. Remove new auth route pages
4. Restart dev server

## Future Enhancements

- Add organization persistence to Convex schema
- Implement team/member management
- Add organization switching UI
- Create comprehensive onboarding wizard
- Add organization-scoped data queries

## References

- Source project: `/Users/alias/Downloads/alias-x-maker-coffee-ai-presentation (1)/alias-awe/alias-enterprise-convex-workos-starter`
- WorkOS AuthKit docs: https://workos.com/docs/authkit
- Next.js middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
