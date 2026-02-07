# Monorepo Setup Guide

Complete guide for setting up the ALIAS Enterprise Platform monorepo using Turborepo, inspired by next-forge patterns but adapted for Convex + WorkOS + Bun.

## Overview

We're using a **hybrid approach**: learn from next-forge's excellent structure, but build our own implementation with our stack (Convex, WorkOS, Bun).

## Why This Approach?

### ✅ Advantages
- **Best practices from next-forge** - Production-proven patterns
- **No wrong dependencies** - Build exactly what we need
- **Preserve existing work** - Migrate current app, don't rebuild
- **Full control** - Every line of code is intentional
- **Optimized for our stack** - Convex, WorkOS, Bun

### ❌ Why Not Pure next-forge?
- Uses Prisma (we use Convex)
- Uses custom auth (we use WorkOS)
- Uses pnpm (we use Bun)
- Has packages we don't need
- Would require massive rip-and-replace

## Final Structure

```
alias-platform/
├── apps/
│   ├── super-admin/       # Internal operations dashboard
│   ├── client-workspace/  # Customer self-service portal
│   ├── marketing/         # Public marketing site
│   ├── docs/              # Documentation site
│   ├── api/               # REST API server
│   └── mobile/            # React Native (Expo)
│
├── packages/
│   ├── backend/           # Convex functions & schema
│   ├── auth/              # WorkOS wrapper
│   ├── ui/                # shadcn/ui + custom components
│   ├── analytics/         # OpenPanel wrapper
│   ├── logger/            # Logging utilities
│   ├── typescript-config/ # Shared TypeScript configs
│   ├── agents/            # AI agent management (custom)
│   ├── ontology/          # Ontology editor logic (custom)
│   └── client-research/   # Client research system (custom)
│
├── turbo.json             # Turborepo configuration
├── package.json           # Root dependencies
├── bun.lockb              # Bun lockfile
└── docs/                  # Documentation
```

## Step-by-Step Setup

### Step 1: Create Bare Monorepo

```bash
# Create new directory (don't use current project yet)
mkdir alias-platform-new
cd alias-platform-new

# Initialize Bun workspace
bun init

# Install Turborepo
bun add turbo --dev
```

### Step 2: Create Root Configuration

**File:** `package.json`

```json
{
  "name": "alias-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@biomejs/biome": "2.2.5",
    "@types/node": "^24.7.0",
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

**File:** `turbo.json` (adapted from next-forge)

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "ui": "tui",
  "envMode": "loose",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "**/dist/**",
        "**/.expo/**"
      ]
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
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

**File:** `biome.json` (code quality)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules", ".next", "dist", ".expo", ".turbo"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```

### Step 3: Create Shared TypeScript Config

```bash
mkdir -p packages/typescript-config
```

**File:** `packages/typescript-config/package.json`

```json
{
  "name": "@alias/typescript-config",
  "version": "1.0.0",
  "private": true,
  "files": [
    "base.json",
    "nextjs.json",
    "react-library.json"
  ]
}
```

**File:** `packages/typescript-config/base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "noUncheckedIndexedAccess": true
  },
  "exclude": ["node_modules"]
}
```

**File:** `packages/typescript-config/nextjs.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 4: Create Backend Package (Convex Wrapper)

```bash
mkdir -p packages/backend
```

**File:** `packages/backend/package.json`

```json
{
  "name": "@alias/backend",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "convex": "^1.28.0"
  },
  "devDependencies": {
    "@alias/typescript-config": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

**File:** `packages/backend/index.ts`

```typescript
// Re-export Convex helpers
export * from "convex/server";
export * from "convex/values";

// Shared utilities
export * from "./lib/auth";
export * from "./lib/permissions";
export * from "./lib/multi-tenant";
```

**File:** `packages/backend/convex.json`

```json
{
  "functions": "./convex",
  "node": {
    "version": "20"
  }
}
```

### Step 5: Create Auth Package (WorkOS Wrapper)

```bash
mkdir -p packages/auth
```

**File:** `packages/auth/package.json`

```json
{
  "name": "@alias/auth",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
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

**File:** `packages/auth/index.ts`

```typescript
// Re-export WorkOS
export * from "@workos-inc/authkit-nextjs";
export { WorkOS } from "@workos-inc/node";

// Shared auth utilities
export * from "./lib/session";
export * from "./lib/middleware";
```

### Step 6: Create UI Package (shadcn/ui)

```bash
mkdir -p packages/ui
```

**File:** `packages/ui/package.json`

```json
{
  "name": "@alias/ui",
  "version": "1.0.0",
  "private": true,
  "main": "./index.tsx",
  "types": "./index.tsx",
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.545.0",
    "next-themes": "^0.4.6",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@alias/typescript-config": "workspace:*",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.0",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3"
  }
}
```

**File:** `packages/ui/index.tsx`

```typescript
// Export all shadcn/ui components
export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/dialog";
export * from "./components/ui/input";
export * from "./components/ui/label";
export * from "./components/ui/select";
export * from "./components/ui/separator";
export * from "./components/ui/tabs";
export * from "./components/ui/toast";

// Export utilities
export { cn } from "./lib/utils";
```

### Step 7: Create Analytics Package

```bash
mkdir -p packages/analytics
```

**File:** `packages/analytics/package.json`

```json
{
  "name": "@alias/analytics",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "@openpanel/nextjs": "latest"
  },
  "devDependencies": {
    "@alias/typescript-config": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

**File:** `packages/analytics/index.ts`

```typescript
// Re-export OpenPanel
export * from "@openpanel/nextjs";

// Custom event tracking
export * from "./lib/events";
```

### Step 8: Create Logger Package

```bash
mkdir -p packages/logger
```

**File:** `packages/logger/package.json`

```json
{
  "name": "@alias/logger",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "devDependencies": {
    "@alias/typescript-config": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

**File:** `packages/logger/index.ts`

```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, context);
    }
  },
  info: (message: string, context?: LogContext) => {
    console.info(`[INFO] ${message}`, context);
  },
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context);
  },
  error: (message: string, context?: LogContext) => {
    console.error(`[ERROR] ${message}`, context);
  },
};
```

### Step 9: Migrate Current App

```bash
# Copy current app to new structure
cp -r /Users/alias/Desktop/unified-alias-damn-backup-20250804-103835 apps/super-admin

# Update package.json dependencies to use workspace packages
```

**File:** `apps/super-admin/package.json` (updated)

```json
{
  "name": "super-admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000 --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@alias/analytics": "workspace:*",
    "@alias/auth": "workspace:*",
    "@alias/backend": "workspace:*",
    "@alias/logger": "workspace:*",
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
    "@types/react-dom": "19.2.0",
    "@types/three": "^0.174.0",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3"
  }
}
```

### Step 10: Create Other Apps (Placeholders)

```bash
# Create placeholder apps (we'll build these later)
mkdir -p apps/client-workspace
mkdir -p apps/marketing
mkdir -p apps/docs
mkdir -p apps/api
mkdir -p apps/mobile
```

## Next Steps After Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Test the monorepo:**
   ```bash
   bun run dev
   ```

3. **Verify Turborepo:**
   ```bash
   turbo run build --dry-run
   ```

4. **Add Convex to backend package:**
   ```bash
   cd packages/backend
   bunx convex dev
   ```

5. **Configure Vercel projects** (see: [DEPLOYMENT-ARCHITECTURE.md](./deployment/DEPLOYMENT-ARCHITECTURE.md))

## Comparison: What We Learned from next-forge

| Aspect | next-forge | Our Implementation |
|--------|-----------|-------------------|
| **Package Manager** | pnpm | Bun (5.6x faster) |
| **Backend** | Prisma + PostgreSQL | Convex (real-time) |
| **Auth** | Custom | WorkOS AuthKit |
| **Structure** | ✅ Excellent | ✅ Adapted their structure |
| **turbo.json** | ✅ Excellent | ✅ Used their config |
| **Package pattern** | ✅ Excellent | ✅ Used workspace:* pattern |
| **Testing** | Vitest | ✅ Keeping Vitest |
| **Code quality** | Biome | ✅ Keeping Biome |

## Why This Is Better Than Starting from next-forge

### ✅ Pros of Our Approach
1. **No rip-and-replace** - We keep what we need
2. **Preserve existing work** - Current app becomes super-admin
3. **Optimized for our stack** - Every package is intentional
4. **Learned from the best** - next-forge's structure is excellent
5. **Full control** - We understand every line

### ❌ Cons of Starting from next-forge
1. Would need to remove Prisma → Add Convex
2. Would need to remove their auth → Add WorkOS
3. Would need to remove pnpm → Switch to Bun
4. Would have many unused packages
5. Would take longer to "clean up" than to build clean

## Timeline Estimate

- **Day 1-2:** Create monorepo structure (Steps 1-8)
- **Day 3:** Migrate current app (Step 9)
- **Day 4:** Test everything works
- **Day 5:** Create placeholder apps and deploy

**Total:** ~1 week to complete monorepo foundation

## Verification Checklist

After setup, verify:

- [ ] `bun install` works without errors
- [ ] `bun run dev` starts all apps
- [ ] `turbo run build` builds all packages
- [ ] TypeScript has no errors (`bun run typecheck`)
- [ ] Biome linting passes (`bun run lint`)
- [ ] Convex dev server connects
- [ ] WorkOS authentication works
- [ ] All workspace packages resolve correctly

## Troubleshooting

### Issue: "Cannot find module @alias/..."

**Fix:** Run `bun install` in root directory

### Issue: "Convex not found"

**Fix:** Ensure `packages/backend` has Convex installed:
```bash
cd packages/backend
bun add convex
```

### Issue: "Turbo command not found"

**Fix:** Install Turbo globally or use bunx:
```bash
bun add -g turbo
# OR
bunx turbo <command>
```

## Next Documentation

- [Phase 0 Implementation](./PHASE-0-IMPLEMENTATION.md) (create this next)
- [Deployment Architecture](./deployment/DEPLOYMENT-ARCHITECTURE.md)
- [CI/CD Workflows](./deployment/CICD-WORKFLOWS.md)

---

**Remember:** We're using next-forge as a **blueprint**, not a **template**. We learn from their structure but build with our stack.
