# Convex Development Guide

**Official Best Practices for Contributors and AI Agents**

This guide summarizes official Convex guidance for development server, deployment, schema migrations, and security rules based on [official documentation](https://docs.convex.dev) and [Stack articles](https://stack.convex.dev).

---

## Table of Contents

1. [Development Server](#development-server)
2. [Deployment](#deployment)
3. [Schema Migrations](#schema-migrations)
4. [Security & Authorization](#security--authorization)
5. [Best Practices](#best-practices)
6. [Configuration](#configuration)

---

## Development Server

### Starting Development

**Command:**
```bash
npx convex dev
```

**What it does:**
- Creates a dev deployment automatically on first run
- Writes `CONVEX_DEPLOYMENT` to `.env.local`
- Watches for file changes and hot-reloads functions
- Provides real-time feedback on errors

**Evidence:** [Convex CLI Documentation](https://docs.convex.dev/cli)

### Local vs Cloud Deployments

**Cloud Development (Default):**
- Each developer gets their own cloud deployment
- Data persists between sessions
- Accessible from anywhere

**Local Deployments (Optional):**
```bash
npx convex enable-local-deployments
```

- Runs Convex backend locally
- Faster iteration for offline development
- **Important:** Cloud and local deployments have separate data

**Evidence:** [Local Deployments Guide](https://docs.convex.dev/cli/local-deployments)

### Environment Variables

**Development:**
- `CONVEX_DEPLOYMENT`: Dev deployment name (auto-written to `.env.local`)
- Framework-specific URL variable (e.g., `NEXT_PUBLIC_CONVEX_URL`)

**Production:**
- `CONVEX_DEPLOY_KEY`: For CI/CD deployments
- Set in hosting provider (Vercel, Netlify, etc.)

**Evidence:** [Project Configuration](https://docs.convex.dev/production/project-configuration)

---

## Deployment

### Production Deployment

**From Local Machine:**
```bash
npx convex deploy
```

**With Build Command:**
```bash
npx convex deploy --cmd "npm run build"
```

**What happens:**
1. TypeScript type checking
2. Code regeneration
3. Function bundling
4. Push to production deployment
5. Schema validation
6. Index updates

**Evidence:** [Deploying to Production](https://docs.convex.dev/production)

### CI/CD Integration

**GitHub Actions Example:**
```yaml
- name: Deploy to Convex
  env:
    CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
  run: npx convex deploy --cmd "npm run build"
```

**Getting Deploy Key:**
1. Go to Convex Dashboard → Settings
2. Generate production deploy key
3. Add to CI/CD secrets as `CONVEX_DEPLOY_KEY`

**Evidence:** [Hosting and Deployment](https://docs.convex.dev/production/hosting)

### Deployment Workflow

**Recommended Flow:**
1. Develop on personal dev deployment (`npx convex dev`)
2. Test changes thoroughly
3. Push to Git
4. CI/CD deploys to production automatically
5. Run migrations post-deployment if needed

**Evidence:** [Understanding Workflow](https://docs.convex.dev/understanding/workflow)

---

## Schema Migrations

### Schema Definition

**Location:** `convex/schema.ts`

**Example:**
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_creation_time", ["_creationTime"]),
});
```

**Evidence:** [Schema Documentation](https://github.com/get-convex/convex-backend/blob/main/npm-packages/convex/src/server/schema.ts)

### Migration Strategies

#### 1. **Lightweight Migrations** (Recommended for Simple Changes)

**Use Case:** Adding optional fields, renaming fields

**Pattern:**
```typescript
// Add optional field - no migration needed
export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()), // New optional field
  }),
});
```

**Evidence:** [Lightweight Migrations](https://stack.convex.dev/lightweight-zero-downtime-migrations)

#### 2. **Stateful Migrations** (For Complex Changes)

**Use the official `@convex-dev/migrations` component:**

```bash
npm install @convex-dev/migrations
```

**Define Migration:**
```typescript
// convex/migrations.ts
import { makeMigration } from "@convex-dev/migrations";
import { internalMutation } from "./_generated/server";

const migration = makeMigration(internalMutation, {
  migrationTable: "migrations",
});

export const addUserBios = migration({
  table: "users",
  migrateOne: async (ctx, doc) => {
    await ctx.db.patch(doc._id, { 
      bio: doc.bio ?? "No bio yet" 
    });
  },
});
```

**Run Migration:**
```bash
# After deployment
npx convex run convex/migrations.ts:addUserBios --prod
```

**Evidence:** [Convex Migrations Component](https://www.convex.dev/components/migrations)

#### 3. **Online Migrations** (Zero Downtime)

**Pattern:**
1. Add new field as optional
2. Deploy code that writes to both old and new fields
3. Run migration to backfill data
4. Deploy code that only uses new field
5. Remove old field

**Evidence:** [Stateful Online Migrations](https://stack.convex.dev/migrating-data-with-mutations)

### Migration Best Practices

**DO:**
- ✅ Test migrations on dev deployment first
- ✅ Use batched updates for large tables
- ✅ Track migration state in a dedicated table
- ✅ Make fields optional during transition periods
- ✅ Chain migrations after deployment: `npx convex deploy && npx convex run migrations:runAll --prod`

**DON'T:**
- ❌ Run migrations directly on production without testing
- ❌ Delete fields before migrating data
- ❌ Assume migrations run instantly (they're batched)
- ❌ Forget to handle edge cases (null, undefined)

**Evidence:** [Intro to Migrations](https://stack.convex.dev/intro-to-migrations)

---

## Security & Authorization

### Authentication

**Convex supports OpenID Connect (OAuth) via JWTs.**

**Recommended Providers:**
- Convex Auth (official, built-in)
- Clerk
- Auth0
- Custom JWT providers

**Example with Convex Auth:**
```typescript
// convex/auth.config.ts
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut } = convexAuth({
  providers: [
    // OAuth providers
    GitHub,
    Google,
    // Email/password
    Password,
  ],
});
```

**Evidence:** [Authentication Documentation](https://docs.convex.dev/auth)

### Authorization Patterns

#### 1. **Function-Level Authorization**

```typescript
export const updateProfile = mutation({
  args: { userId: v.id("users"), name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // Check authorization
    if (identity.subject !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(args.userId, { name: args.name });
  },
});
```

**Evidence:** [Authorization Best Practices](https://stack.convex.dev/authorization)

#### 2. **Row-Level Security (RLS)**

**Pattern:** Filter queries based on user permissions

```typescript
export const getMyDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    
    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("ownerId"), identity.subject))
      .collect();
  },
});
```

**Evidence:** [Row Level Security](https://stack.convex.dev/row-level-security)

#### 3. **Helper Functions for Reusable Auth**

```typescript
// convex/auth.ts
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
}

export async function requireOwnership(
  ctx: QueryCtx | MutationCtx,
  resourceId: Id<any>
) {
  const identity = await requireAuth(ctx);
  const resource = await ctx.db.get(resourceId);
  if (!resource || resource.ownerId !== identity.subject) {
    throw new Error("Unauthorized");
  }
  return resource;
}
```

**Evidence:** [Authorization in Practice](https://stack.convex.dev/authorization)

### Security Best Practices

**DO:**
- ✅ Always validate user identity in mutations
- ✅ Use `ctx.auth.getUserIdentity()` for authentication
- ✅ Implement authorization checks at function level
- ✅ Store sensitive data server-side only
- ✅ Use HTTPS for all connections (enforced by Convex)
- ✅ Validate all inputs with Convex validators

**DON'T:**
- ❌ Trust client-provided user IDs
- ❌ Skip authentication checks in mutations
- ❌ Expose sensitive data in public queries
- ❌ Use client-side filtering for security
- ❌ Store secrets in client code

**Evidence:** [Security Documentation](https://labs.convex.dev/auth/security)

---

## Best Practices

### Code Quality

#### 1. **Always Await Promises**

```typescript
// ❌ BAD - Floating promise
export const scheduleTask = mutation({
  handler: async (ctx, args) => {
    ctx.scheduler.runAfter(0, api.tasks.process); // Missing await!
  },
});

// ✅ GOOD
export const scheduleTask = mutation({
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, api.tasks.process);
  },
});
```

**Use ESLint rule:** `@typescript-eslint/no-floating-promises`

**Evidence:** [Best Practices - Await Promises](https://docs.convex.dev/understanding/best-practices#await-all-promises)

#### 2. **Use Validators**

```typescript
// ✅ GOOD - Type-safe with runtime validation
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    age: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // args are validated automatically
    await ctx.db.insert("users", args);
  },
});
```

**Evidence:** [Best Practices](https://docs.convex.dev/production/best-practices)

#### 3. **Index Your Queries**

```typescript
// Schema with indexes
export default defineSchema({
  messages: defineTable({
    channelId: v.id("channels"),
    authorId: v.id("users"),
    text: v.string(),
  })
    .index("by_channel", ["channelId"])
    .index("by_author", ["authorId"]),
});

// Query using index
export const getChannelMessages = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .collect();
  },
});
```

**Evidence:** [Best Practices](https://docs.convex.dev/understanding/best-practices)

### Performance

**DO:**
- ✅ Use indexes for all queries
- ✅ Paginate large result sets
- ✅ Use `ctx.scheduler` for background tasks
- ✅ Batch database operations when possible
- ✅ Use `ctx.db.get()` for single document lookups

**DON'T:**
- ❌ Scan entire tables without indexes
- ❌ Return unbounded result sets
- ❌ Perform heavy computation in queries
- ❌ Make unnecessary database calls

**Evidence:** [Best Practices](https://docs.convex.dev/understanding/best-practices)

---

## Configuration

### `convex.json`

**Location:** Project root

**Example:**
```json
{
  "$schema": "https://raw.githubusercontent.com/get-convex/convex-backend/refs/heads/main/npm-packages/convex/schemas/convex.schema.json",
  "functions": "convex/",
  "codegen": {
    "staticApi": false,
    "staticDataModel": false
  }
}
```

**Evidence:** [Project Configuration](https://docs.convex.dev/production/project-configuration#convexjson)

### Project Structure

```
project/
├── convex/
│   ├── _generated/          # Auto-generated types
│   ├── schema.ts            # Database schema
│   ├── auth.config.ts       # Authentication config
│   ├── users.ts             # User functions
│   ├── messages.ts          # Message functions
│   └── migrations.ts        # Migration definitions
├── .env.local               # Local environment variables
├── convex.json              # Convex configuration
└── package.json
```

**Evidence:** [Understanding Workflow](https://docs.convex.dev/understanding/workflow)

---

## Quick Reference

### Essential Commands

```bash
# Development
npx convex dev                    # Start dev server
npx convex login                  # Authenticate

# Deployment
npx convex deploy                 # Deploy to production
npx convex deploy --cmd "npm run build"  # With build step

# Migrations
npx convex run migrations:runAll --prod  # Run migrations

# Data Management
npx convex import data.zip        # Import data
npx convex export                 # Export data

# Local Development
npx convex enable-local-deployments   # Enable local backend
npx convex disable-local-deployments  # Disable local backend
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Query** | Read-only, reactive, cached |
| **Mutation** | Write operations, transactional |
| **Action** | Non-deterministic, can call external APIs |
| **Schema** | TypeScript-based data model with validators |
| **Index** | Required for efficient queries |
| **Validator** | Runtime type checking with `v.*` |

---

## Additional Resources

- **Official Docs:** https://docs.convex.dev
- **Stack Articles:** https://stack.convex.dev
- **Components:** https://convex.dev/components
- **Discord Community:** https://convex.dev/community
- **GitHub:** https://github.com/get-convex

---

**Last Updated:** December 20, 2025  
**Convex Version:** Latest (check [changelog](https://www.convex.dev/components/migrations))

---

## Contributing to This Guide

This guide is maintained for contributors and AI agents. To update:

1. Verify information against [official docs](https://docs.convex.dev)
2. Include evidence links for all claims
3. Test code examples on current Convex version
4. Follow existing formatting conventions
