# Security Setup Guide

Comprehensive security configuration for the ALIAS Enterprise Platform covering Vercel WAF, CSP headers, SAML SSO, audit logging, and security monitoring.

## Overview

Security is implemented across 4 layers:
1. **Network Security** - WAF, DDoS protection, rate limiting
2. **Application Security** - CSP headers, CORS, input validation
3. **Authentication & Authorization** - WorkOS SSO/SAML, RBAC
4. **Monitoring & Compliance** - Audit logs, security scanning, alerts

## Vercel Security Configuration

### 1. Web Application Firewall (WAF)

**Location:** Vercel Dashboard > Project > Settings > Security

#### Enable Vercel Firewall

```json
// vercel.json
{
  "firewall": [
    {
      "action": "deny",
      "actionDuration": "1h",
      "condition": {
        "type": "path",
        "op": "eq",
        "value": "/admin"
      },
      "description": "Block unauthorized admin access"
    },
    {
      "action": "rate_limit",
      "limit": 100,
      "window": "1m",
      "condition": {
        "type": "method",
        "op": "eq",
        "value": "POST"
      },
      "description": "Rate limit POST requests"
    },
    {
      "action": "deny",
      "condition": {
        "type": "ip",
        "op": "in",
        "value": ["blocked-ip-list"]
      },
      "description": "Block malicious IPs"
    }
  ]
}
```

#### Configure IP Allowlist (for staging/production admin access)

```json
// vercel.json (super-admin app)
{
  "firewall": [
    {
      "action": "deny",
      "condition": {
        "type": "path",
        "op": "prefix",
        "value": "/admin"
      },
      "description": "Block admin access by default"
    },
    {
      "action": "allow",
      "condition": {
        "type": "and",
        "conditions": [
          {
            "type": "path",
            "op": "prefix",
            "value": "/admin"
          },
          {
            "type": "ip",
            "op": "in",
            "value": [
              "203.0.113.0/24",  // Office IP range
              "198.51.100.50"     // VPN IP
            ]
          }
        ]
      },
      "description": "Allow admin access from trusted IPs"
    }
  ]
}
```

### 2. Content Security Policy (CSP)

**File:** `middleware.ts` (each app)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com;
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data: https://*.convex.cloud;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.workos.com;
  `.replace(/\\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 3. Security Headers

**File:** `next.config.mjs` (each app)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 4. Deployment Protection

**Configure in Vercel Dashboard:**

1. Navigate to: Project > Settings > Deployment Protection
2. Enable options:
   - ✅ **Protection Bypass for Automation** - Allow CI/CD
   - ✅ **Vercel Authentication** - Require login for preview deployments
   - ✅ **Password Protection** - Protect staging with password
   - ✅ **Trusted IPs** - Whitelist office/VPN IPs

**Password Protection (Staging Only):**
```bash
# Set in Vercel dashboard
Password: [generate-secure-password]
Applies to: Preview and Production (staging domain)
```

**Trusted IP Ranges (Production):**
```
203.0.113.0/24    # Office network
198.51.100.50     # VPN endpoint
```

## WorkOS Authentication & SAML SSO

### 1. WorkOS Configuration

**Dashboard:** https://dashboard.workos.com

#### Enable SAML SSO

1. Navigate to: Authentication > SSO Providers
2. Click "Add Provider"
3. Select provider type: Okta, Azure AD, Google Workspace, etc.
4. Configure provider settings:

**For Okta:**
```
ACS URL: https://api.workos.com/sso/saml/acs/[connection-id]
Entity ID: https://api.workos.com/sso/saml/[connection-id]
Start URL: https://alias.com/login
```

**For Azure AD:**
```
Reply URL: https://api.workos.com/sso/saml/acs/[connection-id]
Sign on URL: https://alias.com/login
Identifier: https://api.workos.com/sso/saml/[connection-id]
```

#### Configure Authentication Options

```typescript
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/login', '/callback', '/api/webhooks/*'],
  },
  signInUrl: '/login',
  signUpUrl: null, // Disable self-registration
});
```

### 2. Multi-Factor Authentication (MFA)

**Enable in WorkOS Dashboard:**

1. Navigate to: Authentication > Multi-Factor Auth
2. Enable MFA options:
   - ✅ SMS
   - ✅ Authenticator App (TOTP)
   - ✅ WebAuthn/Biometric

**Enforce MFA for roles:**
```typescript
// convex/auth.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const requireMFA = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    // Require MFA for admin and owner roles
    if (user?.role === "admin" || user?.role === "owner") {
      if (!user.mfaEnabled) {
        throw new Error("MFA required for admin access");
      }
    }

    return user;
  },
});
```

### 3. Session Management

**Configure secure sessions:**

```typescript
// lib/workos-server.ts
import { WorkOS } from '@workos-inc/node';

export const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export const sessionConfig = {
  cookieName: '__alias_session',
  password: process.env.WORKOS_COOKIE_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
```

## Role-Based Access Control (RBAC)

### 1. Role Hierarchy

```typescript
// convex/schema.ts
export const roles = defineTable({
  name: v.string(),
  permissions: v.array(v.string()),
  hierarchy: v.number(), // Higher = more permissions
});

// Role definitions
export const ROLES = {
  OWNER: { name: "owner", hierarchy: 100 },
  ADMIN: { name: "admin", hierarchy: 80 },
  MANAGER: { name: "manager", hierarchy: 60 },
  MEMBER: { name: "member", hierarchy: 40 },
  VIEWER: { name: "viewer", hierarchy: 20 },
  GUEST: { name: "guest", hierarchy: 10 },
};
```

### 2. Permission Checks

```typescript
// convex/permissions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkPermission = query({
  args: {
    userId: v.id("users"),
    resource: v.string(),
    action: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return false;

    const userRole = await ctx.db
      .query("roles")
      .filter((q) => q.eq(q.field("name"), user.role))
      .first();

    if (!userRole) return false;

    const requiredPermission = `${args.resource}:${args.action}`;
    return userRole.permissions.includes(requiredPermission);
  },
});
```

### 3. Server-Side Authorization

```typescript
// convex/projects.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_workos_id", (q) =>
        q.eq("workosUserId", identity.subject)
      )
      .first();

    if (!user) throw new Error("User not found");

    // Check permission
    const hasPermission = await checkPermission(ctx, {
      userId: user._id,
      resource: "projects",
      action: "delete",
    });

    if (!hasPermission) {
      throw new Error("Insufficient permissions");
    }

    // Perform deletion
    await ctx.db.delete(args.projectId);
  },
});
```

## Audit Logging

### 1. Audit Log Schema

```typescript
// convex/schema.ts
export const auditLogs = defineTable({
  timestamp: v.number(),
  userId: v.id("users"),
  organizationId: v.id("organizations"),
  action: v.string(), // "create", "update", "delete", "access"
  resource: v.string(), // "project", "user", "setting"
  resourceId: v.optional(v.string()),
  changes: v.optional(v.any()), // Before/after values
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  success: v.boolean(),
  errorMessage: v.optional(v.string()),
})
  .index("by_user", ["userId", "timestamp"])
  .index("by_organization", ["organizationId", "timestamp"])
  .index("by_resource", ["resource", "resourceId"])
  .index("by_action", ["action", "timestamp"]);
```

### 2. Logging Mutations

```typescript
// convex/auditLog.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createAuditLog = mutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    changes: v.optional(v.any()),
    success: v.boolean(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", {
      timestamp: Date.now(),
      ...args,
    });
  },
});
```

### 3. Automatic Audit Logging

```typescript
// convex/projects.ts (with audit logging)
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
    })
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_workos_id", (q) =>
        q.eq("workosUserId", identity.subject)
      )
      .first();

    if (!user) throw new Error("User not found");

    // Get old values
    const oldProject = await ctx.db.get(args.projectId);

    try {
      // Perform update
      await ctx.db.patch(args.projectId, args.updates);

      // Log success
      await createAuditLog(ctx, {
        userId: user._id,
        organizationId: user.organizationId,
        action: "update",
        resource: "project",
        resourceId: args.projectId,
        changes: {
          before: oldProject,
          after: args.updates,
        },
        success: true,
      });
    } catch (error) {
      // Log failure
      await createAuditLog(ctx, {
        userId: user._id,
        organizationId: user.organizationId,
        action: "update",
        resource: "project",
        resourceId: args.projectId,
        success: false,
        errorMessage: error.message,
      });
      throw error;
    }
  },
});
```

## Security Monitoring

### 1. Sentry Error Tracking

**Setup:**

```bash
bun add @sentry/nextjs
```

**Configuration:**

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
```

**Security-specific tracking:**

```typescript
// lib/security-monitor.ts
import * as Sentry from "@sentry/nextjs";

export function trackSecurityEvent(event: {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
}) {
  Sentry.captureMessage(`Security Event: ${event.type}`, {
    level: event.severity === 'critical' ? 'error' : 'warning',
    tags: {
      security_event: event.type,
    },
    extra: event.details,
  });
}

// Usage
trackSecurityEvent({
  type: 'failed_login_attempt',
  severity: 'medium',
  details: {
    userId: user.id,
    ipAddress: req.ip,
    attempts: loginAttempts,
  },
});
```

### 2. Rate Limiting

**File:** `convex/rateLimit.ts`

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkRateLimit = mutation({
  args: {
    key: v.string(), // e.g., "login:user@email.com" or "api:ip_address"
    limit: v.number(),
    window: v.number(), // milliseconds
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const windowStart = now - args.window;

    // Get recent attempts
    const attempts = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .filter((q) => q.gte(q.field("timestamp"), windowStart))
      .collect();

    if (attempts.length >= args.limit) {
      // Log rate limit hit
      await trackSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        details: { key: args.key, attempts: attempts.length },
      });
      throw new Error("Rate limit exceeded");
    }

    // Record this attempt
    await ctx.db.insert("rateLimits", {
      key: args.key,
      timestamp: now,
    });

    return { allowed: true, remaining: args.limit - attempts.length - 1 };
  },
});
```

### 3. Suspicious Activity Detection

```typescript
// convex/security.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const detectSuspiciousActivity = query({
  args: { userId: v.id("users"), timeWindow: v.number() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const windowStart = now - args.timeWindow;

    const recentLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .filter((q) => q.gte(q.field("timestamp"), windowStart))
      .collect();

    // Check for suspicious patterns
    const failedLogins = recentLogs.filter(
      (log) => log.action === "login" && !log.success
    ).length;

    const bulkDeletes = recentLogs.filter(
      (log) => log.action === "delete"
    ).length;

    const suspiciousActivity = [];

    if (failedLogins > 5) {
      suspiciousActivity.push({
        type: "multiple_failed_logins",
        count: failedLogins,
        severity: "high",
      });
    }

    if (bulkDeletes > 10) {
      suspiciousActivity.push({
        type: "bulk_deletion",
        count: bulkDeletes,
        severity: "high",
      });
    }

    if (suspiciousActivity.length > 0) {
      // Alert security team
      await trackSecurityEvent({
        type: 'suspicious_activity_detected',
        severity: 'high',
        details: {
          userId: args.userId,
          patterns: suspiciousActivity,
        },
      });
    }

    return suspiciousActivity;
  },
});
```

## Secrets Management

### 1. HashiCorp Vault Integration

**Setup:**

```bash
bun add node-vault
```

**Configuration:**

```typescript
// lib/vault.ts
import vault from 'node-vault';

export const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

export async function getSecret(path: string) {
  try {
    const result = await vaultClient.read(`secret/data/${path}`);
    return result.data.data;
  } catch (error) {
    console.error('Failed to fetch secret:', error);
    throw error;
  }
}

// Usage
const stripeKey = await getSecret('production/stripe/secret_key');
```

### 2. Secret Rotation

```typescript
// scripts/rotate-secrets.ts
import { vaultClient } from '../lib/vault';

async function rotateSecret(path: string, generator: () => string) {
  const oldSecret = await vaultClient.read(`secret/data/${path}`);
  const newSecret = generator();

  // Write new secret
  await vaultClient.write(`secret/data/${path}`, {
    data: { value: newSecret },
  });

  // Update all services
  await updateVercelSecret(path, newSecret);
  await updateConvexSecret(path, newSecret);
  await updateEASSecret(path, newSecret);

  // Archive old secret
  await vaultClient.write(`secret/data/${path}/archive`, {
    data: {
      value: oldSecret.data.data.value,
      rotated_at: new Date().toISOString(),
    },
  });

  console.log(`✅ Rotated secret: ${path}`);
}

// Run quarterly
await rotateSecret('production/workos/cookie_password', () => {
  return crypto.randomBytes(32).toString('base64');
});
```

## Compliance & Certifications

### 1. SOC 2 Preparation

**Required audit logs:**
- User authentication events
- Data access logs
- Configuration changes
- Security incidents
- Data exports

**Retention policy:**
```typescript
// convex/compliance.ts
export const auditLogRetention = mutation({
  handler: async (ctx) => {
    const threeYearsAgo = Date.now() - (3 * 365 * 24 * 60 * 60 * 1000);

    const oldLogs = await ctx.db
      .query("auditLogs")
      .filter((q) => q.lt(q.field("timestamp"), threeYearsAgo))
      .collect();

    // Archive to cold storage before deletion
    await archiveToS3(oldLogs);

    // Delete old logs
    for (const log of oldLogs) {
      await ctx.db.delete(log._id);
    }
  },
});
```

### 2. GDPR Compliance

**Data export:**
```typescript
// convex/gdpr.ts
export const exportUserData = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const auditLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      user,
      auditLogs,
      // Include all user-related data
    };
  },
});
```

**Data deletion:**
```typescript
export const deleteUserData = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Delete all user data
    const user = await ctx.db.get(args.userId);

    // Delete related records
    const tables = ["projects", "tasks", "auditLogs"];
    for (const table of tables) {
      const records = await ctx.db
        .query(table)
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    }

    // Delete user
    await ctx.db.delete(args.userId);
  },
});
```

## Security Checklist

### Pre-Production

- [ ] WAF configured and tested
- [ ] CSP headers implemented
- [ ] Security headers enabled
- [ ] HTTPS/HSTS enforced
- [ ] SAML SSO configured
- [ ] MFA enabled for admin roles
- [ ] RBAC permissions tested
- [ ] Audit logging implemented
- [ ] Rate limiting configured
- [ ] Secrets in Vault (not hardcoded)
- [ ] Error tracking (Sentry) configured
- [ ] Security monitoring alerts set up
- [ ] Deployment protection enabled
- [ ] IP allowlists configured (if needed)
- [ ] Security scan in CI/CD
- [ ] Incident response plan documented
- [ ] Security training completed

### Post-Production

- [ ] Monitor security dashboards daily
- [ ] Review audit logs weekly
- [ ] Rotate secrets quarterly
- [ ] Security assessment annually
- [ ] Penetration testing annually
- [ ] Update security dependencies monthly
- [ ] Review access permissions quarterly
- [ ] Test incident response procedures quarterly

## Next Steps

1. **Configure Vercel WAF** for all production projects
2. **Enable WorkOS SAML SSO** for enterprise authentication
3. **Set up audit logging** in Convex
4. **Configure Sentry** for security event tracking
5. **Implement rate limiting** for public endpoints
6. **Create security runbooks** for incident response
7. **Schedule security training** for the team
8. **Conduct security assessment** before production launch

---

**Related Documentation:**
- [Deployment Architecture](./DEPLOYMENT-ARCHITECTURE.md)
- [CI/CD Workflows](./CICD-WORKFLOWS.md)
- [Environment Variables](./ENV-VARIABLES.md)
