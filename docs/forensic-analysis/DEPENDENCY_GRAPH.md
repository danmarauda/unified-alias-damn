# ALIAS Super Admin Console - Dependency Graph & Architecture

**Generated:** 2026-02-07
**Purpose:** Map import relationships, component hierarchy, and data flow

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│                   (src/app/ - 24 routes)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐   ┌──────────┐
    │ Pages   │    │ API      │   │ Provider │
    │ (24)    │    │ Routes   │   │ Wrapper  │
    └────┬────┘    └────┬─────┘   └──────────┘
         │              │
         │              ▼
         │        ┌──────────┐
         │        │ Convex   │
         │        │ Backend  │
         │        │ (16 tbl) │
         │        └────┬─────┘
         │             │
         ▼             ▼
    ┌────────────────────────────┐
    │    Components (49 files)    │
    ├────────────────────────────┤
    │ • UI Components (18+)       │
    │ • Dashboard (6+)            │
    │ • Ontology (3)              │
    │ • Skills (4)                │
    │ • Observability (5)         │
    └─────────────┬──────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    ┌─────────┐      ┌──────────┐
    │  Hooks  │      │  Utils   │
    └─────────┘      └──────────┘
```

---

## Layer 1: External Dependencies

### Authentication Layer
```
WorkOS (@workos-inc/authkit-nextjs)
    ↓
proxy.ts (Next.js 16 proxy pattern)
    ↓
Session Management (iron-session)
    ↓
User Sync → Convex users table
```

**Key Files:**
- `/proxy.ts` - WorkOS AuthKit integration
- `/src/lib/workos.ts` - WorkOS client config
- `/src/lib/workos-server.ts` - Server utilities
- `/convex/users.ts` - User sync and management

---

### Database Layer (Convex)
```
Convex Client (src/components/ConvexClientProvider.tsx)
    ↓
Queries/Mutations (convex/*.ts)
    ↓
Database Tables (convex/schema.ts)
```

**Convex Modules:**
- `schema.ts` - 16 table definitions
- `users.ts` - User CRUD with WorkOS sync
- `orgs.ts` - Multi-tenant organizations
- `stats.ts` - Dashboard metrics
- `agentMetrics.ts` - Agent performance
- `skills.ts` + `skills_mutations.ts` - Skills management
- `clientProfiles.ts` - Client CRUD
- `clientResearch.ts` - Research workflow
- `observability.ts` - Event tracking
- `http.ts` - HTTP endpoints

---

### AI Integration Layer (Vercel AI SDK v6)
```
AI SDK (ai package, @ai-sdk/react)
    ↓
Multi-LLM Providers (15+ integrations)
    ↓
API Routes (src/app/api/ai/)
```

**AI Providers:**
- OpenAI, Anthropic, Google, Cerebras, Groq, Mistral, DeepSeek
- Cohere, Fireworks, Together AI, Perplexity, xAI
- Azure OpenAI, AWS Bedrock, Google Vertex

**API Endpoints:**
- `/api/ai/chat` - General AI chat
- `/api/ai-demo/chat` - Demo chat interface
- `/api/ai-demo/structured` - Structured outputs
- `/api/ai-demo/generate` - Text generation

---

## Layer 2: Internal Dependency Graph

### Import Pattern Analysis

**Total internal imports:** 187 occurrences across 71 files

#### Import Sources by Category

```
@/components/ui/*        → Component imports (shadcn/ui)
@/components/dashboard/* → Dashboard widgets
@/components/layout/*    → Layout components
@/components/*           → Feature components
@/lib/hooks/*            → Custom React hooks
@/lib/*                  → Utilities and config
convex/*                 → Backend functions
```

---

### Component Hierarchy

#### Layout Components
```
app/layout.tsx (Root Layout)
    ↓
providers.tsx (ConvexClientProvider + ThemeProvider)
    ↓
MainLayout.tsx (Header + Main + Footer)
    ↓
Header.tsx (9 navigation items)
```

**Dependencies:**
- `ConvexClientProvider` - Wraps with Convex client
- `ThemeProvider` - Dark mode support (next-themes)
- `Header` - Navigation with auth state
- `MainLayout` - Consistent page layout

---

#### Dashboard Components
```
Dashboard Page (app/dashboard/page.tsx)
    ↓
├── NetworkOverview.tsx
├── ProjectsSummary.tsx
├── LiveFeed.tsx
├── AgentActivities.tsx
├── Leaderboard.tsx
├── OntologyOverview.tsx
└── AIAssistPanel.tsx
```

**Data Dependencies:**
- All dashboard widgets use `useQuery` hooks from Convex
- Real-time updates via Convex subscriptions
- Stats from `convex/stats.ts`

---

#### Agent Management Components
```
Agents Section (app/agents/)
    ├── page.tsx (Overview)
    ├── metrics/page.tsx (573 LOC)
    │   └── useAgentMetrics hook
    ├── library/page.tsx
    ├── designer/page.tsx (940 LOC)
    └── management/page.tsx
```

**Dependencies:**
- `convex/agentMetrics.ts` - Performance data
- `convex/agentActivities.ts` - Activity tracking
- AI SDK for agent generation

---

#### Skills Management Components
```
Skills Section (app/(dashboard)/skills/)
    ↓
├── skills-manager.tsx (354 LOC)
│   └── Queries from convex/skills.ts
├── skill-builder.tsx (436 LOC)
│   └── Mutations from convex/skills_mutations.ts
├── skill-versions.tsx (292 LOC)
│   └── Version history queries
└── skill-analytics.tsx (426 LOC)
    └── Usage statistics
```

**Data Flow:**
```
UI Component
    ↓
useQuery/useMutation (custom hooks)
    ↓
Convex functions (convex/skills.ts)
    ↓
Database (skills, skillVersions tables)
```

---

#### Client Research Components
```
Client Profiles (app/client-profiles/)
    ├── page.tsx (Client list)
    ├── new/page.tsx (Create form)
    └── [id]/page.tsx (Client details, 342 LOC)
        ↓
Research Hub (app/research-hub/)
    ├── page.tsx
    └── new/page.tsx (Research creation)
```

**Dependencies:**
- `convex/clientProfiles.ts` - Client CRUD
- `convex/clientResearch.ts` - Research workflow
- Full-text search on client names

---

#### Observability Components
```
Observability Dashboard (app/observability/page.tsx)
    ↓
├── EventTimeline.tsx
├── SquadronPanel.tsx
├── NeuralNetworkViz.tsx
├── CostTracker.tsx
└── FilterPanel.tsx
```

**Data Sources:**
- `convex/observability.ts` - Event stream
- `convex/http.ts` - HTTP endpoints
- Real-time event ingestion

---

## Layer 3: Data Flow Patterns

### Authentication Flow
```
1. User visits /login
    ↓
2. WorkOS AuthKit → OAuth flow
    ↓
3. Redirect to /callback
    ↓
4. proxy.ts creates session
    ↓
5. User synced to Convex users table
    ↓
6. Protected routes accessible
```

**Key Files:**
- `/proxy.ts` - Route protection
- `/src/app/login/page.tsx` - Login initiation
- `/src/app/callback/page.tsx` - OAuth callback
- `/convex/users.ts` - User sync

---

### Real-time Data Flow (Convex)
```
Component mounts
    ↓
useQuery hook called
    ↓
Convex query executes
    ↓
Data fetched from database
    ↓
Component re-renders with new data
    ↓
Real-time subscription active
    ↓
Auto-update on database changes
```

**Example: Dashboard Stats**
```typescript
// Component
const stats = useQuery(api.stats.getDashboardStats);

// Convex function (convex/stats.ts)
export const getDashboardStats = query({
  handler: async (ctx) => {
    const stats = await ctx.db
      .query("stats")
      .order("desc")
      .take(100);
    return stats;
  },
});
```

---

### Form Submission Flow
```
User fills form
    ↓
Form validation (Zod schema)
    ↓
useMutation hook called
    ↓
Convex mutation executes
    ↓
Database updated
    ↓
Optimistic update (if configured)
    ↓
Real-time sync to all clients
```

**Example: Create Client**
```typescript
// Component
const createClient = useMutation(api.clientProfiles.create);

// Convex function (convex/clientProfiles.ts)
export const create = mutation({
  args: {
    name: v.string(),
    industry: v.string(),
    // ...other fields
  },
  handler: async (ctx, args) => {
    const clientId = await ctx.db.insert("clientProfiles", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return clientId;
  },
});
```

---

### Observability Event Flow
```
Event Source (Voice/Browser/LLM)
    ↓
POST /api/observability/ingest
    ↓
convex/http.ts (httpAction)
    ↓
convex/observability.ts (mutation)
    ↓
observabilityEvents table
    ↓
Real-time UI updates
```

**UCE Neural Network Flow:**
```
Agent activity detected
    ↓
Neural activation calculated
    ↓
POST /api/observability/neural
    ↓
uceNeuralActivations table
    ↓
NeuralNetworkViz component updates
```

---

## Layer 4: Page Route Dependencies

### Route Dependency Map

```
Homepage (/)
├── providers.tsx
├── dashboard widgets
└── Convex queries

Dashboard (/dashboard)
├── MainLayout
├── Dashboard components (6+)
└── Stats queries

Agents (/agents/*)
├── MainLayout
├── Agent components
└── Agent metrics queries

Projects (/projects/*)
├── MainLayout
├── Project components
└── Project data queries

Client Profiles (/client-profiles/*)
├── MainLayout
├── Client components
└── Client profile queries

Research Hub (/research-hub/*)
├── MainLayout
├── Research components
└── Research workflow queries

Ontology (/ontology)
├── MainLayout
├── OntologyVisualizer
└── Graph data queries

Knowledge Base (/knowledge-base)
├── MainLayout
└── Knowledge components

Observability (/observability)
├── MainLayout
├── Observability components (5)
└── Event stream queries

AI Demo (/ai-demo)
├── MainLayout
├── AI demo components
└── AI SDK (15+ providers)

Skills (/skills)
├── MainLayout
├── Skills components (4)
└── Skills management queries

Deploy (/deploy)
├── MainLayout
├── Deploy components
└── Deployment status
```

---

## Layer 5: Hook Dependencies

### Custom Hooks

```
use-work-os.ts
    ↓
WorkOS authentication state

use-auth.ts
    ↓
User session management

use-stats.ts
    ↓
Dashboard statistics queries

use-agent-metrics.ts
    ↓
Agent performance data
```

**Hook Usage Pattern:**
```typescript
// Component
function DashboardPage() {
  const stats = useStats(); // Custom hook
  const user = useAuth(); // Custom hook

  return <DashboardWidgets stats={stats} user={user} />;
}

// Hook implementation
export function useStats() {
  const stats = useQuery(api.stats.getDashboardStats);
  return stats;
}
```

---

## Component Dependency Matrix

### High-Level Component Dependencies

| Component | Depends On | Used By |
|-----------|------------|---------|
| ConvexClientProvider | - | All pages |
| ThemeProvider | next-themes | All pages |
| MainLayout | Header, Footer | Most pages |
| Header | WorkOS auth | MainLayout |
| Dashboard Widgets | use-stats hook | Dashboard page |
| OntologyVisualizer | D3 graph library | Ontology page |
| Skills Manager | Skills mutations | Skills page |
| Observability Components | Event stream | Observability page |
| Client Components | Client CRUD | Client pages |
| Research Components | Research workflow | Research hub |

---

## API Route Dependencies

### API Route Structure

```
/api/auth/logout
    ↓
WorkOS session termination

/api/ai/chat
    ↓
AI SDK (multi-LLM)

/api/ai-demo/chat
    ↓
AI SDK with provider selection

/api/ai-demo/structured
    ↓
AI SDK structured outputs

/api/ai-demo/generate
    ↓
AI SDK text generation
```

---

## External Service Dependencies

### WorkOS
```
@workos-inc/authkit-nextjs
    ↓
OAuth 2.0 / SAML / SSO
    ↓
User authentication
```

### Convex
```
convex package
    ↓
Real-time database
    ↓
Backend functions
    ↓
Data synchronization
```

### AI Providers (15+)
```
Vercel AI SDK
    ↓
Provider abstraction
    ↓
OpenAI / Anthropic / Google / etc.
    ↓
LLM API calls
```

---

## Dependency Health

### Critical Dependencies
- **Next.js 16.1.0** - Core framework
- **React 19.2.3** - UI library
- **Convex 1.31.2** - Backend database
- **WorkOS 2.13.0** - Authentication
- **AI SDK 6.0.0-beta.99** - AI integration

### Version Stability
- Next.js: Latest stable (16.x)
- React: Latest stable (19.x)
- Convex: Stable (1.31.x)
- AI SDK: Beta (cutting-edge)

### Dependency Risks
- **AI SDK Beta** - May have breaking changes
- **React 19** - New major version, ecosystem catching up
- **Next.js 16** - New major version, migration from 15

---

## Circular Dependencies

**Status:** No circular dependencies detected

**Import Pattern:**
```
Pages → Components → Hooks → Convex Functions → Database
```

**Unidirectional Flow:**
- Database updates propagate to UI via real-time subscriptions
- No circular component dependencies
- Clean separation of concerns

---

## Module Boundaries

### Clear Boundaries
1. **UI Layer** - Components and pages
2. **Logic Layer** - Custom hooks and utilities
3. **Data Layer** - Convex functions and schema
4. **Service Layer** - WorkOS, AI SDK

### Communication
- **UI → Logic:** Hook calls
- **Logic → Data:** Convex queries/mutations
- **Data → UI:** Real-time subscriptions
- **External Services:** API routes and hooks

---

**End of Dependency Graph Documentation**
