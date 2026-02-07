# WorkOS Migration Test Plan

## Overview
This document outlines comprehensive test scenarios for migrating from Better Auth to WorkOS AuthKit. The migration affects authentication flows, session management, and user synchronization with Convex.

## Pre-Migration Checklist

- [ ] Review `docs/MIGRATION_GUIDE.md`
- [ ] Backup database (Convex export)
- [ ] Create `.env.local.backup` copy
- [ ] Run `scripts/test-workos-config.sh` to validate configuration
- [ ] Run `scripts/validate-migration.sh` to verify file changes

## Test Environment Setup

### Required Environment Variables

```bash
# WorkOS Configuration (Required)
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...
WORKOS_COOKIE_PASSWORD=<32+ character random string>
WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Convex (Existing)
NEXT_PUBLIC_CONVEX_URL=https://...
CONVEX_DEPLOYMENT=...

# Application (Existing)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate WORKOS_COOKIE_PASSWORD

```bash
# Generate secure random password (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Validation Commands

```bash
# 1. Validate environment configuration
chmod +x scripts/test-workos-config.sh
./scripts/test-workos-config.sh

# 2. Validate migration file changes
chmod +x scripts/validate-migration.sh
./scripts/validate-migration.sh

# 3. Install dependencies
bun install

# 4. Run type checking
npm run lint

# 5. Start development servers
npm run dev
```

## Manual Test Scenarios

### 1. Sign Up Flow

**Objective:** Verify new users can create accounts via WorkOS AuthKit

**Prerequisites:**
- Development server running (`npm run dev`)
- Unauthenticated browser session (incognito mode)

**Test Steps:**
1. Navigate to `http://localhost:3000/login`
2. Click "Sign Up" or register link
3. Enter email address: `test+new@example.com`
4. Complete WorkOS verification flow (check email for code)
5. Enter verification code
6. Redirected to dashboard (`/`)

**Expected Results:**
- ✅ User redirected to WorkOS AuthKit UI
- ✅ Email verification code sent
- ✅ After verification, redirected to dashboard
- ✅ User session persists across page refreshes
- ✅ New user created in Convex `users` table
- ✅ User ID matches WorkOS user ID

**Verification Commands:**
```bash
# Check Convex for new user
npx convex dev --once --run="async (ctx) => {
  const users = await ctx.db.query('users').collect();
  console.log('Users:', users);
}"
```

**Edge Cases:**
- [ ] Email already exists - should show error
- [ ] Invalid email format - should show validation error
- [ ] Network timeout during registration - should retry
- [ ] Browser back button during flow - should maintain state

---

### 2. Sign In Flow

**Objective:** Verify existing users can authenticate

**Prerequisites:**
- User already registered (from Sign Up test)
- Signed out state

**Test Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter email: `test+new@example.com`
3. Complete WorkOS sign-in flow
4. Redirected to dashboard

**Expected Results:**
- ✅ User redirected to WorkOS AuthKit UI
- ✅ Authentication code sent to email
- ✅ After code entry, redirected to dashboard
- ✅ User session loaded from Convex
- ✅ User data displayed correctly (email, profile)

**Verification Commands:**
```bash
# Check session in browser DevTools
localStorage.getItem('workos-session')

# Check cookies
document.cookie
```

**Edge Cases:**
- [ ] Wrong email - should show error
- [ ] Expired verification code - should allow retry
- [ ] Multiple sign-in attempts - should not create duplicate users
- [ ] Sign in while already authenticated - should redirect to dashboard

---

### 3. Sign Out Flow

**Objective:** Verify session termination and cleanup

**Prerequisites:**
- Authenticated user session

**Test Steps:**
1. Navigate to dashboard (`/`)
2. Click "Sign Out" button in header
3. Verify redirect to login page
4. Attempt to navigate back to dashboard
5. Verify redirect to login (protected route)

**Expected Results:**
- ✅ User redirected to `/login`
- ✅ Session cookie cleared
- ✅ LocalStorage session cleared
- ✅ Protected routes redirect to login
- ✅ No user data accessible in browser

**Verification Commands:**
```bash
# Check session cleared
localStorage.getItem('workos-session') // Should be null

# Check cookies cleared
document.cookie // Should not contain session cookie
```

**Edge Cases:**
- [ ] Sign out with multiple tabs open - all tabs should clear session
- [ ] Sign out with pending API requests - should cancel requests
- [ ] Network error during sign out - should clear local session anyway

---

### 4. Session Persistence

**Objective:** Verify sessions persist across page refreshes and browser restarts

**Prerequisites:**
- Authenticated user session

**Test Steps:**
1. Sign in successfully
2. Refresh page (`Cmd+R` / `Ctrl+R`)
3. Verify user still authenticated
4. Navigate to different routes (`/agents`, `/projects`, `/ontology`)
5. Verify session persists across all routes
6. Close browser completely
7. Reopen browser and navigate to `http://localhost:3000`
8. Verify session restored (if within TTL)

**Expected Results:**
- ✅ Session persists after page refresh
- ✅ Session persists across route navigation
- ✅ Session restored after browser restart (if within TTL)
- ✅ User data loaded from Convex correctly
- ✅ No authentication prompt required

**Verification Commands:**
```bash
# Check session storage
localStorage.getItem('workos-session')

# Check Convex query reactivity
# User data should update in real-time
```

**Edge Cases:**
- [ ] Session expired - should prompt re-authentication
- [ ] Convex connection lost - should retry and restore session
- [ ] Corrupted session data - should clear and require re-auth

---

### 5. Protected Routes

**Objective:** Verify unauthenticated users cannot access protected routes

**Prerequisites:**
- Signed out state (unauthenticated)

**Test Steps:**
1. Sign out if authenticated
2. Attempt to navigate directly to protected routes:
   - `http://localhost:3000/`
   - `http://localhost:3000/agents`
   - `http://localhost:3000/projects`
   - `http://localhost:3000/ontology`
3. Verify redirect to `/login` for each
4. Sign in
5. Verify redirect back to originally requested route

**Expected Results:**
- ✅ All protected routes redirect to `/login` when unauthenticated
- ✅ After sign in, redirect to originally requested route
- ✅ No protected data exposed before authentication
- ✅ Middleware blocks access at edge/server level

**Verification Commands:**
```bash
# Check middleware execution
# Should see redirect logs in terminal

# Check response headers
curl -I http://localhost:3000/agents
# Should return 307 redirect to /login
```

**Edge Cases:**
- [ ] Direct URL access to nested routes
- [ ] API routes without authentication
- [ ] Deep-linked protected content

---

### 6. Convex User Synchronization

**Objective:** Verify user data syncs correctly between WorkOS and Convex

**Prerequisites:**
- Development server running
- Access to Convex dashboard

**Test Steps:**
1. Sign up new user: `test+sync@example.com`
2. Open Convex dashboard (`https://dashboard.convex.dev`)
3. Navigate to `users` table
4. Verify new user row created with:
   - Correct `userId` (matches WorkOS user ID)
   - Correct `email`
   - Correct `createdAt` timestamp
5. Update user profile (if profile update feature exists)
6. Verify changes sync to Convex in real-time

**Expected Results:**
- ✅ User created in Convex on first sign-in
- ✅ User ID matches WorkOS user ID
- ✅ Email synced correctly
- ✅ No duplicate users created on multiple sign-ins
- ✅ Profile updates sync in real-time

**Verification Commands:**
```bash
# Query users table
npx convex dev --once --run="async (ctx) => {
  const users = await ctx.db.query('users').collect();
  return users;
}"

# Check specific user
npx convex dev --once --run="async (ctx) => {
  const user = await ctx.db.query('users')
    .filter(q => q.eq(q.field('email'), 'test+sync@example.com'))
    .first();
  return user;
}"
```

**Edge Cases:**
- [ ] User signs up but Convex fails - should retry sync
- [ ] User already exists in Convex with different auth provider
- [ ] Email update in WorkOS - should sync to Convex
- [ ] User deletion in WorkOS - should handle gracefully

---

## Edge Case Testing

### 1. Already Authenticated User Visits /login

**Test Steps:**
1. Sign in successfully
2. Navigate to `http://localhost:3000/login`

**Expected Result:**
- ✅ Redirect to dashboard (`/`)
- ✅ No authentication prompt shown

---

### 2. Unauthenticated User Visits Protected Route

**Test Steps:**
1. Sign out
2. Navigate to `http://localhost:3000/agents`

**Expected Result:**
- ✅ Redirect to `/login`
- ✅ After sign in, redirect back to `/agents`

---

### 3. Network Error During Authentication

**Test Steps:**
1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Attempt sign in
4. Observe error handling

**Expected Result:**
- ✅ Show user-friendly error message
- ✅ Allow retry when connection restored
- ✅ No crash or white screen

---

### 4. Expired Session Refresh

**Test Steps:**
1. Sign in
2. Wait for session to expire (or manually expire session)
3. Attempt to access protected route

**Expected Result:**
- ✅ Detect expired session
- ✅ Redirect to `/login`
- ✅ Show message "Session expired, please sign in again"

---

### 5. Multiple Tabs Simultaneous Sign Out

**Test Steps:**
1. Sign in
2. Open application in 3 browser tabs
3. Click "Sign Out" in one tab
4. Check other tabs

**Expected Result:**
- ✅ All tabs detect sign out
- ✅ All tabs redirect to `/login`
- ✅ Session cleared across all tabs

---

## Rollback Testing

### Objective: Verify ability to rollback to Better Auth if needed

**Prerequisites:**
- Backup of `.env.local` with Better Auth configuration
- Backup of Convex schema and data
- Git branch with Better Auth code

**Test Steps:**
1. Stop development servers
2. Checkout Better Auth branch: `git checkout better-auth-backup`
3. Restore `.env.local.backup`
4. Restore Convex schema (if needed)
5. Run `bun install`
6. Start servers: `npm run dev`
7. Test authentication flows with Better Auth
8. Verify user data intact

**Expected Results:**
- ✅ Application starts without errors
- ✅ Better Auth flows work correctly
- ✅ User data preserved in Convex
- ✅ No data loss from WorkOS migration

---

## Performance Testing

### Authentication Flow Performance

**Metrics to Monitor:**
- Sign-in completion time (target: < 3 seconds)
- Sign-up completion time (target: < 5 seconds)
- Session validation time (target: < 100ms)
- Convex user sync time (target: < 500ms)

**Test Commands:**
```bash
# Monitor network requests in DevTools
# Check timing for:
# - /callback endpoint
# - Convex mutations
# - Session cookie setting
```

---

## Security Testing

### Session Security

**Verification Checklist:**
- [ ] Session cookies are `httpOnly`
- [ ] Session cookies are `secure` in production
- [ ] Session cookies are `sameSite=lax`
- [ ] CSRF protection enabled
- [ ] No sensitive data in localStorage
- [ ] No WorkOS credentials exposed in client

**Test Commands:**
```bash
# Check cookie attributes in DevTools → Application → Cookies
# Verify:
# - HttpOnly: ✓
# - Secure: ✓ (in production)
# - SameSite: Lax
```

---

## Automated Testing Recommendations

### Unit Tests (Future)

Create tests for:
- `src/lib/workos-auth.ts` - Auth utilities
- `src/middleware.ts` - Route protection logic
- Convex functions - User sync mutations

### Integration Tests (Future)

Create tests for:
- Complete sign-up flow
- Complete sign-in flow
- Session persistence
- Protected route access

### E2E Tests (Future)

Use Playwright or Cypress for:
- Full authentication flows
- Multi-tab session handling
- Network error scenarios

---

## Test Execution Checklist

### Pre-Deployment

- [ ] Run `scripts/test-workos-config.sh`
- [ ] Run `scripts/validate-migration.sh`
- [ ] Manual test all authentication flows
- [ ] Test all edge cases
- [ ] Verify Convex user sync
- [ ] Test session persistence
- [ ] Test protected routes
- [ ] Performance benchmarks acceptable
- [ ] Security checklist complete

### Post-Deployment

- [ ] Monitor authentication errors
- [ ] Check Convex user creation rate
- [ ] Verify no authentication failures
- [ ] Monitor session expiration issues
- [ ] Check for any rollback triggers

---

## Known Limitations

1. **Email-only Authentication**: Current implementation uses email verification only. Password-based auth requires additional WorkOS configuration.

2. **Single Organization**: Implementation assumes single-organization mode. Multi-org support requires additional setup.

3. **Session TTL**: Default session expiration follows WorkOS defaults. Custom TTL requires configuration.

4. **Profile Updates**: User profile updates beyond email require additional WorkOS API integration.

---

## Troubleshooting Guide

### Issue: "Invalid redirect URI"

**Solution:**
1. Check `WORKOS_REDIRECT_URI` matches exactly in `.env.local` and WorkOS dashboard
2. Ensure no trailing slashes
3. Use `http://localhost:3000/callback` for local dev

### Issue: "Cookie password must be at least 32 characters"

**Solution:**
```bash
# Generate new password
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Update WORKOS_COOKIE_PASSWORD in .env.local
```

### Issue: User not created in Convex

**Solution:**
1. Check Convex connection: `npx convex dev`
2. Verify `users` table exists in schema
3. Check browser console for mutation errors
4. Verify user ID format matches WorkOS user ID

### Issue: Session not persisting

**Solution:**
1. Check cookie settings in DevTools
2. Verify `WORKOS_COOKIE_PASSWORD` is set
3. Check for browser cookie restrictions
4. Test in incognito mode to rule out extensions

---

## Success Criteria

The migration is successful when:

- ✅ All manual test scenarios pass
- ✅ All edge cases handled correctly
- ✅ Session persistence works across refreshes
- ✅ Protected routes properly secured
- ✅ Convex user sync working reliably
- ✅ No TypeScript errors
- ✅ No console errors in browser
- ✅ Performance metrics within targets
- ✅ Security checklist complete
- ✅ Rollback procedure tested and documented

---

## Sign-Off

- [ ] Developer: All tests executed and passing
- [ ] Reviewer: Code review complete
- [ ] QA: Manual testing complete
- [ ] Product: Flows match requirements
- [ ] Security: Security checklist approved

---

**Last Updated:** 2025-10-17
**Migration Guide:** `docs/MIGRATION_GUIDE.md`
**Validation Scripts:** `scripts/test-workos-config.sh`, `scripts/validate-migration.sh`
