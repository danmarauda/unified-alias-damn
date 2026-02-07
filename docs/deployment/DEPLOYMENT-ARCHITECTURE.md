# 🚀 Enterprise Deployment Architecture
**ALIAS Platform - Vercel + EAS + Convex**

Last Updated: October 23, 2025

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Strategy](#environment-strategy)
4. [Vercel Setup](#vercel-setup)
5. [EAS Mobile Setup](#eas-mobile-setup)
6. [CI/CD Automation](#cicd-automation)
7. [Security](#security)
8. [Monitoring](#monitoring)
9. [Cost Optimization](#cost-optimization)
10. [Deployment Playbooks](#deployment-playbooks)

---

## Overview

The ALIAS Enterprise Platform uses a modern, scalable deployment architecture combining:
- **Vercel** - Web platform (super admin + client workspaces)
- **EAS** (Expo Application Services) - Mobile apps (iOS + Android)
- **Convex** - Real-time backend (unified across all platforms)
- **GitHub Actions** - CI/CD automation
- **Turborepo** - Monorepo orchestration

### Key Features
- ✅ **7 Environments** - Development, Preview, Staging, Production (web + mobile)
- ✅ **Zero-Downtime Deployments** - Instant rollbacks, preview environments
- ✅ **Selective Deployment** - Only builds changed apps (saves $$ and time)
- ✅ **OTA Updates** - Mobile updates without app store approval
- ✅ **Enterprise Security** - WAF, CSP, SAML SSO, audit logs
- ✅ **Comprehensive Monitoring** - Real-time observability across all platforms

---

## Architecture

### Platform Topology

```
┌──────────────────────────────────────────────────────────────┐
│                  ALIAS Enterprise Platform                    │
└────┬───────────────────────────────────────────────┬──────────┘
     │                                               │
     │                                               │
┌────▼──────────────────┐              ┌────────────▼─────────┐
│   Web Platform        │              │   Mobile Platform    │
│   (5 Vercel Projects) │              │   (iOS + Android)    │
├───────────────────────┤              ├──────────────────────┤
│ • Super Admin Portal  │              │ • React Native       │
│ • Client Workspaces   │              │ • Expo + EAS         │
│ • Marketing Site      │              │ • OTA Updates        │
│ • Documentation       │              │ • App Stores         │
│ • API Gateway         │              └──────────┬───────────┘
└───────────┬───────────┘                         │
            │                                     │
            │         ┌───────────────────────────┘
            │         │
       ┌────▼─────────▼────┐
       │   Convex Backend  │
       │   (Unified Layer) │
       ├───────────────────┤
       │ • Real-time Sync  │
       │ • Multi-tenant    │
       │ • RBAC           │
       │ • File Storage    │
       └───────────────────┘
```

### Monorepo Structure

```
alias-platform/
├── apps/
│   ├── super-admin/          → Vercel Project 1
│   ├── client-workspace/     → Vercel Project 2
│   ├── marketing/            → Vercel Project 3
│   ├── docs/                 → Vercel Project 4
│   └── api/                  → Vercel Project 5
├── mobile/
│   └── app/                  → EAS (iOS + Android)
├── packages/
│   ├── ui/                   → Shared components (shadcn/ui)
│   ├── database/             → Convex functions & schema
│   ├── auth/                 → WorkOS integration
│   ├── analytics/            → Observability utilities
│   └── config/               → Shared configs
├── docs/
│   └── deployment/           → This documentation
└── .github/
    └── workflows/            → CI/CD automation
```

---

## Environment Strategy

### Complete Environment Matrix

| Environment | Web URL | Mobile Channel | Convex Deployment | Purpose |
|-------------|---------|----------------|-------------------|---------|
| **Development** | `localhost:3000` | `development` | `dev:alias-xxx` | Local development |
| **Preview (PR)** | `*.vercel.app` | `preview` | Auto-generated | PR testing |
| **Staging** | `staging.alias.com` | `internal` | `staging:alias-xxx` | QA validation |
| **Production** | `alias.com` | `production` | `prod:alias-xxx` | Live users |

### Environment Purpose & Access

**Development:**
- **Purpose:** Local development on developer machines
- **Access:** All developers
- **Data:** Local seed data
- **Convex:** `bunx convex dev`

**Preview (Pull Requests):**
- **Purpose:** Test changes before merging
- **Access:** Team members via PR comment links
- **Data:** Isolated, fresh database per PR
- **Convex:** Auto-deployed with preview deploy key
- **Lifecycle:** Destroyed when PR is closed

**Staging:**
- **Purpose:** QA testing, integration testing, demo
- **Access:** QA team, stakeholders, clients
- **Data:** Production-like data (sanitized)
- **Convex:** Persistent staging deployment
- **Deployment:** Manual trigger or auto-deploy from `staging` branch

**Production:**
- **Purpose:** Live users
- **Access:** All customers
- **Data:** Real production data
- **Convex:** Production deployment
- **Deployment:** Manual approval required

---

## Vercel Setup

### Prerequisites

1. Vercel Team/Organization account (Enterprise plan)
2. GitHub organization with repositories
3. Bun installed locally
4. Turborepo knowledge (see reference repos)

### Project Creation

**Create 5 Vercel Projects:**

1. **super-admin-alias**
   - Framework: Next.js 15
   - Root Directory: `/apps/super-admin`
   - Build Command: `npx turbo build --filter=super-admin`
   - Install Command: Auto-detected (bun)

2. **client-workspace-alias**
   - Framework: Next.js 15
   - Root Directory: `/apps/client-workspace`
   - Build Command: `npx turbo build --filter=client-workspace`

3. **marketing-alias**
   - Framework: Next.js 15
   - Root Directory: `/apps/marketing`
   - Build Command: `npx turbo build --filter=marketing`

4. **docs-alias**
   - Framework: Next.js 15
   - Root Directory: `/apps/docs`
   - Build Command: `npx turbo build --filter=docs`

5. **api-alias**
   - Framework: Next.js 15 (Edge API)
   - Root Directory: `/apps/api`
   - Build Command: `npx turbo build --filter=api`

### Ignore Build Step (Critical!)

**Each project's vercel.json:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "ignoreCommand": "npx turbo-ignore"
}
```

This prevents unnecessary builds when only other apps changed!

### Environment Variables Setup

**Production Environment Variables:**
```bash
# Convex
CONVEX_DEPLOYMENT=prod:alias-platform-xxx
NEXT_PUBLIC_CONVEX_URL=https://alias-platform.convex.cloud

# WorkOS Authentication
WORKOS_API_KEY=[From 1Password/Vault]
WORKOS_CLIENT_ID=[From 1Password/Vault]
WORKOS_COOKIE_PASSWORD=[Generate: openssl rand -base64 32]
NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://alias.com/callback

# Integrations
STRIPE_SECRET_KEY=[From Stripe Dashboard]
STRIPE_WEBHOOK_SECRET=[From Stripe Webhooks]
AXIOM_TOKEN=[From Axiom Dashboard]
ROAM_HQ_API_KEY=[From ROAM.HQ]

# HashiCorp Vault
VAULT_ADDR=https://vault.alias.com
VAULT_TOKEN=[Service token]
```

**Preview Environment Variables:**
```bash
CONVEX_DEPLOY_KEY=[Preview deploy key from Convex]
# Other variables auto-populated or use defaults
```

**Variable Encryption:**
- Mark sensitive variables as "Sensitive" in Vercel dashboard
- Never expose secrets in logs
- Use Vercel's built-in encryption (at rest + in transit)

---

## EAS Mobile Setup

### Installation

```bash
# Install EAS CLI globally
bun add -g eas-cli

# Login to Expo
eas login

# Initialize EAS in mobile project
cd mobile/app
eas init --id [YOUR_PROJECT_ID]
```

### eas.json Configuration

**Location:** `/mobile/app/eas.json`

```json
{
  "cli": {
    "version": ">= 12.5.3",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "env": {
        "EXPO_PUBLIC_CONVEX_URL": "$CONVEX_DEV_URL",
        "EXPO_PUBLIC_API_URL": "http://localhost:3000/api"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_CONVEX_URL": "$CONVEX_STAGING_URL",
        "EXPO_PUBLIC_API_URL": "https://staging.alias.com/api"
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_CONVEX_URL": "$CONVEX_PROD_URL",
        "EXPO_PUBLIC_API_URL": "https://alias.com/api"
      }
    },
    "internal": {
      "distribution": "internal",
      "channel": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_CONVEX_URL": "$CONVEX_STAGING_URL",
        "EXPO_PUBLIC_API_URL": "https://staging.alias.com/api"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production",
        "releaseStatus": "completed"
      },
      "ios": {
        "ascAppId": "APPLE_APP_ID_HERE",
        "appleId": "your-apple-id@alias.com",
        "appleTeamId": "TEAM_ID_HERE"
      }
    },
    "preview": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal",
        "releaseStatus": "draft"
      },
      "ios": {
        "ascAppId": "APPLE_APP_ID_HERE",
        "appleTeamId": "TEAM_ID_HERE"
      }
    }
  }
}
```

### EAS Secrets Setup

```bash
# Set secrets via EAS CLI
eas secret:create --name CONVEX_DEV_URL --value "https://dev-alias.convex.cloud"
eas secret:create --name CONVEX_STAGING_URL --value "https://staging-alias.convex.cloud"
eas secret:create --name CONVEX_PROD_URL --value "https://alias.convex.cloud"
eas secret:create --name SENTRY_DSN --value "https://sentry.io/..."

# List all secrets
eas secret:list
```

### Update Channels Strategy

**Channels correspond to build profiles:**
- `development` - Dev builds
- `preview`/`internal` - TestFlight/Play Internal
- `production` - App Store/Play Store

**Publishing Updates:**
```bash
# Development
eas update --branch development --message "Feature: Add dark mode"

# Preview (for internal testing)
eas update --branch preview --message "RC: v1.2.0"

# Production (live users)
eas update --branch production --message "v1.2.0: Bug fixes and improvements"
```

**When to use OTA updates:**
- ✅ JavaScript/React code changes
- ✅ Asset updates (images, icons, fonts)
- ✅ Minor UI tweaks
- ✅ Bug fixes that don't require native changes
- ❌ Native module changes (need full build)
- ❌ Expo SDK version upgrades (need full build)
- ❌ Changes to `app.json` config (need full build)

---

## CI/CD Automation

See: [`CICD-WORKFLOWS.md`](./CICD-WORKFLOWS.md) for complete workflow configurations

### Workflow Overview

**Web (Vercel):**
1. **web-preview.yml** - Auto-deploy on PR creation
2. **web-staging.yml** - Deploy to staging on `staging` branch push
3. **web-production.yml** - Deploy to production on `main` branch push (requires approval)

**Mobile (EAS):**
1. **mobile-preview.yml** - Build preview on mobile changes in PR
2. **mobile-production.yml** - Build and submit to stores (manual trigger)

**Quality:**
1. **test.yml** - Run tests on all PRs
2. **security-scan.yml** - Security scanning before production

---

## Security

### Vercel Security Checklist

- [ ] **Deployment Protection** enabled on all projects
- [ ] **WAF configured** with custom rules (block bad bots)
- [ ] **Content Security Policy** headers configured
- [ ] **Rate limiting** enabled (prevent abuse)
- [ ] **IP blocking** if geo-restrictions needed
- [ ] **SAML SSO** enabled (Enterprise)
- [ ] **Audit logs** enabled (Enterprise)
- [ ] **Log drains** configured → Axiom
- [ ] **Sensitive env variables** marked as sensitive
- [ ] **Preview deployment suffix** using custom domain

### Mobile Security Checklist

- [ ] **Code signing** certificates valid
- [ ] **API keys** not hardcoded (use env variables)
- [ ] **SSL pinning** implemented
- [ ] **Sentry** error tracking configured
- [ ] **App store credentials** secured
- [ ] **ProGuard/R8** enabled (Android obfuscation)

---

## Monitoring

### Observability Stack

**Web (Vercel):**
- ✅ **Speed Insights** - Core Web Vitals (TTFB, FCP, LCP)
- ✅ **Web Analytics** - User behavior, page views
- ✅ **Observability Plus** (Enterprise) - Distributed tracing
- ✅ **Log Drains** → Axiom - Centralized logging

**Mobile (EAS):**
- ✅ **Sentry** - Crash reporting, error tracking
- ✅ **EAS Insights** - Build analytics, update metrics
- ✅ **App Store Connect** - iOS crash analytics
- ✅ **Play Console** - Android vitals

**Backend (Convex):**
- ✅ **Convex Dashboard** - Function logs, query performance
- ✅ **OpenTelemetry** - Distributed tracing
- ✅ **Real-time metrics** - Active connections, data sync

### Alert Configuration

**Critical Alerts (PagerDuty/Slack):**
- Production deployment failures
- Error rate >1%
- P95 latency >2s
- Spend threshold >80% budget

**Warning Alerts (Slack):**
- Staging deployment failures
- Build time >10min
- Test failures
- Security scan issues

---

## Cost Optimization

### Vercel Optimization

1. **✅ Turbo-ignore** - Prevents unnecessary builds (saves compute)
2. **✅ Edge caching** - Cache static assets and API responses
3. **✅ ISR configuration** - Optimize revalidation intervals
4. **✅ Image optimization** - Use Vercel Image (new pricing model)
5. **✅ Fluid Compute** - Reduce cold starts
6. **✅ Spend management** - Set alerts at 80% budget

### EAS Optimization

1. **✅ Use OTA updates** - 80% of releases should be OTA (no build cost)
2. **✅ Build caching** - Cache dependencies to speed up builds
3. **✅ Selective builds** - Build iOS/Android independently when needed
4. **✅ Resource classes** - Use appropriate build machine sizes

### Monthly Cost Estimates

**Vercel (Enterprise ~$350-900/mo):**
- Base plan: $150-400/mo (5 projects)
- Compute usage: $200-500/mo (scales with traffic)

**EAS (Production Plan $999/mo):**
- Unlimited builds
- Priority build queue
- EAS Insights included

**Convex (Scale Plan ~$200-500/mo):**
- Real-time bandwidth
- Storage
- Function execution

**Total: $1,549-2,399/mo** (grows with scale)

---

## Deployment Playbooks

### Web Deployment

**1. Preview (Automatic on PR):**
```bash
# Create feature branch
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create PR on GitHub
# → Vercel auto-deploys preview
# → Comment posted with preview URL
```

**2. Staging (Manual):**
```bash
git checkout staging
git merge develop
git push origin staging
# → Triggers staging workflow
# → Deploys to staging.alias.com
```

**3. Production (Manual Approval):**
```bash
git checkout main
git merge staging
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
# → Triggers production workflow
# → Requires manual approval in GitHub
# → Deploys to alias.com
```

**4. Rollback:**
```bash
# Option A: Vercel Dashboard (instant)
# Click "Promote to Production" on previous deployment

# Option B: Git revert
git revert HEAD
git push origin main
```

### Mobile Deployment

**1. Development Build:**
```bash
cd mobile/app
eas build --profile development --platform all
# Install on dev devices via QR code
```

**2. Preview/Internal Build:**
```bash
eas build --profile preview --platform all
# Uploads to TestFlight (iOS) and Play Internal Track (Android)
# Notify QA team
```

**3. Production Release:**
```bash
# Step 1: Build production binaries
eas build --profile production --platform all --auto-submit

# Step 2: Wait for store review and approval

# Step 3: For hotfixes (JavaScript only), use OTA update
eas update --branch production --message "Hotfix: Fix critical bug"
```

---

## Troubleshooting

### Common Issues

**Vercel Build Fails:**
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Test build locally: `bun run build`
4. Check turbo.json configuration

**EAS Build Fails:**
1. Check build logs: `eas build:list`
2. Verify credentials: `eas credentials`
3. Check eas.json syntax
4. Test locally with Expo Go

**Deployment Not Triggered:**
1. Check GitHub Actions tab for errors
2. Verify secrets are set in GitHub
3. Check branch protection rules
4. Verify webhook is configured

---

## Next Steps

1. ✅ Review this documentation
2. [ ] Set up Turborepo monorepo
3. [ ] Create Vercel projects
4. [ ] Configure EAS
5. [ ] Set up GitHub Actions
6. [ ] Configure environment variables
7. [ ] Test preview deployments
8. [ ] Deploy to staging
9. [ ] Production deployment

---

**For detailed CI/CD workflows, see:** [`CICD-WORKFLOWS.md`](./CICD-WORKFLOWS.md)
**For environment variable reference, see:** [`ENV-VARIABLES.md`](./ENV-VARIABLES.md)
**For security configuration, see:** [`SECURITY-SETUP.md`](./SECURITY-SETUP.md)
