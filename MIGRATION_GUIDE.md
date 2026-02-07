# Convex + Better Auth Migration Guide

This project has been migrated from using Next.js API routes and NextAuth to Convex backend with Better Auth for authentication.

## What's Changed

### Backend Migration
- **API Routes → Convex Functions**: All `/api/*` routes have been replaced with Convex functions
- **Real-time Data**: Convex provides automatic real-time subscriptions for all data
- **Database**: Convex's built-in database replaces in-memory/mock data

### Authentication Migration
- **NextAuth → Better Auth**: Modern authentication with better TypeScript support
- **Convex Adapter**: Better Auth integrates seamlessly with Convex database

## Setup Instructions

### 1. Create a Convex Project

First, you need to create a Convex project and get your deployment URL:

```bash
# Login to Convex (creates account if needed)
npx convex login

# Deploy to a new Convex project
npx convex deploy
```

### 2. Set Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then add your Convex deployment URL from the deployment output:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name
```

### 3. Initialize Demo Data

After setting up Convex, run this command to populate demo data:

```bash
npx convex run initDemo:setupDemoData
```

### 4. Start Development

Run both Next.js and Convex dev servers:

```bash
bun dev
```

This runs:
- Next.js dev server on http://localhost:3000
- Convex dev server (syncs schema and functions)

## Key Changes

### 1. Data Fetching

**Before (SWR with API routes):**
```typescript
const { data, error, isLoading } = useSWR('/api/stats', fetcher);
```

**After (Convex hooks):**
```typescript
const data = useQuery(api.stats.getStats);
const isLoading = data === undefined;
```

### 2. Authentication

**Before (NextAuth):**
```typescript
import { signIn } from "next-auth/react";
await signIn("credentials", { email, password });
```

**After (Better Auth):**
```typescript
import { signIn } from "@/lib/auth-client";
await signIn.email({ email, password });
```

### 3. Real-time Updates

With Convex, all data is automatically real-time. No need for:
- Manual polling with `setInterval`
- SWR's `refreshInterval`
- Manual cache invalidation

## Features

### Convex Backend
- **Real-time subscriptions**: Data updates automatically
- **Type-safe API**: Full TypeScript support with generated types
- **Built-in database**: No need for external database
- **Serverless functions**: Automatic scaling

### Better Auth
- **Modern authentication**: Built for modern TypeScript apps
- **Convex integration**: Native adapter for Convex
- **Extensible**: Easy to add OAuth providers
- **Type-safe**: Full TypeScript support

## Adding New Features

### Creating a New Convex Function

1. Create a new file in `convex/` directory:
```typescript
// convex/myFeature.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getData = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("myTable").collect();
  },
});

export const createItem = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("myTable", args);
  },
});
```

2. Use in your React component:
```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function MyComponent() {
  const data = useQuery(api.myFeature.getData);
  const createItem = useMutation(api.myFeature.createItem);
  
  // Use data and createItem...
}
```

### Adding OAuth Providers

Update `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  // ... existing config
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

## Deployment

1. Build the Next.js app:
```bash
bun run build
```

2. Deploy to your hosting provider (Vercel, Netlify, etc.)

3. Set environment variables on your hosting platform:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`
   - Any OAuth provider credentials

## Troubleshooting

### Convex Connection Issues
- Ensure your Convex deployment URL is correct
- Check that Convex dev server is running (`convex dev`)
- Verify environment variables are loaded

### Authentication Issues
- Clear browser cookies/localStorage
- Check Better Auth configuration
- Ensure Convex HTTP routes are set up correctly

### Type Errors
- Run `npx convex codegen` to regenerate types
- Restart TypeScript server in your editor

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.com)
- [Convex + Better Auth Integration](https://better-auth.com/docs/integrations/convex)