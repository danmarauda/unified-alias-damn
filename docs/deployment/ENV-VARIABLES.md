# Environment Variables Reference

Complete environment variable configuration for all platforms and environments in the ALIAS Enterprise Platform.

## Overview

Environment variables are managed across 4 platforms:
- **Convex** - Backend database and functions
- **Vercel** - Web applications (5 projects)
- **EAS** - Mobile applications (iOS + Android)
- **GitHub Actions** - CI/CD workflows

## Environment Matrix

| Variable | Development | Preview | Staging | Production | Required |
|----------|-------------|---------|---------|------------|----------|
| `NEXT_PUBLIC_CONVEX_URL` | ✅ | ✅ | ✅ | ✅ | Yes |
| `CONVEX_DEPLOYMENT` | ✅ | Auto | ✅ | ✅ | Yes |
| `WORKOS_API_KEY` | ✅ | ✅ | ✅ | ✅ | Yes |
| `WORKOS_CLIENT_ID` | ✅ | ✅ | ✅ | ✅ | Yes |
| `WORKOS_COOKIE_PASSWORD` | ✅ | ✅ | ✅ | ✅ | Yes |
| `NEXT_PUBLIC_APP_URL` | ✅ | Auto | ✅ | ✅ | Yes |
| `STRIPE_SECRET_KEY` | ❌ | ❌ | ✅ | ✅ | Yes |
| `STRIPE_WEBHOOK_SECRET` | ❌ | ❌ | ✅ | ✅ | Yes |
| `RESEND_API_KEY` | ❌ | ❌ | ✅ | ✅ | Yes |

## Convex Environment Variables

### Development

```bash
# .env.local (root directory)
CONVEX_DEPLOYMENT=dev:alias-dev-12345
NEXT_PUBLIC_CONVEX_URL=https://alias-dev-12345.convex.cloud
```

### Staging

```bash
# Configure in Convex Dashboard: Settings > Environment Variables
CONVEX_DEPLOYMENT=staging:alias-staging
WORKOS_API_KEY=sk_staging_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
RESEND_API_KEY=re_xxxxx
AXIOM_TOKEN=xaat-xxxxx
BRAINTRUST_API_KEY=bt_xxxxx
ROAM_API_KEY=roam_xxxxx
VAULT_ADDR=https://vault-staging.alias.com
VAULT_TOKEN=hvs.xxxxx
```

### Production

```bash
# Configure in Convex Dashboard: Settings > Environment Variables
CONVEX_DEPLOYMENT=prod:alias-production
WORKOS_API_KEY=sk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
RESEND_API_KEY=re_xxxxx
AXIOM_TOKEN=xaat-xxxxx
BRAINTRUST_API_KEY=bt_xxxxx
ROAM_API_KEY=roam_xxxxx
VAULT_ADDR=https://vault.alias.com
VAULT_TOKEN=hvs.xxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

## Vercel Environment Variables

### Super Admin App (`apps/super-admin`)

#### Development
```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=https://alias-dev-12345.convex.cloud
CONVEX_DEPLOYMENT=dev:alias-dev-12345

# WorkOS (Development)
WORKOS_API_KEY=sk_test_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_COOKIE_PASSWORD=complex-secret-at-least-32-characters-long
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Analytics (Optional in dev)
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=dev_xxxxx
```

#### Preview (Auto-configured by Vercel)
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=$VERCEL_URL
NEXT_PUBLIC_CONVEX_URL=https://alias-preview-xxxxx.convex.cloud
CONVEX_DEPLOYMENT=preview:alias-preview-xxxxx

# WorkOS
WORKOS_API_KEY=sk_test_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_COOKIE_PASSWORD=complex-secret-at-least-32-characters-long
NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://$VERCEL_URL/callback
```

#### Staging
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.alias.com
NEXT_PUBLIC_CONVEX_URL=https://alias-staging.convex.cloud
CONVEX_DEPLOYMENT=staging:alias-staging

# WorkOS (Staging)
WORKOS_API_KEY=sk_staging_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_COOKIE_PASSWORD=complex-secret-at-least-32-characters-long
NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://staging.alias.com/callback

# Analytics
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=staging_xxxxx
AXIOM_TOKEN=xaat-staging-xxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Monitoring
VERCEL_ANALYTICS_ID=xxxxx
VERCEL_SPEED_INSIGHTS_ID=xxxxx
```

#### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://alias.com
NEXT_PUBLIC_CONVEX_URL=https://alias-production.convex.cloud
CONVEX_DEPLOYMENT=prod:alias-production

# WorkOS (Production)
WORKOS_API_KEY=sk_live_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_COOKIE_PASSWORD=complex-secret-at-least-32-characters-long
NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://alias.com/callback

# Analytics & Monitoring
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=prod_xxxxx
AXIOM_TOKEN=xaat-production-xxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
VERCEL_ANALYTICS_ID=xxxxx
VERCEL_SPEED_INSIGHTS_ID=xxxxx
BRAINTRUST_API_KEY=bt_xxxxx

# Integrations
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
RESEND_API_KEY=re_xxxxx
ROAM_API_KEY=roam_xxxxx
VAULT_ADDR=https://vault.alias.com
VAULT_TOKEN=hvs.xxxxx
```

### Client Workspace App (`apps/client-workspace`)

Same structure as Super Admin, but with client-specific configuration:

```bash
# Additional variables
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_TIME_TRACKING=true
NEXT_PUBLIC_ENABLE_PROJECT_MANAGEMENT=true
```

### Marketing Site (`apps/marketing`)

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://alias.com
NEXT_PUBLIC_API_URL=https://api.alias.com
NEXT_PUBLIC_CONVEX_URL=https://alias-production.convex.cloud

# Marketing tools
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=xxxxx
```

### Docs Site (`apps/docs`)

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3003

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://docs.alias.com
NEXT_PUBLIC_ALGOLIA_APP_ID=xxxxx
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=xxxxx
ALGOLIA_ADMIN_KEY=xxxxx
```

### API Server (`apps/api`)

```bash
# Development
NODE_ENV=development
PORT=3002
API_URL=http://localhost:3002

# Production
NODE_ENV=production
PORT=3002
API_URL=https://api.alias.com
NEXT_PUBLIC_CONVEX_URL=https://alias-production.convex.cloud
CONVEX_DEPLOYMENT=prod:alias-production

# Rate limiting
REDIS_URL=redis://redis.alias.com:6379
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15m

# CORS
ALLOWED_ORIGINS=https://alias.com,https://staging.alias.com
```

## EAS (Mobile) Environment Variables

### Development

**File:** `apps/mobile/.env.development`

```bash
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_APP_URL=http://localhost:3000
EXPO_PUBLIC_CONVEX_URL=https://alias-dev-12345.convex.cloud
EXPO_PUBLIC_API_URL=http://localhost:3002

# WorkOS Mobile
EXPO_PUBLIC_WORKOS_CLIENT_ID=client_xxxxx
EXPO_PUBLIC_WORKOS_REDIRECT_URI=alias://callback

# Feature flags
EXPO_PUBLIC_ENABLE_DEV_MENU=true
EXPO_PUBLIC_ENABLE_LOGGER=true
```

### Staging

**File:** `apps/mobile/.env.staging`

```bash
EXPO_PUBLIC_ENV=staging
EXPO_PUBLIC_APP_URL=https://staging.alias.com
EXPO_PUBLIC_CONVEX_URL=https://alias-staging.convex.cloud
EXPO_PUBLIC_API_URL=https://api-staging.alias.com

# WorkOS Mobile
EXPO_PUBLIC_WORKOS_CLIENT_ID=client_xxxxx
EXPO_PUBLIC_WORKOS_REDIRECT_URI=alias://callback

# Analytics
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
EXPO_PUBLIC_ANALYTICS_ENABLED=true

# Feature flags
EXPO_PUBLIC_ENABLE_DEV_MENU=true
EXPO_PUBLIC_ENABLE_LOGGER=true
```

### Production

**File:** `apps/mobile/.env.production`

```bash
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_APP_URL=https://alias.com
EXPO_PUBLIC_CONVEX_URL=https://alias-production.convex.cloud
EXPO_PUBLIC_API_URL=https://api.alias.com

# WorkOS Mobile
EXPO_PUBLIC_WORKOS_CLIENT_ID=client_xxxxx
EXPO_PUBLIC_WORKOS_REDIRECT_URI=alias://callback

# Analytics & Monitoring
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
EXPO_PUBLIC_ANALYTICS_ENABLED=true
EXPO_PUBLIC_OPENPANEL_CLIENT_ID=prod_mobile_xxxxx

# Feature flags
EXPO_PUBLIC_ENABLE_DEV_MENU=false
EXPO_PUBLIC_ENABLE_LOGGER=false

# Push notifications
EXPO_PUBLIC_ONESIGNAL_APP_ID=xxxxx

# App Store
EXPO_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/alias/idXXXXXX
EXPO_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.alias.app
```

## GitHub Actions Secrets

Configure at: `Settings > Secrets and variables > Actions`

### Core Secrets

```bash
# Vercel
VERCEL_TOKEN=xxxxx
VERCEL_ORG_ID=team_xxxxx
VERCEL_PROJECT_ID_ADMIN=prj_xxxxx
VERCEL_PROJECT_ID_CLIENT=prj_xxxxx
VERCEL_PROJECT_ID_MARKETING=prj_xxxxx
VERCEL_PROJECT_ID_DOCS=prj_xxxxx
VERCEL_PROJECT_ID_API=prj_xxxxx

# Convex
CONVEX_DEPLOY_KEY=prod:xxxxx|xxxxx

# EAS (Expo)
EXPO_TOKEN=xxxxx
APPLE_TEAM_ID=xxxxx
GOOGLE_SERVICE_ACCOUNT_KEY=xxxxx (JSON)

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxx
```

## Environment Variable Templates

### `.env.local.example` (Root)

```bash
# Convex
CONVEX_DEPLOYMENT=dev:alias-dev-12345
NEXT_PUBLIC_CONVEX_URL=https://alias-dev-12345.convex.cloud

# WorkOS Authentication
WORKOS_API_KEY=sk_test_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_COOKIE_PASSWORD=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics (can be empty in dev)
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=
AXIOM_TOKEN=
SENTRY_DSN=
```

### `apps/mobile/.env.example`

```bash
# Environment
EXPO_PUBLIC_ENV=development

# URLs
EXPO_PUBLIC_APP_URL=http://localhost:3000
EXPO_PUBLIC_CONVEX_URL=https://alias-dev-12345.convex.cloud
EXPO_PUBLIC_API_URL=http://localhost:3002

# WorkOS Mobile
EXPO_PUBLIC_WORKOS_CLIENT_ID=client_xxxxx
EXPO_PUBLIC_WORKOS_REDIRECT_URI=alias://callback

# Feature Flags
EXPO_PUBLIC_ENABLE_DEV_MENU=true
EXPO_PUBLIC_ENABLE_LOGGER=true
```

## Setup Instructions

### 1. Development Setup

```bash
# Root directory
cp .env.local.example .env.local
# Fill in development values

# Mobile app
cd apps/mobile
cp .env.example .env.development
# Fill in development values
```

### 2. Vercel Setup (Per Project)

```bash
# Navigate to Vercel dashboard for each project
# Settings > Environment Variables

# Add variables for each environment:
# - Development
# - Preview
# - Production

# Use the values from the sections above
```

### 3. Convex Setup

```bash
# Development (automatic from .env.local)
bunx convex dev

# Staging/Production (via dashboard)
# 1. Visit: https://dashboard.convex.dev
# 2. Select deployment
# 3. Settings > Environment Variables
# 4. Add production variables
```

### 4. EAS Setup

```bash
cd apps/mobile

# Configure secrets (not committed)
eas secret:create --scope project --name WORKOS_API_KEY --value sk_xxxxx
eas secret:create --scope project --name SENTRY_DSN --value https://xxxxx

# Public variables go in .env files (committed)
```

### 5. GitHub Actions Setup

```bash
# Navigate to: Settings > Secrets and variables > Actions

# For each secret in "GitHub Actions Secrets" section:
# 1. Click "New repository secret"
# 2. Enter name and value
# 3. Click "Add secret"
```

## Validation Scripts

### Validate Environment Variables

**File:** `scripts/validate-env.js`

```javascript
#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const required = [
  'CONVEX_DEPLOYMENT',
  'NEXT_PUBLIC_CONVEX_URL',
  'WORKOS_API_KEY',
  'WORKOS_CLIENT_ID',
  'WORKOS_COOKIE_PASSWORD',
  'NEXT_PUBLIC_WORKOS_REDIRECT_URI',
  'NEXT_PUBLIC_APP_URL'
];

let missing = [];

for (const key of required) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`  - ${key}`));
  process.exit(1);
}

// Validate formats
if (process.env.WORKOS_COOKIE_PASSWORD?.length < 32) {
  console.error('❌ WORKOS_COOKIE_PASSWORD must be at least 32 characters');
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

Run validation:
```bash
node scripts/validate-env.js
```

## Security Best Practices

### 1. Secret Generation

```bash
# Generate secure cookie password (32+ characters)
openssl rand -base64 32

# Generate secure API key
openssl rand -hex 32
```

### 2. Secret Rotation

Rotate secrets quarterly:
- WorkOS keys
- Stripe keys
- API tokens
- Cookie passwords

### 3. Access Control

- Use environment-specific credentials
- Never commit secrets to git
- Use `.env.local` (gitignored)
- Limit secret access (principle of least privilege)

### 4. Monitoring

Set up alerts for:
- Invalid API key usage
- Failed authentication attempts
- Rate limit exceeded
- Unusual API usage patterns

## Troubleshooting

### Issue: "Invalid Convex URL"

**Cause:** Mismatch between `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

**Fix:**
```bash
# Get correct URL from Convex dashboard
bunx convex dashboard
# Update .env.local with matching values
```

### Issue: "WorkOS authentication failed"

**Cause:** Incorrect redirect URI or missing variables

**Fix:**
```bash
# Verify redirect URI matches exactly
echo $NEXT_PUBLIC_WORKOS_REDIRECT_URI
# Should match WorkOS dashboard configuration

# Check all WorkOS variables are set
env | grep WORKOS
```

### Issue: "Environment variables not loading"

**Cause:** Wrong file name or location

**Fix:**
```bash
# For Next.js development:
# File must be named: .env.local (not .env or .env.development)
# Location: Project root (not /apps/app)

# For EAS:
# File must be named: .env.{environment}
# Location: apps/mobile/
```

## Next Steps

1. **Generate all secrets** using secure methods
2. **Configure Vercel** environment variables for all projects
3. **Configure Convex** environment variables for staging/production
4. **Set up GitHub Actions** secrets
5. **Configure EAS secrets** for mobile deployment
6. **Test each environment** to verify configuration
7. **Document custom variables** specific to your integrations

---

**Related Documentation:**
- [Deployment Architecture](./DEPLOYMENT-ARCHITECTURE.md)
- [CI/CD Workflows](./CICD-WORKFLOWS.md)
- [Security Setup](./SECURITY-SETUP.md)
