# WorkOS Migration Checklist

Use this checklist to track your migration progress.

---

## ☑️ Pre-Migration

- [ ] **Sign up for WorkOS** - [https://dashboard.workos.com](https://dashboard.workos.com)
- [ ] **Get API credentials** - Note your API Key and Client ID
- [ ] **Generate cookie password** - Run `openssl rand -base64 32`
- [ ] **Read migration guide** - Review `docs/WORKOS_MIGRATION_GUIDE.md`
- [ ] **Backup current code** - Create a git branch: `git checkout -b workos-migration`

---

## 📦 Dependencies

- [ ] **Remove Better Auth**
  ```bash
  bun remove better-auth @convex-dev/better-auth next-auth
  ```

- [ ] **Install WorkOS SDK**
  ```bash
  bun add @workos-inc/authkit-nextjs
  ```

- [ ] **Verify installation**
  ```bash
  bun list | grep workos
  # Should show: @workos-inc/authkit-nextjs@X.X.X
  ```

---

## 🔧 Configuration

### WorkOS Dashboard
- [ ] **Configure redirect URIs**
  - Development: `http://localhost:3000/callback`
  - Production: `https://your-domain.com/callback`

- [ ] **Set initiate login URL**
  - Development: `http://localhost:3000/login`
  - Production: `https://your-domain.com/login`

- [ ] **Set logout redirect**
  - Development: `http://localhost:3000`
  - Production: `https://your-domain.com`

### Environment Variables
- [ ] **Update `.env.local`**
  - `WORKOS_API_KEY`
  - `WORKOS_CLIENT_ID`
  - `WORKOS_COOKIE_PASSWORD`
  - `NEXT_PUBLIC_WORKOS_REDIRECT_URI`

- [ ] **Update `.env.production`** (for deployment)

- [ ] **Add to `.gitignore`** (verify `.env.local` is ignored)

---

## 📝 Code Implementation

### Core Files (Create New)
- [ ] **`middleware.ts`** (root directory)
- [ ] **`src/app/callback/route.ts`**
- [ ] **`src/app/login/route.ts`**
- [ ] **`src/app/api/auth/logout/route.ts`**
- [ ] **`src/lib/hooks/useWorkOS.ts`**
- [ ] **`src/lib/workos-server.ts`**
- [ ] **`convex/users.ts`**

### Update Existing Files
- [ ] **`src/app/layout.tsx`** - Add `AuthKitProvider`
- [ ] **`convex/schema.ts`** - Update `users` table schema
- [ ] **`convex/http.ts`** - Remove Better Auth routes
- [ ] **`src/components/layout/Header.tsx`** - Use `useWorkOS` hook

### Delete Old Files
- [ ] **`src/lib/auth.ts`**
- [ ] **`src/lib/auth-client.ts`**
- [ ] **`src/app/api/auth/[...all]/route.ts`**
- [ ] **`convex/auth.ts`**

---

## 🗄️ Database Migration

- [ ] **Update Convex schema** - Deploy with `convex deploy`
- [ ] **Test schema changes** - Check Convex Dashboard
- [ ] **Migrate existing users** (if any)
  - Export users from old system
  - Create migration script
  - Sync to new `users` table

---

## 🧪 Testing - Development

### Authentication Flow
- [ ] **Sign up flow**
  - Navigate to `/login`
  - Click "Sign Up"
  - Enter email/password
  - Verify email
  - Redirect to homepage

- [ ] **Sign in flow**
  - Navigate to `/login`
  - Enter credentials
  - Redirect to homepage
  - User email shown in header

- [ ] **Sign out flow**
  - Click "Sign Out"
  - Redirect to homepage
  - No longer authenticated

### Session Management
- [ ] **Session persistence**
  - Sign in
  - Refresh page (should stay signed in)
  - Close browser and reopen (should stay signed in)
  - Restart dev server (should stay signed in) ✅

- [ ] **Session expiration**
  - Wait for session to expire (check WorkOS settings)
  - Should auto-refresh if still active
  - Should redirect to login if expired

### Protected Routes
- [ ] **Unauthenticated access**
  - Sign out
  - Try to access `/projects`
  - Should redirect to `/login`

- [ ] **Authenticated access**
  - Sign in
  - Access `/projects`
  - Should load successfully

### Convex Integration
- [ ] **User sync on sign up**
  - Sign up with new account
  - Check Convex Dashboard `users` table
  - Should see user with `workosUserId`

- [ ] **User sync on sign in**
  - Sign in with existing account
  - Check Convex Dashboard
  - User should be updated

### Edge Cases
- [ ] **Multiple tabs**
  - Open app in two tabs
  - Sign out in one tab
  - Other tab should also sign out

- [ ] **Network errors**
  - Disconnect network
  - Try to sign in
  - Should show appropriate error

---

## 🚀 Deployment

### Staging/Preview
- [ ] **Set staging environment variables**
- [ ] **Deploy to staging**
- [ ] **Test all flows in staging**
- [ ] **Check Convex data in staging**

### Production
- [ ] **Set production environment variables** in Netlify/Vercel
- [ ] **Update WorkOS Dashboard** with production URLs
- [ ] **Deploy to production**
  ```bash
  bun run build
  # Auto-deploys to Netlify
  ```

- [ ] **Verify production deployment**
  - Test sign up
  - Test sign in
  - Test protected routes
  - Check Convex production data

### Post-Deployment
- [ ] **Monitor for errors**
  - Check Netlify logs
  - Check Convex logs
  - Check WorkOS Dashboard for auth events

- [ ] **Test production thoroughly**
  - All authentication flows
  - Session management
  - Protected routes
  - User data sync

---

## 📊 Verification

### Functionality
- [ ] Users can sign up
- [ ] Users can sign in
- [ ] Users can sign out
- [ ] Sessions persist across restarts
- [ ] Protected routes work correctly
- [ ] User data syncs to Convex

### Security
- [ ] Passwords are hashed (handled by WorkOS)
- [ ] Sessions are encrypted
- [ ] CSRF protection enabled (WorkOS default)
- [ ] Secure cookies configured
- [ ] Rate limiting enabled (WorkOS default)

### Performance
- [ ] Page load times acceptable
- [ ] Auth redirects are fast
- [ ] No console errors
- [ ] No 500 errors in logs

---

## 🧹 Cleanup

- [ ] **Remove unused dependencies** from `package.json`
- [ ] **Delete backup branch** (after successful deployment)
  ```bash
  git branch -d better-auth-backup
  ```

- [ ] **Update documentation**
  - Update README with new auth system
  - Document WorkOS configuration
  - Add troubleshooting guide

---

## 📈 Post-Migration Enhancements

### Optional Features
- [ ] **Enable SSO** - SAML/OAuth for enterprise customers
- [ ] **Add MFA** - Multi-factor authentication
- [ ] **Customize branding** - Match AuthKit to your brand
- [ ] **Set up webhooks** - Listen for user events
- [ ] **Add organizations** - Multi-tenant support
- [ ] **Configure email templates** - Custom welcome emails
- [ ] **Enable impersonation** - For customer support

### Monitoring
- [ ] **Set up error tracking** - Sentry/DataDog
- [ ] **Add analytics** - Track auth events
- [ ] **Monitor auth metrics** - Sign-up rates, login attempts
- [ ] **Set up alerts** - Failed auth attempts, errors

---

## ✅ Migration Complete!

When all items are checked:
- [ ] **Celebrate!** 🎉
- [ ] **Document lessons learned**
- [ ] **Share with team**
- [ ] **Plan next features**

---

## 🆘 Need Help?

**Stuck on a step?**
1. Check `docs/WORKOS_MIGRATION_GUIDE.md` for detailed instructions
2. Review `docs/WORKOS_QUICKSTART.md` for quick reference
3. Search WorkOS docs: https://workos.com/docs
4. Contact WorkOS support: support@workos.com

**Common Issues:**
- Invalid redirect URI → Check dashboard config matches `.env`
- Sessions not persisting → Verify `WORKOS_COOKIE_PASSWORD` is 32+ chars
- User not syncing → Check Convex logs for errors
- Middleware not working → Verify `middleware.ts` is in root directory

---

**Estimated Total Time: 4-5 hours**

Good luck with your migration! 🚀
