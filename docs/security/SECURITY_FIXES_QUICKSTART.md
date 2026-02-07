# Security Fixes Quick Start Guide

**🚨 PRODUCTION BLOCKER: Do not deploy until Critical fixes are completed**

## ⚡ Quick Action Checklist

### 🔴 CRITICAL (Fix Today)

- [ ] **1. Rotate Exposed Credentials**
  ```bash
  # Go to Convex dashboard and revoke:
  # CONVEX_DEPLOYMENT=dev:calm-caiman-179
  # Create new deployment and update .env.local
  ```

- [ ] **2. Implement Password Hashing**
  ```bash
  bun add bcryptjs
  bun add -D @types/bcryptjs
  ```
  Update `/convex/auth.ts` with proper password hashing

- [ ] **3. Fix In-Memory Auth Database**
  Update `/src/lib/auth.ts` to use Convex adapter

- [ ] **4. Add Authorization Checks**
  Add auth middleware to all protected Convex functions

- [ ] **5. Validate Environment Variables**
  Add runtime checks for required env vars

### 🟠 HIGH (Fix This Week)

- [ ] **6. Update All Dependencies**
  ```bash
  bun update
  bun install next@latest better-auth@latest convex@latest
  ```

- [ ] **7. Add Rate Limiting**
  ```bash
  bun add @convex-dev/rate-limiter
  ```

- [ ] **8. Configure Security Headers**
  Update `next.config.js` with security headers

- [ ] **9. Implement HTTPS Enforcement**
  Add middleware for HTTPS redirect

- [ ] **10. Fix Session Configuration**
  Update Better Auth session settings

### 🟡 MEDIUM (Fix Next Week)

- [ ] **11. Add Input Validation**
- [ ] **12. Implement Audit Logging**
- [ ] **13. Add Error Handling**
- [ ] **14. Configure CSP**
- [ ] **15. Remove Unused Dependencies**

---

## 🔧 Copy-Paste Fixes

### Fix #1: Password Hashing

**File:** `/convex/auth.ts`

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

// Email validator
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password strength validator
const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate email
    if (!isValidEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (!isStrongPassword(args.password)) {
      throw new Error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
    }

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password with salt rounds of 12
    const passwordHash = await bcrypt.hash(args.password, 12);

    // Create user with hashed password
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash, // Store hash, not plain text
    });

    return { userId };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || !user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    // Verify password against hash
    const isValid = await bcrypt.compare(args.password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return { userId: user._id };
  },
});
```

**Update schema:**

```typescript
// convex/schema.ts
users: defineTable({
  email: v.string(),
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  passwordHash: v.string(), // Add this field
})
  .index("by_email", ["email"]),
```

---

### Fix #2: Authorization Middleware

**File:** `/convex/auth.ts`

```typescript
import { getAuthUserId } from "@convex-dev/better-auth/server";

// Helper to require authentication
async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }
  return userId;
}

// Helper to check if user can modify resource
async function requireResourceOwnership(
  ctx: any,
  resourceUserId: string
) {
  const currentUserId = await requireAuth(ctx);

  if (currentUserId !== resourceUserId) {
    throw new Error("Forbidden - You don't have permission");
  }

  return currentUserId;
}

// Protected mutation example
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Require user to be authenticated and own the resource
    await requireResourceOwnership(ctx, args.userId);

    // Delete user
    await ctx.db.delete(args.userId);

    return { success: true };
  },
});

// Public query example
export const getPublicProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // No auth required for public data
    const user = await ctx.db.get(args.userId);

    // Return only public fields
    return {
      name: user?.name,
      image: user?.image,
      // Don't return email or passwordHash!
    };
  },
});
```

---

### Fix #3: Security Headers

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*/**",
      },
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

### Fix #4: Rate Limiting

**File:** `/convex/auth.ts`

```typescript
import { rateLimiter } from "@convex-dev/rate-limiter";

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: rateLimiter(
    {
      kind: "token-bucket",
      rate: 5, // 5 attempts
      period: "1m", // per minute
    },
    async (ctx, args) => {
      // Login logic with rate limiting
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (!user || !user.passwordHash) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(args.password, user.passwordHash);

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      return { userId: user._id };
    }
  ),
});
```

---

### Fix #5: Environment Variable Validation

**File:** `/src/lib/env.ts` (new file)

```typescript
// Validate required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_CONVEX_URL",
  "CONVEX_DEPLOYMENT",
  "NEXT_PUBLIC_APP_URL",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n\n` +
      `Please create a .env.local file based on .env.example`
    );
  }
}

// Validated environment variables
export const env = {
  CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL!,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
```

**File:** `/src/lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react";
import { env, validateEnv } from "./env";

// Validate on import
validateEnv();

export const authClient = createAuthClient({
  baseURL: env.APP_URL, // No fallback, fail fast
});
```

---

### Fix #6: HTTPS Enforcement

**File:** `/src/middleware.ts` (new file)

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    const host = request.headers.get("host");
    const pathname = request.nextUrl.pathname;

    return NextResponse.redirect(`https://${host}${pathname}`, 301);
  }

  // Add security headers
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

---

### Fix #7: Session Configuration

**File:** `/src/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "convex",
    url: process.env.NEXT_PUBLIC_CONVEX_URL!,
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true, // Enable email verification
    sendResetPassword: async ({ user, url }) => {
      // Implement email sending
      console.log(`Reset password: ${url}`);
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (not 30!)
    updateAge: 60 * 60, // Update every 1 hour (not 24!)
    cookieName: "__Secure-session",
    cookieOptions: {
      httpOnly: true, // Prevent XSS
      secure: process.env.NODE_ENV === "production", // HTTPS only
      sameSite: "lax", // CSRF protection
      path: "/",
    },
  },

  advanced: {
    generateSessionToken: true,
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },
});
```

---

### Fix #8: Audit Logging

**File:** `/convex/schema.ts`

```typescript
// Add audit log table
auditLogs: defineTable({
  userId: v.optional(v.id("users")),
  action: v.string(), // "login", "logout", "user_delete", etc.
  resource: v.string(), // "users", "projects", etc.
  resourceId: v.optional(v.string()),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  timestamp: v.number(),
  success: v.boolean(),
  metadata: v.optional(v.any()),
})
  .index("by_timestamp", ["timestamp"])
  .index("by_userId", ["userId"])
  .index("by_action", ["action"]),
```

**File:** `/convex/auditLog.ts` (new file)

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const log = mutation({
  args: {
    userId: v.optional(v.id("users")),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    success: v.boolean(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
```

---

## 🧪 Testing Your Fixes

### Test Password Hashing

```bash
# Install dependencies
bun add bcryptjs
bun add -D @types/bcryptjs

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Verify password is hashed in database (not plain text)
```

### Test Authorization

```bash
# Try to delete user without auth (should fail)
curl -X POST http://localhost:3000/api/auth/delete-user \
  -H "Content-Type: application/json" \
  -d '{"userId":"some-id"}'

# Should return: "Unauthorized - Please sign in"
```

### Test Rate Limiting

```bash
# Attempt multiple rapid logins (should rate limit after 5)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# Should see: "Rate limit exceeded" after 5 attempts
```

---

## 📋 Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All critical fixes implemented
- [ ] Dependencies updated to latest secure versions
- [ ] `npm audit` returns 0 vulnerabilities
- [ ] Environment variables secured (not in git)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Audit logging enabled
- [ ] Error handling doesn't leak sensitive data
- [ ] Password requirements enforced
- [ ] Session management secure
- [ ] Authorization checks on all protected routes
- [ ] Input validation on all user inputs
- [ ] CSRF protection enabled

---

## 🆘 Need Help?

- Review full audit report: `/docs/security/SECURITY_AUDIT_REPORT.md`
- Better Auth docs: https://www.better-auth.com/docs
- Convex security: https://docs.convex.dev/security
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Last Updated:** 2025-10-17
**Next Review:** After implementing critical fixes
