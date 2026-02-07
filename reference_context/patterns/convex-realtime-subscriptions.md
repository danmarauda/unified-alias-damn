# Convex Real-time Subscription Patterns

## Pattern Overview

Convex provides automatic real-time updates through WebSocket subscriptions. When you use `useQuery`, Convex automatically:
1. Establishes a WebSocket connection
2. Subscribes to query results
3. Re-runs queries when data changes
4. Updates React components automatically

## Implementation Pattern

### Basic Query Hook

```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useStats() {
  const data = useQuery(api.stats.getStats);

  return {
    data,
    isLoading: data === undefined,
    error: null,
    // No refetch needed - automatic!
  };
}
```

### Pattern Characteristics

1. **Automatic Subscriptions:** No manual WebSocket management
2. **Type Safety:** Generated types from schema
3. **Loading States:** `undefined` means loading
4. **Error Handling:** Errors propagate automatically
5. **Optimistic Updates:** Mutations update UI immediately

## Real-world Example: Observability Dashboard

```typescript
// Component automatically updates when events change
export function EventTimeline() {
  const events = useQuery(api.observability.getRecentEvents, {
    limit: 50,
  });

  if (events === undefined) {
    return <Loading />;
  }

  return (
    <div>
      {events.map(event => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
```

## Best Practices

1. **Handle Loading States:** Always check for `undefined`
2. **Use Indexes:** Ensure queries use indexed fields
3. **Limit Results:** Use pagination for large datasets
4. **Optimize Queries:** Minimize data fetched
5. **Error Boundaries:** Wrap components in error boundaries

## Related Patterns

- See `convex-schema-patterns.md` for schema design
- See `convex-react-hooks.md` for hook patterns
- See `realtime-dashboard-patterns.md` for UI patterns


