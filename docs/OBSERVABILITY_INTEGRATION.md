# Observability Integration Plan

> How the observability architecture integrates with the existing ALIAS AEOS codebase

---

## Current Project Structure

```
src/
├── app/
│   ├── observability/          # ← EXISTING (single page, needs expansion)
│   │   └── page.tsx
│   ├── agents/                 # Agent management
│   ├── client-profiles/        # Client data (will link to org observability)
│   ├── projects/               # Project tracking
│   └── ...
├── components/
│   └── observability/          # ← EXISTING (6 components, will expand)
│       ├── CostTracker.tsx
│       ├── EventTimeline.tsx
│       ├── FilterPanel.tsx
│       ├── NeuralNetworkViz.tsx
│       ├── PlaygroundTile.tsx
│       └── SquadronPanel.tsx
├── lib/
│   └── hooks/
│       └── use-work-os.ts      # ← Auth hook (will add org context)
convex/
├── schema.ts                   # ← Will extend with new tables
├── observability.ts            # ← Will extend with org-scoped queries
└── users.ts                    # ← Will add org membership
```

---

## Integration Points

### 1. Route Structure (New + Extended)

```
src/app/
├── observability/                    # CURRENT → Becomes client org view
│   ├── page.tsx                      # Org Overview dashboard
│   ├── agents/
│   │   └── page.tsx                  # Agent fleet view
│   ├── tasks/
│   │   ├── page.tsx                  # Task runs list
│   │   └── [runId]/
│   │       └── page.tsx              # Task detail + trace
│   ├── costs/
│   │   └── page.tsx                  # Cost breakdown
│   └── alerts/
│       └── page.tsx                  # Alert rules + notifications
│
├── admin/                            # NEW → ALIAS internal views
│   ├── page.tsx                      # Global overview
│   ├── orgs/
│   │   ├── page.tsx                  # All organizations
│   │   └── [orgId]/
│   │       └── page.tsx              # Support view into org
│   ├── platform/
│   │   └── page.tsx                  # System health
│   └── incidents/
│       └── page.tsx                  # Global alert feed
```

### 2. Component Organization (Enhanced)

```
src/components/observability/
├── existing/                         # Keep working components
│   ├── EventTimeline.tsx             # Add orgId prop
│   ├── SquadronPanel.tsx             # Add orgId prop
│   ├── NeuralNetworkViz.tsx          # Add orgId prop
│   ├── CostTracker.tsx               # Add orgId prop
│   ├── FilterPanel.tsx               # Add orgId filter
│   └── PlaygroundTile.tsx
│
├── panels/                           # NEW compound components
│   ├── OverviewKpis.tsx              # KPI cards (success rate, latency, cost)
│   ├── AgentHealthTable.tsx          # Fleet status table
│   ├── TaskRunTable.tsx              # Paginated task runs
│   ├── AlertFeed.tsx                 # Alert list
│   └── IncidentTimeline.tsx          # For admin view
│
├── charts/                           # NEW visualization components
│   ├── TimeSeriesChart.tsx           # Reusable time series
│   ├── BreakdownDonut.tsx            # Cost/status breakdowns
│   ├── SpanWaterfall.tsx             # Trace visualization
│   └── HeatmapGrid.tsx               # Fleet/subsystem heatmap
│
└── layouts/                          # NEW dashboard layouts
    ├── OrgDashboardLayout.tsx        # Client org layout
    └── AdminDashboardLayout.tsx      # ALIAS admin layout
```

---

## Schema Migration

### Step 1: Add `orgs` Table

```typescript
// convex/schema.ts - ADD

orgs: defineTable({
  workosOrgId: v.string(),           // From WorkOS organization
  name: v.string(),
  plan: v.union(
    v.literal("free"),
    v.literal("pro"),
    v.literal("enterprise")
  ),
  settings: v.optional(v.object({
    retentionDays: v.optional(v.number()),
    alertsEnabled: v.optional(v.boolean()),
  })),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_workosOrgId", ["workosOrgId"]),
```

### Step 2: Extend `users` Table

```typescript
// convex/schema.ts - MODIFY users table

users: defineTable({
  workosUserId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  profilePictureUrl: v.optional(v.string()),
  emailVerified: v.boolean(),
  
  // NEW FIELDS
  orgId: v.optional(v.id("orgs")),         // Organization membership
  orgRole: v.optional(v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member")
  )),
  systemRole: v.optional(v.union(          // ALIAS staff roles
    v.literal("alias_admin"),
    v.literal("alias_support")
  )),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_workos_id", ["workosUserId"])
  .index("by_email", ["email"])
  .index("by_orgId", ["orgId"]),           // NEW INDEX
```

### Step 3: Add `orgId` to Existing Tables

```typescript
// convex/schema.ts - MODIFY observabilityEvents

observabilityEvents: defineTable({
  orgId: v.optional(v.id("orgs")),         // ADD (optional for migration)
  sessionId: v.string(),
  // ... rest of existing fields
})
  .index("by_org_ts", ["orgId", "timestamp"])  // ADD
  // ... keep existing indexes
```

### Step 4: Add New Observability Tables

```typescript
// convex/schema.ts - ADD new tables

// See OBSERVABILITY_ARCHITECTURE.md for full schema:
// - fleets
// - agents (enhanced)
// - tasks, taskRuns
// - obsEvents (replaces observabilityEvents)
// - obsTraces, obsSpans
// - obsMetricRollups
// - costLineItems, costRollups
// - alertRules, alertStates, notifications
```

---

## Auth Integration

### Current: `useWorkOS` Hook

```typescript
// src/lib/hooks/use-work-os.ts - CURRENT
export function useWorkOS(): UseWorkOSReturn {
  return {
    workosUser,      // WorkOS user data
    convexUser,      // Convex user record
    isLoading,
    isAuthenticated,
  };
}
```

### Enhanced: Add Org Context

```typescript
// src/lib/hooks/use-work-os.ts - ENHANCED

type UseWorkOSReturn = {
  workosUser: WorkOSUser | null;
  convexUser: ConvexUser | null;
  org: Org | null;                    // NEW
  orgRole: OrgRole | null;            // NEW
  isAliasStaff: boolean;              // NEW
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useWorkOS(): UseWorkOSReturn {
  const { user, loading } = useCustomAuth();
  
  const convexUser = useQuery(
    api.users.getByWorkOSId,
    user?.id ? { workosUserId: user.id } : "skip"
  );
  
  // NEW: Fetch org context
  const org = useQuery(
    api.orgs.getById,
    convexUser?.orgId ? { orgId: convexUser.orgId } : "skip"
  );
  
  return {
    workosUser: user,
    convexUser,
    org,                                           // NEW
    orgRole: convexUser?.orgRole ?? null,          // NEW
    isAliasStaff: !!convexUser?.systemRole,        // NEW
    isLoading,
    isAuthenticated,
  };
}
```

### New: Org Context Provider

```typescript
// src/lib/contexts/org-context.tsx - NEW

"use client";

import { createContext, useContext } from "react";
import { useWorkOS } from "@/lib/hooks/use-work-os";
import type { Id } from "convex/_generated/dataModel";

type OrgContextType = {
  orgId: Id<"orgs"> | null;
  orgName: string | null;
  isAliasStaff: boolean;
  canViewAllOrgs: boolean;
};

const OrgContext = createContext<OrgContextType | null>(null);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { org, isAliasStaff } = useWorkOS();
  
  return (
    <OrgContext.Provider value={{
      orgId: org?._id ?? null,
      orgName: org?.name ?? null,
      isAliasStaff,
      canViewAllOrgs: isAliasStaff,
    }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) throw new Error("useOrg must be used within OrgProvider");
  return context;
}
```

---

## Query Migration

### Current: No Org Scoping

```typescript
// convex/observability.ts - CURRENT
export const getRecentEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("observabilityEvents")
      .withIndex("by_timestamp")
      .order("desc")
      .take(args.limit || 100);
  },
});
```

### Enhanced: Org-Scoped Queries

```typescript
// convex/observability.ts - ENHANCED
export const getRecentEvents = query({
  args: {
    orgId: v.id("orgs"),              // REQUIRED for client
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Could add auth check here
    return ctx.db
      .query("observabilityEvents")
      .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(args.limit || 100);
  },
});

// NEW: Admin cross-org query
export const getRecentEventsAdmin = query({
  args: {
    orgId: v.optional(v.id("orgs")),  // Optional for cross-org
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: Verify caller has systemRole
    
    if (args.orgId) {
      return ctx.db
        .query("observabilityEvents")
        .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .take(args.limit || 100);
    }
    
    // Cross-org: all recent events
    return ctx.db
      .query("observabilityEvents")
      .withIndex("by_timestamp")
      .order("desc")
      .take(args.limit || 100);
  },
});
```

---

## Component Migration

### Current: No Org Context

```tsx
// src/components/observability/EventTimeline.tsx - CURRENT
export function EventTimeline() {
  const events = useQuery(api.observability.getRecentEvents, { limit: 50 });
  // ...
}
```

### Enhanced: Org-Aware Components

```tsx
// src/components/observability/EventTimeline.tsx - ENHANCED

import { useOrg } from "@/lib/contexts/org-context";

type EventTimelineProps = {
  orgId?: Id<"orgs">;  // Optional override (for admin viewing other orgs)
};

export function EventTimeline({ orgId: propOrgId }: EventTimelineProps) {
  const { orgId: contextOrgId, isAliasStaff } = useOrg();
  const orgId = propOrgId ?? contextOrgId;
  
  if (!orgId) return <NoOrgPlaceholder />;
  
  const events = useQuery(
    isAliasStaff ? api.observability.getRecentEventsAdmin : api.observability.getRecentEvents,
    { orgId, limit: 50 }
  );
  
  // ... rest of component
}
```

---

## Page Integration

### Client Observability Dashboard

```tsx
// src/app/observability/page.tsx - ENHANCED

import { useOrg } from "@/lib/contexts/org-context";
import { EventTimeline } from "@/components/observability/EventTimeline";
import { SquadronPanel } from "@/components/observability/SquadronPanel";
import { CostTracker } from "@/components/observability/CostTracker";
import { OverviewKpis } from "@/components/observability/panels/OverviewKpis";

export default function ObservabilityPage() {
  const { orgId, orgName } = useOrg();
  
  if (!orgId) {
    return <NoOrgState />;
  }
  
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-normal">
            {orgName} Observability
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring for MOSAIC, DAMN, and UCE
          </p>
        </header>
        
        {/* KPI Cards */}
        <OverviewKpis orgId={orgId} />
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EventTimeline orgId={orgId} />
          </div>
          <div className="space-y-6">
            <SquadronPanel orgId={orgId} />
            <CostTracker orgId={orgId} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
```

### ALIAS Admin Dashboard

```tsx
// src/app/admin/page.tsx - NEW

import { useOrg } from "@/lib/contexts/org-context";
import { redirect } from "next/navigation";
import { GlobalOverviewKpis } from "@/components/observability/panels/GlobalOverviewKpis";
import { OrgHealthTable } from "@/components/observability/panels/OrgHealthTable";
import { IncidentFeed } from "@/components/observability/panels/IncidentFeed";

export default function AdminDashboardPage() {
  const { isAliasStaff } = useOrg();
  
  // Protect admin routes
  if (!isAliasStaff) {
    redirect("/observability");
  }
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-normal">
            ALIAS Global Operations
          </h1>
          <p className="text-muted-foreground">
            Cross-org monitoring and platform health
          </p>
        </header>
        
        <GlobalOverviewKpis />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrgHealthTable />
          <IncidentFeed />
        </div>
      </div>
    </AdminLayout>
  );
}
```

---

## Navigation Updates

### Header Navigation

```tsx
// src/components/layout/Header.tsx - ADD observability dropdown

// For authenticated users with org
<Link href="/observability">
  <Button variant="outline">
    <Activity className="mr-1 h-4 w-4" />
    OBSERVABILITY
  </Button>
</Link>

// For ALIAS staff - show admin link
{isAliasStaff && (
  <Link href="/admin">
    <Button variant="outline">
      <Shield className="mr-1 h-4 w-4" />
      ADMIN
    </Button>
  </Link>
)}
```

---

## Middleware Updates

```typescript
// middleware.ts - ADD admin route protection

const ADMIN_ROUTES = ["/admin", "/admin/:path*"];
const PUBLIC_ROUTES = ["/", "/login", "/callback"];

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: PUBLIC_ROUTES,
  },
});

// Add custom middleware for admin routes
export async function middleware(request: NextRequest) {
  // ... existing auth middleware
  
  // Admin route protection (check systemRole in session)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await getSessionFromCookie();
    if (!session?.user?.systemRole) {
      return NextResponse.redirect(new URL("/observability", request.url));
    }
  }
}
```

---

## Migration Steps

### Phase 1: Schema + Auth (Day 1)

```bash
# 1. Add orgs table to schema
# 2. Add orgId to users table
# 3. Create org sync mutation
# 4. Enhance useWorkOS hook
# 5. Create OrgProvider context
# 6. Wrap app in OrgProvider
```

### Phase 2: Existing Component Updates (Day 1-2)

```bash
# 1. Add orgId prop to all observability components
# 2. Update convex queries to accept orgId
# 3. Add orgId index to observabilityEvents
# 4. Test existing functionality still works
```

### Phase 3: New Routes + Components (Day 2-3)

```bash
# 1. Create /observability sub-routes (agents, tasks, costs, alerts)
# 2. Create /admin routes with protection
# 3. Build new panel components
# 4. Wire up navigation
```

### Phase 4: New Tables + Features (Day 3+)

```bash
# 1. Add obsTraces, obsSpans tables
# 2. Add costRollups, alertRules tables
# 3. Create scheduled rollup functions
# 4. Build trace visualization
# 5. Implement alerting
```

---

## File Changes Summary

| Action | Files |
|--------|-------|
| **MODIFY** | `convex/schema.ts` - Add orgs, extend users, add orgId |
| **MODIFY** | `convex/observability.ts` - Add org-scoped queries |
| **MODIFY** | `src/lib/hooks/use-work-os.ts` - Add org context |
| **CREATE** | `src/lib/contexts/org-context.tsx` - Org provider |
| **MODIFY** | `src/app/providers.tsx` - Wrap with OrgProvider |
| **MODIFY** | `src/components/observability/*.tsx` - Add orgId props |
| **MODIFY** | `src/app/observability/page.tsx` - Use org context |
| **CREATE** | `src/app/observability/agents/page.tsx` |
| **CREATE** | `src/app/observability/tasks/page.tsx` |
| **CREATE** | `src/app/observability/costs/page.tsx` |
| **CREATE** | `src/app/admin/page.tsx` |
| **CREATE** | `src/app/admin/orgs/page.tsx` |
| **MODIFY** | `src/components/layout/Header.tsx` - Add admin nav |
| **MODIFY** | `middleware.ts` - Add admin protection |

---

## Testing Checklist

- [ ] Existing observability page still works
- [ ] Users are assigned to orgs on login
- [ ] Org context is available in components
- [ ] Queries filter by orgId correctly
- [ ] ALIAS staff can see admin routes
- [ ] Non-staff cannot access admin routes
- [ ] Cross-org queries work for admin

---

*Integration plan for ALIAS AEOS Observability*
