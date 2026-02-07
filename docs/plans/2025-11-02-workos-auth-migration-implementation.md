# WorkOS Authentication Migration - Implementation Plan

**Date:** 2025-11-02
**Branch:** `feature/workos-auth-migration`
**Worktree:** `.worktrees/workos-auth-migration`
**Status:** Ready for execution

## Prerequisites Verification

Before starting implementation, verify these conditions:

```bash
# 1. Confirm worktree is active
git worktree list
# Should show: .worktrees/workos-auth-migration ... [feature/workos-auth-migration]

# 2. Verify dependencies installed
cd .worktrees/workos-auth-migration
bun install
# Should show: "Checked X installs across Y packages (no changes)"

# 3. Confirm source middleware exists
ls -la /Users/alias/Downloads/alias-x-maker-coffee-ai-presentation\ \(1\)/alias-awe/alias-enterprise-convex-workos-starter/src/middleware.ts
# Should show: middleware.ts file

# 4. Verify WorkOS package version
grep "@workos-inc/authkit-nextjs" package.json
# Should show: "@workos-inc/authkit-nextjs": "^2.11.0"
```

## Phase 1: Middleware Migration

**Objective:** Replace simple middleware (35 lines) with sophisticated WorkOS AuthKit middleware (135 lines)

### Step 1.1: Backup Current Middleware

```bash
# Create backup
cp src/middleware.ts src/middleware.ts.backup

# Verify backup
ls -la src/middleware.ts*
# Should show both middleware.ts and middleware.ts.backup
```

**Verification:**
- [ ] `src/middleware.ts.backup` exists
- [ ] Backup file is 35 lines (simple implementation)

### Step 1.2: Copy Source Middleware

**Source Location:**
`/Users/alias/Downloads/alias-x-maker-coffee-ai-presentation (1)/alias-awe/alias-enterprise-convex-workos-starter/src/middleware.ts`

**Target Location:**
`src/middleware.ts`

```bash
# Copy source middleware
cp "/Users/alias/Downloads/alias-x-maker-coffee-ai-presentation (1)/alias-awe/alias-enterprise-convex-workos-starter/src/middleware.ts" src/middleware.ts

# Verify copy
wc -l src/middleware.ts
# Should show: ~135 lines

# Verify imports
head -5 src/middleware.ts
# Should show: import { authkit } from "@workos-inc/authkit-nextjs"
```

**Verification:**
- [ ] New middleware is 135 lines
- [ ] Contains `import { authkit }` statement
- [ ] Contains `ROUTE_CONFIG` object
- [ ] No syntax errors: `bunx tsc --noEmit`

### Step 1.3: Update ROUTE_CONFIG

**File:** `src/middleware.ts`

**Find this section (lines 8-15):**
```typescript
const ROUTE_CONFIG = {
  signIn: ['/sign-in', '/sign-up', '/verify', '/reset-password', '/new-password', '/select-organization'],
  protected: ['/dashboard', '/onboarding', '/chat'],
  skipAuth: ['/api/auth/callback', '/api/auth/oauth-url'],
  public: ['/'],
};
```

**Replace with:**
```typescript
const ROUTE_CONFIG = {
  signIn: ['/sign-in', '/sign-up', '/verify', '/reset-password', '/new-password', '/select-organization'],
  protected: [
    // Source project routes
    '/dashboard',
    '/onboarding',
    '/chat',

    // Current project routes (all protected)
    '/agents',
    '/agents/metrics',
    '/agents/library',
    '/agents/designer',
    '/agents/management',
    '/projects',
    '/projects/activities',
    '/client-profiles',
    '/client-profiles/new',
    '/research-hub',
    '/research-hub/new',
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

**Verification:**
- [ ] ROUTE_CONFIG has 4 keys: signIn, protected, skipAuth, public
- [ ] protected array contains 22 routes (3 source + 19 current)
- [ ] No syntax errors: `bunx tsc --noEmit`
- [ ] Middleware compiles: `bunx next build --dry-run`

### Step 1.4: Test Development Server

```bash
# Start dev server
bun run dev

# In browser, test:
# 1. Navigate to http://localhost:3000
# 2. Should redirect to /sign-in (since route doesn't exist yet, will 404)
# 3. Check terminal for middleware logs:
#    "🔍 Middleware - ..." messages should appear

# Stop dev server (Ctrl+C)
```

**Verification:**
- [ ] Server starts without errors
- [ ] Middleware logs appear in terminal
- [ ] No TypeScript compilation errors
- [ ] No module resolution errors

**Checkpoint:** Middleware replacement complete. Commit changes:
```bash
git add src/middleware.ts src/middleware.ts.backup
git commit -m "feat: replace middleware with WorkOS AuthKit implementation

- Copy sophisticated middleware from source project (135 lines)
- Add ROUTE_CONFIG with all current routes protected
- Include session + organization checks
- Add debug logging for development
- Backup old middleware (35 lines)

Ref: docs/plans/2025-11-02-workos-auth-migration-design.md"
```

---

## Phase 2: Route Renaming

**Objective:** Rename `/login` to `/sign-in` to match source project conventions

### Step 2.1: Rename Login Directory

```bash
# Check current structure
ls -la src/app/login/
# Should show: page.tsx and possibly other files

# Rename directory
mv src/app/login src/app/sign-in

# Verify rename
ls -la src/app/ | grep sign
# Should show: sign-in/ directory
```

**Verification:**
- [ ] `src/app/sign-in/` directory exists
- [ ] `src/app/login/` directory no longer exists
- [ ] All files moved (check with `ls src/app/sign-in/`)

### Step 2.2: Update Login Route References

**Search for all /login references:**
```bash
# Find all files referencing /login
grep -r "'/login'" src/ --include="*.tsx" --include="*.ts"
grep -r '"/login"' src/ --include="*.tsx" --include="*.ts"

# Common locations to check:
# - src/components/layout/Header.tsx (navigation links)
# - src/lib/auth.ts (redirect paths)
# - Any auth-related utilities
```

**Files to update (if they exist):**

**1. Header Navigation (if exists):**
```typescript
// Before: href="/login"
// After:  href="/sign-in"
```

**2. Auth Utilities (if exists):**
```typescript
// Before: return '/login'
// After:  return '/sign-in'
```

**3. Redirect Logic (if exists):**
```typescript
// Before: redirect('/login')
// After:  redirect('/sign-in')
```

**Verification:**
- [ ] No references to `/login` remain: `grep -r "/login" src/`
- [ ] All references updated to `/sign-in`
- [ ] TypeScript compiles: `bunx tsc --noEmit`

### Step 2.3: Test Sign-In Route

```bash
# Start dev server
bun run dev

# Test in browser:
# 1. Navigate to http://localhost:3000/sign-in
# 2. Page should load (WorkOS login UI)
# 3. Navigate to http://localhost:3000/login
# 4. Should 404 (route no longer exists)
```

**Verification:**
- [ ] `/sign-in` route renders successfully
- [ ] `/login` route returns 404
- [ ] No console errors in browser
- [ ] No middleware errors in terminal

**Checkpoint:** Route renaming complete. Commit changes:
```bash
git add src/app/sign-in/ src/
git commit -m "refactor: rename /login to /sign-in for consistency

- Rename src/app/login/ to src/app/sign-in/
- Update all route references throughout codebase
- Align with WorkOS AuthKit conventions

Ref: docs/plans/2025-11-02-workos-auth-migration-design.md"
```

---

## Phase 3: Create Auth Routes

**Objective:** Create 7 new authentication routes to complete WorkOS flow

### Routes to Create

1. `/sign-up` - User registration
2. `/verify` - Email verification
3. `/reset-password` - Password reset request
4. `/new-password` - Password reset confirmation
5. `/select-organization` - Organization selection
6. `/onboarding` - Organization creation/joining
7. `/chat` - Chat interface (feature route)

### Step 3.1: Create Sign-Up Route

**File:** `src/app/sign-up/page.tsx`

```typescript
'use client';

import { signUp } from "@workos-inc/authkit-nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to get started
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await signUp();
          }}
          className="mt-8 space-y-6"
        >
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up with WorkOS
          </button>
        </form>

        <div className="text-center">
          <a href="/sign-in" className="text-sm text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Verification:**
- [ ] File created at `src/app/sign-up/page.tsx`
- [ ] TypeScript compiles: `bunx tsc --noEmit`
- [ ] Route accessible: `http://localhost:3000/sign-up`
- [ ] Button triggers WorkOS sign-up flow

### Step 3.2: Create Verify Route

**File:** `src/app/verify/page.tsx`

```typescript
'use client';

import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to
          </p>
          {email && (
            <p className="mt-1 text-sm font-medium text-gray-900">{email}</p>
          )}
          <p className="mt-4 text-xs text-gray-500">
            Click the link in the email to verify your account
          </p>
        </div>

        <div className="text-center">
          <a href="/sign-in" className="text-sm text-blue-600 hover:text-blue-500">
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.3: Create Reset Password Routes

**File:** `src/app/reset-password/page.tsx`

```typescript
'use client';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send reset link
          </button>
        </form>

        <div className="text-center">
          <a href="/sign-in" className="text-sm text-blue-600 hover:text-blue-500">
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
```

**File:** `src/app/new-password/page.tsx`

```typescript
'use client';

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="New password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Step 3.4: Create Select Organization Route

**File:** `src/app/select-organization/page.tsx`

```typescript
'use client';

export default function SelectOrganizationPage() {
  // Placeholder: WorkOS will handle organization selection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Select Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose the organization you want to access
          </p>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <p className="font-medium text-gray-900">Loading organizations...</p>
          </div>
        </div>

        <div className="text-center">
          <a href="/onboarding" className="text-sm text-blue-600 hover:text-blue-500">
            Create new organization
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.5: Create Onboarding Route

**File:** `src/app/onboarding/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Create organization via WorkOS API
    // For now, just redirect to dashboard
    console.log('Creating organization:', organizationName);

    // After organization creation, redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your organization
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set up your workspace to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="organization-name" className="block text-sm font-medium text-gray-700">
              Organization name
            </label>
            <input
              id="organization-name"
              name="organization-name"
              type="text"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Acme Inc."
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create organization
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            You can invite team members after setup
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.6: Create Chat Route

**File:** `src/app/chat/page.tsx`

```typescript
'use client';

export default function ChatPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Chat Interface</h1>
        <p className="text-gray-600 mb-8">
          AI-powered chat coming soon
        </p>

        <div className="border border-gray-300 rounded-lg p-4 min-h-[500px] bg-white">
          <p className="text-gray-400 text-center py-20">
            Chat interface placeholder
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.7: Verify All Routes

```bash
# Test each route in browser:
# 1. http://localhost:3000/sign-up
# 2. http://localhost:3000/verify
# 3. http://localhost:3000/reset-password
# 4. http://localhost:3000/new-password
# 5. http://localhost:3000/select-organization
# 6. http://localhost:3000/onboarding
# 7. http://localhost:3000/chat

# Check for TypeScript errors
bunx tsc --noEmit

# Check file structure
ls -la src/app/ | grep -E "(sign|verify|reset|new-password|select|onboarding|chat)"
```

**Verification:**
- [ ] All 7 routes created
- [ ] All routes render without errors
- [ ] No TypeScript compilation errors
- [ ] Middleware logs show correct route handling

**Checkpoint:** Auth routes created. Commit changes:
```bash
git add src/app/sign-up/ src/app/verify/ src/app/reset-password/ src/app/new-password/ src/app/select-organization/ src/app/onboarding/ src/app/chat/
git commit -m "feat: add WorkOS authentication routes

- Add sign-up route (user registration)
- Add verify route (email confirmation)
- Add reset-password route (password reset request)
- Add new-password route (password reset confirmation)
- Add select-organization route (org selection)
- Add onboarding route (org creation/joining)
- Add chat route (feature placeholder)

All routes follow WorkOS AuthKit patterns.

Ref: docs/plans/2025-11-02-workos-auth-migration-design.md"
```

---

## Phase 4: Environment Configuration

**Objective:** Add required environment variable for WorkOS cookie encryption

### Step 4.1: Generate Cookie Password

```bash
# Generate secure random string (32+ characters)
openssl rand -base64 32
# Copy output, e.g.: "Kd8sF2jL9mN3pQ6rT8vX1yZ4aC5bD7eF"
```

### Step 4.2: Update .env.local

**File:** `.env.local`

**Add this line:**
```bash
WORKOS_COOKIE_PASSWORD=<paste-generated-string-here>
```

**Complete .env.local should have:**
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://optimistic-badger-760.convex.cloud
CONVEX_DEPLOYMENT=dev:optimistic-badger-760

# WorkOS
WORKOS_CLIENT_ID=<your-client-id>
WORKOS_API_KEY=sk_test_<your-api-key>
WORKOS_COOKIE_PASSWORD=<your-generated-password>

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
```

**Verification:**
- [ ] `WORKOS_COOKIE_PASSWORD` added to `.env.local`
- [ ] Value is 32+ characters
- [ ] All WorkOS variables present (CLIENT_ID, API_KEY, COOKIE_PASSWORD)
- [ ] `.env.local` is in `.gitignore` (should NOT be committed)

### Step 4.3: Verify Environment Loading

```bash
# Restart dev server to load new env var
bun run dev

# In another terminal, check if env var is loaded
node -e "console.log(process.env.WORKOS_COOKIE_PASSWORD ? 'LOADED' : 'NOT LOADED')"
# Should print: LOADED
```

**Verification:**
- [ ] Server starts without "missing WORKOS_COOKIE_PASSWORD" errors
- [ ] Environment variable loads correctly
- [ ] No middleware authentication errors

**Note:** DO NOT commit `.env.local` to git. This file should remain local only.

---

## Phase 5: Testing

**Objective:** Verify complete authentication flow works end-to-end

### Step 5.1: Test Unauthenticated Access

```bash
# Start dev server in clean state (clear cookies first)
bun run dev
```

**Browser Tests:**
1. Clear all cookies: DevTools → Application → Cookies → Clear All
2. Navigate to `http://localhost:3000/agents`
3. **Expected:** Redirect to `/sign-in?redirect=/agents`
4. **Verify:** URL contains redirect parameter
5. Navigate to `http://localhost:3000/dashboard`
6. **Expected:** Redirect to `/sign-in?redirect=/dashboard`

**Verification:**
- [ ] Unauthenticated users redirect to `/sign-in`
- [ ] Redirect parameter preserves original path
- [ ] No infinite redirect loops
- [ ] Middleware logs show "Redirect to sign-in" messages

### Step 5.2: Test WorkOS Login Flow

**Prerequisites:** Valid WorkOS test account

**Steps:**
1. Navigate to `http://localhost:3000/sign-in`
2. Click "Sign in with WorkOS"
3. Complete WorkOS authentication (follow prompts)
4. Should redirect to callback: `http://localhost:3000/callback`
5. Should then redirect to:
   - `/onboarding` if no organization
   - `/dashboard` if organization exists

**Verification:**
- [ ] WorkOS OAuth flow completes successfully
- [ ] Callback route processes auth code
- [ ] Session cookie created (`workos-session`)
- [ ] User redirected based on organization status

### Step 5.3: Test Protected Route Access

**After successful login:**

**Browser Tests:**
1. Navigate to `http://localhost:3000/agents`
   - **Expected:** Page loads (no redirect)
2. Navigate to `http://localhost:3000/projects`
   - **Expected:** Page loads
3. Navigate to `http://localhost:3000/client-profiles`
   - **Expected:** Page loads
4. Check middleware logs
   - **Expected:** "User has session" messages

**Verification:**
- [ ] All protected routes accessible when authenticated
- [ ] No unexpected redirects
- [ ] Session persists across navigation
- [ ] Middleware logs show session validation

### Step 5.4: Test Organization Logic

**Scenario 1: User without organization**
1. Clear cookies, log in
2. After auth callback, should redirect to `/onboarding`
3. Try to access `/dashboard` directly
4. **Expected:** Redirect back to `/onboarding`

**Scenario 2: User with organization**
1. Complete onboarding (create organization)
2. Should redirect to `/dashboard`
3. Try to access `/onboarding` directly
4. **Expected:** Redirect to `/dashboard`

**Verification:**
- [ ] Users without org cannot bypass `/onboarding`
- [ ] Users with org cannot access `/onboarding`
- [ ] Organization state checked on every request

### Step 5.5: Test Sign-Out

```bash
# Navigate to sign-out endpoint (if exists)
# OR manually delete session cookie

# After sign-out:
# 1. Navigate to /dashboard
# 2. Expected: Redirect to /sign-in
```

**Verification:**
- [ ] Sign-out clears session
- [ ] Protected routes become inaccessible
- [ ] Redirect to `/sign-in` works

### Step 5.6: Update E2E Tests

**File:** `tests/e2e/01-authentication.spec.ts`

**Update test to match new auth flow:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    await page.goto('http://localhost:3000/agents');

    // Should redirect to sign-in with redirect parameter
    await expect(page).toHaveURL(/\/sign-in\?redirect=/);
  });

  test('should display sign-in page elements', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');

    // Check for WorkOS sign-in elements
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('should handle organization onboarding', async ({ page }) => {
    // Skip if no test credentials available
    test.skip(!process.env.WORKOS_TEST_EMAIL, 'No test credentials');

    // TODO: Complete auth flow and verify onboarding redirect
    // This requires WorkOS test environment setup
  });
});
```

**Run E2E tests:**
```bash
bunx playwright test tests/e2e/01-authentication.spec.ts
```

**Verification:**
- [ ] Updated tests pass
- [ ] Tests reflect new `/sign-in` route (not `/login`)
- [ ] Tests verify redirect behavior
- [ ] No test failures

**Checkpoint:** Testing complete. Commit changes:
```bash
git add tests/e2e/01-authentication.spec.ts
git commit -m "test: update E2E tests for WorkOS authentication

- Update login route to /sign-in
- Add organization onboarding test (skipped without credentials)
- Verify redirect parameters preserved
- Add sign-out flow verification

Ref: docs/plans/2025-11-02-workos-auth-migration-design.md"
```

---

## Phase 6: Cleanup & Finalization

**Objective:** Remove backup files, update documentation, merge to main

### Step 6.1: Remove Backup Files

```bash
# List backup files
ls src/middleware.ts*
# Should show: middleware.ts and middleware.ts.backup

# Remove backup (implementation confirmed working)
rm src/middleware.ts.backup

# Verify removal
ls src/middleware.ts*
# Should show only: middleware.ts
```

**Verification:**
- [ ] `middleware.ts.backup` removed
- [ ] Only `middleware.ts` remains

### Step 6.2: Update Project Documentation

**File:** `CLAUDE.md`

**Find the "Authentication" section and update:**

```markdown
### Authentication Flow

**Prerequisites:** Valid WorkOS test account

**Steps:**
- Middleware (`middleware.ts`) handles all authentication via WorkOS AuthKit
- Public routes: `/sign-in`, `/sign-up`, `/verify`, `/reset-password`, `/new-password`, `/select-organization`, `/callback` (unauthenticated access)
- All other routes require authentication
- User data synced to Convex `users` table with WorkOS user ID
- Session + organization state managed automatically by WorkOS
- Organization-based redirects:
  - User without org → `/onboarding`
  - User with org trying to access `/onboarding` → `/dashboard`
```

**File:** `README.md`

**Update Authentication Setup section:**

```markdown
### Authentication Setup

1. **Configure WorkOS Dashboard**:
   - Redirect URIs: `http://localhost:3000/callback` (dev), `https://your-domain.com/callback` (prod)
   - Initiate Login URL: `http://localhost:3000/sign-in`
   - Logout Redirect: `http://localhost:3000`

2. **Environment Variables** (`.env.local`):
   ```bash
   WORKOS_CLIENT_ID=client_xxx
   WORKOS_API_KEY=sk_test_xxx
   WORKOS_COOKIE_PASSWORD=<generate with: openssl rand -base64 32>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
   ```

3. **Protected Routes**: All routes except `/sign-in`, `/sign-up`, `/verify`, `/reset-password`, `/new-password`, `/select-organization`, and `/callback` require authentication (controlled by middleware)
```

### Step 6.3: Final Verification

```bash
# Run full build
bun run build

# Expected output:
# - Next.js build succeeds
# - Convex deployment succeeds
# - No TypeScript errors
# - No middleware errors

# Run linting
bun run lint

# Expected output:
# - No lint errors
# - No type errors
```

**Verification:**
- [ ] Production build succeeds
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] All tests pass: `bun run test`

### Step 6.4: Commit Final Changes

```bash
# Stage all remaining changes
git add .

# Create final commit
git commit -m "docs: update authentication documentation

- Update CLAUDE.md with new auth flow
- Update README.md with WorkOS setup instructions
- Document organization-based redirects
- Add environment variable requirements

Ref: docs/plans/2025-11-02-workos-auth-migration-design.md"
```

### Step 6.5: Merge to Main Branch

```bash
# Switch back to main working directory
cd /Users/alias/Desktop/website/unified-alias-damn

# Update main branch
git checkout main
git pull origin main

# Merge feature branch
git merge feature/workos-auth-migration

# Push to remote
git push origin main

# Remove worktree (cleanup)
git worktree remove .worktrees/workos-auth-migration

# Delete feature branch (optional)
git branch -d feature/workos-auth-migration
```

**Verification:**
- [ ] Merge completes without conflicts
- [ ] All commits in main branch
- [ ] Remote updated successfully
- [ ] Worktree cleaned up

---

## Success Criteria Checklist

After completing all phases, verify these criteria:

- [ ] ✅ Dev server starts without middleware errors
- [ ] ✅ Unauthenticated users redirect to `/sign-in`
- [ ] ✅ Authenticated users can access all protected routes
- [ ] ✅ Organization logic works (onboarding redirect)
- [ ] ✅ Session refresh works without errors
- [ ] ✅ Debug logging appears in development
- [ ] ✅ All existing routes remain protected
- [ ] ✅ E2E tests updated and passing
- [ ] ✅ Documentation updated
- [ ] ✅ Merged to main branch

---

## Rollback Procedure

If migration fails or causes critical issues:

### Quick Rollback

```bash
# 1. Restore backed up middleware
cd /Users/alias/Desktop/website/unified-alias-damn
cp src/middleware.ts.backup src/middleware.ts

# 2. Revert route rename
mv src/app/sign-in src/app/login

# 3. Remove new auth routes
rm -rf src/app/sign-up src/app/verify src/app/reset-password src/app/new-password src/app/select-organization src/app/onboarding src/app/chat

# 4. Restart server
bun run dev
```

### Complete Rollback

```bash
# If changes committed, revert entire branch
git checkout main
git branch -D feature/workos-auth-migration
git worktree remove .worktrees/workos-auth-migration --force

# Or revert specific commits
git revert <commit-hash>
```

---

## Troubleshooting

### Issue: "Missing WORKOS_COOKIE_PASSWORD"

**Solution:**
```bash
# Generate new password
openssl rand -base64 32

# Add to .env.local
echo "WORKOS_COOKIE_PASSWORD=<generated-value>" >> .env.local

# Restart dev server
```

### Issue: Infinite redirect loop

**Solution:**
- Check middleware logs for redirect logic
- Verify ROUTE_CONFIG has no overlapping routes
- Clear browser cookies and try again
- Check session cookie exists: DevTools → Application → Cookies

### Issue: "Cannot find module @workos-inc/authkit-nextjs"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
bun install

# Verify version
grep "@workos-inc/authkit-nextjs" package.json
# Should show: "^2.11.0"
```

### Issue: TypeScript errors after middleware copy

**Solution:**
```bash
# Check for missing imports
bunx tsc --noEmit

# Common fixes:
# - Add "use client" if client-side code
# - Import NextRequest, NextResponse types
# - Check ROUTE_CONFIG syntax
```

---

## Post-Migration Tasks

After successful migration:

1. **User Communication:**
   - Inform users of login route change (`/login` → `/sign-in`)
   - Update any bookmarks or saved links

2. **Monitoring:**
   - Monitor middleware logs for errors
   - Watch session refresh errors
   - Track organization creation flow

3. **Future Enhancements:**
   - Add organization persistence to Convex schema
   - Implement team/member management
   - Add organization switching UI
   - Create comprehensive onboarding wizard
   - Add organization-scoped data queries

4. **Documentation:**
   - Update API documentation with new routes
   - Create user guide for organization setup
   - Document SSO/SAML integration (if needed)

---

## References

- **Design Document:** `docs/plans/2025-11-02-workos-auth-migration-design.md`
- **Source Project:** `/Users/alias/Downloads/alias-x-maker-coffee-ai-presentation (1)/alias-awe/alias-enterprise-convex-workos-starter`
- **WorkOS AuthKit Docs:** https://workos.com/docs/authkit
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **WorkOS Node SDK:** https://workos.com/docs/sdks/nodejs

---

**Implementation Status:** Ready for execution
**Estimated Time:** 2-3 hours
**Risk Level:** Medium (complete replacement, not incremental)
**Rollback Time:** 5-10 minutes
