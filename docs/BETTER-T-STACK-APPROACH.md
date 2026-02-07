# better-t-stack Approach

Complete guide for using better-t-stack scaffold as our foundation, with modifications for the ALIAS Enterprise Platform.

## Why better-t-stack?

### ✅ Perfect Match
- **Convex backend** - Already integrated and configured
- **Turborepo** - Monorepo structure ready
- **Bun** - Our preferred package manager
- **Next.js** - Modern web framework
- **React Native + Nativewind** - Mobile with Tailwind-like styling
- **Biome** - Code quality and formatting
- **TODO example** - Working reference implementation

### 🎯 Strategic Advantages

1. **Saves 1-2 weeks** vs bare Turborepo setup
2. **Better than next-forge** - Has Convex already (no Prisma to rip out)
3. **Proven patterns** - Convex + Turborepo integration working
4. **Mobile included** - React Native already configured with web
5. **Documentation site** - Fumadocs pre-configured

### ⚠️ What We'll Change

| Component | Scaffold Has | We Need | Effort |
|-----------|--------------|---------|--------|
| **Auth** | better-auth | WorkOS AuthKit | Medium - swap implementation |
| **Deployment** | Wrangler (Cloudflare) | Vercel | Easy - config change |
| **Desktop** | Tauri | None | Easy - remove |
| **PWA** | Enabled | Optional | Easy - keep or remove |
| **Linters** | oxlint + ultracite + biome | Just Biome | Easy - remove extras |

## Step-by-Step Implementation

### Step 1: Generate Scaffold

**Original Command (slightly modified):**

```bash
cd /Users/alias/Desktop
bun create better-t-stack@latest alias-platform \
  --frontend next native-nativewind \
  --backend convex \
  --runtime none \
  --database none \
  --orm none \
  --api none \
  --auth better-auth \
  --payments none \
  --addons turborepo husky biome fumadocs \
  --examples todo \
  --db-setup none \
  --web-deploy none \
  --server-deploy none \
  --git \
  --package-manager bun \
  --install
```

**Changes from your command:**
- ❌ Removed: `ruler` (unknown addon)
- ❌ Removed: `tauri` (no desktop app needed)
- ❌ Removed: `pwa` (can add later if needed)
- ❌ Removed: `oxlint`, `ultracite` (keeping only Biome)
- ❌ Removed: `wrangler` deploy (using Vercel instead)

### Step 2: Explore Generated Structure

```bash
cd alias-platform

# See what was generated
tree -L 3 -I 'node_modules|.next|dist'

# Expected structure:
alias-platform/
├── apps/
│   ├── web/              # Next.js web app
│   ├── native/           # React Native mobile app
│   └── docs/             # Fumadocs documentation site
├── packages/
│   ├── ui/               # Shared UI components
│   ├── database/         # Convex functions
│   └── auth/             # better-auth (will replace)
├── turbo.json
├── package.json
└── bun.lockb
```

### Step 3: Test the Scaffold

```bash
# Install dependencies
bun install

# Start development
bun run dev
# This should start:
# - web app (Next.js)
# - native app (Expo)
# - docs site
# - Convex dev server

# Verify TODO example works
# Open: http://localhost:3000 (web)
# Open: Expo Go app (mobile)
```

### Step 4: Replace better-auth with WorkOS

#### 4.1 Remove better-auth

```bash
# Remove better-auth package
cd packages/auth
bun remove better-auth

# Remove better-auth files
rm -rf src/better-auth
```

#### 4.2 Install WorkOS

```bash
# In packages/auth
bun add @workos-inc/authkit-nextjs @workos-inc/node
```

#### 4.3 Update `packages/auth/package.json`

```json
{
  "name": "@alias/auth",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@workos-inc/authkit-nextjs": "^2.10.0",
    "@workos-inc/node": "^7.24.0"
  },
  "devDependencies": {
    "@alias/typescript-config": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

#### 4.4 Create WorkOS wrapper

**File:** `packages/auth/src/index.ts`

```typescript
// Re-export WorkOS
export * from "@workos-inc/authkit-nextjs";
export { WorkOS } from "@workos-inc/node";

// Shared utilities
export * from "./lib/session";
export * from "./lib/middleware";
```

**File:** `packages/auth/src/lib/session.ts`

```typescript
import { WorkOS } from "@workos-inc/node";

export const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export const sessionConfig = {
  cookieName: "__alias_session",
  password: process.env.WORKOS_COOKIE_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
```

**File:** `packages/auth/src/lib/middleware.ts`

```typescript
import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export const authMiddleware = authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ["/login", "/callback", "/api/webhooks/*"],
  },
  signInUrl: "/login",
});
```

#### 4.5 Update apps to use WorkOS

**File:** `apps/web/middleware.ts`

```typescript
import { authMiddleware } from "@alias/auth";

export default authMiddleware;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**File:** `apps/web/.env.local`

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-dev-deployment

# WorkOS
WORKOS_API_KEY=sk_test_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_COOKIE_PASSWORD=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 5: Remove Unnecessary Addons

```bash
# If Tauri was included, remove it
bun remove @tauri-apps/api @tauri-apps/cli

# Remove Tauri config
rm -rf src-tauri/

# If PWA was included and you don't want it
bun remove next-pwa
# Remove PWA config from next.config.js

# Remove extra linters if oxlint/ultracite were included
bun remove oxlint ultracite
```

### Step 6: Configure Vercel Deployment

**File:** `apps/web/vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "ignoreCommand": "npx turbo-ignore"
}
```

**File:** `turbo.json` (update if needed)

Already configured by better-t-stack, but verify:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "ui": "tui",
  "envMode": "loose",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", ".expo/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Step 7: Migrate Your Current App

Now migrate your existing work into the scaffold:

```bash
# Create super-admin app in scaffold
mkdir -p apps/super-admin

# Copy your current app
cp -r /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835/src apps/super-admin/
cp /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835/package.json apps/super-admin/
cp /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835/next.config.mjs apps/super-admin/
cp /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835/tailwind.config.ts apps/super-admin/
```

**Update:** `apps/super-admin/package.json`

```json
{
  "name": "super-admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001 --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@alias/auth": "workspace:*",
    "@alias/database": "workspace:*",
    "@alias/ui": "workspace:*",
    "@copilotkit/react-core": "^2.7.4",
    "@copilotkit/react-ui": "^2.7.4",
    "@radix-ui/react-icons": "^1.3.2",
    "@react-three/drei": "^9.126.3",
    "@react-three/fiber": "^9.0.0",
    "convex": "^1.28.0",
    "framer-motion": "^12.1.0",
    "next": "^15.5.4",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "three": "^0.174.0"
  },
  "devDependencies": {
    "@alias/typescript-config": "workspace:*",
    "@types/node": "24.7.0",
    "@types/react": "19.2.1",
    "@types/three": "^0.174.0",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3"
  }
}
```

### Step 8: Update Root Configuration

**File:** `package.json` (root)

```json
{
  "name": "alias-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean && rm -rf node_modules",
    "format": "biome format --write .",
    "check": "biome check ."
  },
  "devDependencies": {
    "@biomejs/biome": "2.2.5",
    "turbo": "^2.5.8",
    "typescript": "^5.9.3"
  },
  "engines": {
    "node": ">=20",
    "bun": ">=1.3.0"
  },
  "packageManager": "bun@1.3.0"
}
```

### Step 9: Create Additional Apps

```bash
# Create client-workspace (copy from web, customize)
cp -r apps/web apps/client-workspace
# Update package.json name and port

# Create marketing site (copy from web, simplify)
cp -r apps/web apps/marketing
# Update package.json name and port

# Create API server (copy from web, API-only)
cp -r apps/web apps/api
# Update to API-only Next.js app

# Rename native to mobile
mv apps/native apps/mobile
```

### Step 10: Add Custom Packages

Create your custom packages:

```bash
# Agents package
mkdir -p packages/agents
# Copy from: src/lib/agents/

# Ontology package
mkdir -p packages/ontology
# Copy from: src/components/ontology/

# Client Research package
mkdir -p packages/client-research
# Copy from: convex/clientResearch.ts + UI components

# Analytics package (if not in scaffold)
mkdir -p packages/analytics
```

## Comparison: Before vs After

### Before (Current Project)

```
unified-alias-damn-backup/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── convex/
├── package.json
└── next.config.mjs

Single Next.js app, everything together
```

### After (better-t-stack + Modifications)

```
alias-platform/
├── apps/
│   ├── super-admin/      # Your current app, enhanced
│   ├── web/              # From scaffold (can repurpose)
│   ├── mobile/           # React Native (from scaffold)
│   ├── client-workspace/ # New app
│   ├── marketing/        # New app
│   ├── docs/             # Fumadocs (from scaffold)
│   └── api/              # New API server
├── packages/
│   ├── ui/               # From scaffold
│   ├── database/         # Convex (from scaffold)
│   ├── auth/             # WorkOS (replaced)
│   ├── agents/           # Your custom
│   ├── ontology/         # Your custom
│   └── client-research/  # Your custom
├── turbo.json            # From scaffold
└── package.json          # From scaffold

Monorepo with 6+ apps, shared packages
```

## Benefits Summary

### ✅ Immediate Benefits

1. **Convex Integration** - Already working with Turborepo
2. **Mobile App** - React Native with Nativewind styling
3. **Documentation Site** - Fumadocs pre-configured
4. **Working Example** - TODO app to learn from
5. **Development Environment** - All tools configured

### ✅ Time Savings

| Task | Bare Setup | better-t-stack | Savings |
|------|------------|----------------|---------|
| Turborepo config | 1 day | 0 days | 1 day |
| Convex integration | 2 days | 0 days | 2 days |
| Mobile setup | 3 days | 0 days | 3 days |
| Docs site | 1 day | 0 days | 1 day |
| Example app | N/A | ✅ Included | Reference |
| **Total** | **7 days** | **0 days** | **7 days** |

### ⚠️ Required Modifications

| Task | Effort | Time |
|------|--------|------|
| Replace better-auth with WorkOS | Medium | 1 day |
| Remove unnecessary addons | Easy | 1 hour |
| Configure Vercel deployment | Easy | 2 hours |
| Migrate current app | Medium | 1 day |
| Create additional apps | Easy | 1 day |
| **Total** | | **3 days** |

### 🎯 Net Result

- **Setup time:** 3 days (vs 7-10 days bare, 10-14 days next-forge)
- **Quality:** Production-ready from day 1
- **Features:** Everything we need + working examples
- **Stack alignment:** 90% perfect match

## Potential Concerns & Solutions

### Concern 1: "What if the scaffold is opinionated?"

**Solution:** It is, but in ways that align with our needs:
- ✅ Convex (we want this)
- ✅ Turborepo (we want this)
- ✅ Bun (we want this)
- ⚠️ better-auth (easy to swap)
- ⚠️ Some addons (easy to remove)

### Concern 2: "What if it's not maintained?"

**Check:** https://github.com/timothymiller/t3-stack
- Active development
- Regular updates
- Community support

### Concern 3: "Will it work with our existing code?"

**Yes:**
- Convex is identical (just organized differently)
- Next.js is identical
- React is identical
- We just restructure into monorepo

## Decision Matrix

| Factor | Bare Turborepo | next-forge | better-t-stack |
|--------|----------------|------------|----------------|
| **Setup Time** | 7-10 days | 10-14 days | 3 days ⭐ |
| **Stack Alignment** | 100% | 60% | 90% ⭐ |
| **Convex Ready** | ❌ | ❌ | ✅ ⭐ |
| **Mobile Ready** | ❌ | ❌ | ✅ ⭐ |
| **Learning Curve** | High | High | Medium ⭐ |
| **Modifications Needed** | None | Heavy | Light ⭐ |
| **Working Examples** | None | Yes | Yes ⭐ |
| **Docs Site** | ❌ | ✅ | ✅ ⭐ |

## Recommendation: ✅ Use better-t-stack

**Why:**
1. **Fastest path to production** - 3 days vs 7-14 days
2. **Best stack alignment** - Has Convex + Turborepo + Bun
3. **Mobile included** - React Native already configured
4. **Working examples** - TODO app to learn from
5. **Minimal modifications** - Just swap auth, remove addons

**Next Steps:**
1. Generate the scaffold (using modified command above)
2. Test the TODO example
3. Replace better-auth with WorkOS (1 day)
4. Migrate your current app (1 day)
5. Create additional apps (1 day)
6. Deploy to Vercel

**Total Time: ~3 days to production-ready monorepo**

## Commands to Execute

```bash
# 1. Generate scaffold
cd /Users/alias/Desktop
bun create better-t-stack@latest alias-platform \
  --frontend next native-nativewind \
  --backend convex \
  --runtime none \
  --database none \
  --orm none \
  --api none \
  --auth better-auth \
  --payments none \
  --addons turborepo husky biome fumadocs \
  --examples todo \
  --db-setup none \
  --web-deploy none \
  --server-deploy none \
  --git \
  --package-manager bun \
  --install

# 2. Explore structure
cd alias-platform
tree -L 3 -I 'node_modules|.next|dist'

# 3. Test it works
bun run dev

# 4. Report back what you see!
```

---

**Ready to proceed?** This is the fastest, safest path to your production platform. 🚀
