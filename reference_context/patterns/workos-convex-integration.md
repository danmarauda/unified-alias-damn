# WorkOS + Convex Integration Pattern

## Pattern Overview

This pattern synchronizes user data between WorkOS (authentication provider) and Convex (database). Users authenticate via WorkOS, then their profile is synced to Convex for application data.

## Architecture Flow

```
User Login → WorkOS Auth → Session Cookie → Middleware Check → 
Convex User Sync → Application Access
```

## Implementation

### 1. WorkOS Configuration

```typescript
// src/lib/workos.ts
export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID!;
export const WORKOS_REDIRECT_URI = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI!;
```

### 2. Middleware Protection

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('workos-session');
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### 3. User Sync Hook

```typescript
// src/lib/hooks/use-work-os.ts
export function useWorkOS() {
  const { user: workosUser } = useUser();
  
  // Sync WorkOS user to Convex
  const convexUser = useQuery(
    api.users.getByWorkOSId,
    workosUser ? { workosUserId: workosUser.id } : "skip"
  );
  
  const syncFromWorkOS = useMutation(api.users.syncFromWorkOS);
  
  // Auto-sync on mount
  useEffect(() => {
    if (workosUser && !convexUser) {
      syncFromWorkOS({
        workosUserId: workosUser.id,
        email: workosUser.email,
        // ... other fields
      });
    }
  }, [workosUser, convexUser]);
  
  return {
    workosUser,
    convexUser,
    isAuthenticated: !!workosUser,
    isLoading: !workosUser || convexUser === undefined,
  };
}
```

### 4. Convex User Schema

```typescript
// convex/schema.ts
users: defineTable({
  workosUserId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  // ...
})
  .index("by_workos_id", ["workosUserId"])
  .index("by_email", ["email"])
```

### 5. Sync Mutation

```typescript
// convex/users.ts
export const syncFromWorkOS = mutation({
  args: {
    workosUserId: v.string(),
    email: v.string(),
    // ...
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_workos_id", (q) => q.eq("workosUserId", args.workosUserId))
      .first();
    
    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
    }
    
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

## Best Practices

1. **Idempotent Sync:** Check for existing user before creating
2. **Error Handling:** Handle sync failures gracefully
3. **Loading States:** Show loading while syncing
4. **Session Validation:** Always validate session in middleware
5. **Type Safety:** Use TypeScript for both WorkOS and Convex types

## Common Issues

### Issue: User not syncing
**Solution:** Check Convex logs, verify mutation is called

### Issue: Session not persisting
**Solution:** Verify `WORKOS_COOKIE_PASSWORD` is set correctly

### Issue: Redirect loops
**Solution:** Ensure public routes are excluded from middleware

## Related Patterns

- See `workos-middleware-patterns.md` for middleware details
- See `convex-user-sync.md` for sync strategies
- See `authentication-flow.md` for complete auth flow


