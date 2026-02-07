# ALIAS Super Admin Console - File Structure & Organization

**Generated:** 2026-02-07
**Project Root:** `/Users/alias/Projects/Work/ALIAS-Internal/unified-alias-damn`
**Total LOC (src/):** 17,258 lines
**Total LOC (convex/):** 3,872 lines

---

## Root Directory Structure

```
unified-alias-damn/
├── src/                          # Next.js App Router application (97 TS/TSX files)
├── convex/                       # Convex backend (14 modules)
├── public/                       # Static assets
├── docs/                         # Project documentation
├── tests/                        # Test suites
├── skill-manager/                # Skill Seeker standalone tool
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── biome.json                    # Biome linter configuration
├── proxy.ts                      # WorkOS AuthKit proxy (Next.js 16 pattern)
├── playwright.config.ts          # E2E test configuration
├── netlify.toml                  # Netlify deployment config
└── vercel.json                   # Vercel deployment config
```

---

## src/ - Next.js Application Structure

### Overview
- **Total Files:** 97 TypeScript/TSX files
- **Lines of Code:** 17,258
- **Purpose:** Frontend application with App Router pattern

---

### src/app/ - App Router Pages (24 routes)

**Purpose:** File-based routing with Next.js 16 App Router

```
src/app/
├── page.tsx                      # Homepage/Dashboard (7 imports)
├── layout.tsx                    # Root layout with providers
├── providers.tsx                 # Global providers (Convex, Theme)
│
├── (dashboard)/                  # Route group for authenticated dashboard
│   └── skills/                   # Skills management (auth-protected)
│       └── page.tsx             # Skills overview (5 imports)
│
├── login/                        # WorkOS authentication initiation
│   └── page.tsx                 # Public login page
│
├── callback/                     # OAuth callback handler
│   └── page.tsx                 # WorkOS redirects here after auth
│
├── dashboard/                    # Main dashboard view
│   └── page.tsx                 # Dashboard widgets (3 imports)
│
├── agents/                       # Agent management section
│   ├── page.tsx                 # Agent overview (2 imports)
│   ├── metrics/                 # Performance metrics & analytics
│   │   └── page.tsx            # Agent metrics (5 imports, 573 LOC)
│   ├── library/                 # Agent library
│   │   └── page.tsx            # Agent library (3 imports)
│   ├── designer/                # Agent designer/builder
│   │   └── page.tsx            # Agent builder (5 imports, 940 LOC)
│   └── management/              # Agent management
│       └── page.tsx            # Agent management (5 imports)
│
├── projects/                     # Project lifecycle
│   ├── page.tsx                 # Projects list (4 imports, 429 LOC)
│   ├── [id]/                    # Dynamic project detail pages
│   │   └── page.tsx            # Project details (4 imports, 989 LOC)
│   └── activities/              # Project activities
│       └── page.tsx            # Activity feed (2 imports)
│
├── client-profiles/              # Client management
│   ├── page.tsx                 # Clients list (1 import)
│   ├── new/                     # Create new client
│   │   └── page.tsx            # New client form (4 imports)
│   └── [id]/                    # Client detail pages
│       └── page.tsx            # Client profile (5 imports, 342 LOC)
│
├── research-hub/                 # Research management
│   ├── page.tsx                 # Research hub overview (1 import)
│   └── new/                     # Create new research
│       └── page.tsx            # New research form (4 imports)
│
├── ontology/                     # Ontology editor
│   └── page.tsx                 # Ontology visualization (6 imports, 790 LOC)
│
├── knowledge-base/               # Knowledge management
│   └── page.tsx                 # Knowledge base (3 imports, 480 LOC)
│
├── deploy/                       # Deployment pipeline
│   └── page.tsx                 # Deployment view (5 imports, 1007 LOC)
│
├── profile/                      # User profile
│   └── page.tsx                 # Profile settings (4 imports, 289 LOC)
│
├── observability/                # Observability dashboard
│   └── page.tsx                 # Event tracking (6 imports)
│
├── ai-demo/                      # Multi-LLM demo
│   └── page.tsx                 # AI provider comparison (6 imports)
│
├── run-node/                     # Node execution utility
│   └── page.tsx                 # Run Convex nodes (2 imports, 575 LOC)
│
└── api/                          # API routes
    ├── auth/                    # Auth endpoints
    │   └── logout/
    │       └── route.ts        # POST /api/auth/logout
    ├── ai/                      # AI chat endpoint
    │   └── chat/
    │       └── route.ts        # POST /api/ai/chat
    └── ai-demo/                 # AI demo endpoints
        ├── chat/
        │   └── route.ts        # POST /api/ai-demo/chat
        ├── structured/
        │   └── route.ts        # POST /api/ai-demo/structured
        └── generate/
            └── route.ts        # POST /api/ai-demo/generate
```

**Route Statistics:**
- **Total page routes:** 24
- **API routes:** 5 endpoints
- **Dynamic routes:** 2 (`[id]` for projects and clients)
- **Route groups:** 1 (`(dashboard)` for layout organization)
- **Public routes:** 2 (`/login`, `/callback`)
- **Protected routes:** 22 (via proxy.ts)

---

### src/components/ - Reusable Components (49 files)

**Purpose:** Shared UI components organized by feature

```
src/components/
├── ui/                           # shadcn/ui components (18 files)
│   ├── globe/                   # 3D globe visualization
│   │   └── Globe.tsx           # Three.js globe component
│   ├── button.tsx              # Button component
│   ├── card.tsx                # Card container
│   ├── input.tsx               # Text input
│   ├── textarea.tsx            # Multi-line input
│   ├── label.tsx               # Form labels
│   ├── badge.tsx               # Status badges
│   ├── status-badge.tsx        # Status indicator
│   ├── avatar.tsx              # User avatars
│   ├── select.tsx              # Dropdown select
│   ├── tabs.tsx                # Tab navigation
│   ├── table.tsx               # Data table
│   ├── progress.tsx            # Progress bar
│   ├── alert.tsx               # Alert messages
│   ├── skeleton.tsx            # Loading skeletons
│   ├── empty-state.tsx         # Empty state placeholder
│   ├── theme-toggle.tsx        # Dark mode toggle
│   └── ...18+ components       # Additional shadcn/ui primitives
│
├── layout/                       # Layout components
│   ├── Header.tsx              # Navigation header (9 nav items, 333 LOC)
│   ├── Footer.tsx              # Footer component
│   └── MainLayout.tsx          # Main layout wrapper
│
├── dashboard/                    # Dashboard widgets
│   ├── NetworkOverview.tsx     # Network statistics (4 imports)
│   ├── ProjectsSummary.tsx     # Project cards (4 imports)
│   ├── LiveFeed.tsx            # Real-time feed (3 imports)
│   ├── AgentActivities.tsx     # Agent activity tracker (4 imports)
│   ├── Leaderboard.tsx         # Performance rankings (4 imports)
│   ├── OntologyOverview.tsx    # Ontology summary (3 imports)
│   ├── AIAssistPanel.tsx       # AI assistant panel (3 imports, 311 LOC)
│   └── ...6+ widgets           # Additional dashboard components
│
├── ontology/                     # Ontology visualization
│   ├── OntologyVisualizer.tsx  # Graph visualization (568 LOC)
│   ├── CollaborativeOntologyVisualizer.tsx  # Multi-user
│   └── CollaborationProvider.tsx # Real-time sync (464 LOC)
│
├── skills/                       # Skills management UI
│   ├── skills-manager.tsx      # Skills library (354 LOC)
│   ├── skill-builder.tsx       # Create/edit skills (436 LOC)
│   ├── skill-versions.tsx      # Version history (292 LOC)
│   └── skill-analytics.tsx     # Usage analytics (426 LOC)
│
├── client-profiles/              # Client management UI
│   ├── ClientProfilesClient.tsx # Client list (2 imports)
│   └── client-card.tsx         # Client card component
│
├── research/                     # Research UI components
│   └── ResearchHubClient.tsx   # Research hub interface (367 LOC)
│
├── observability/                # Observability dashboard
│   ├── EventTimeline.tsx       # Event stream (2 imports)
│   ├── SquadronPanel.tsx       # Squadron status (1 import)
│   ├── CostTracker.tsx         # LLM cost tracking (1 import)
│   ├── FilterPanel.tsx         # Event filters (1 import)
│   └── NeuralNetworkViz.tsx    # UCE neural network (1 import)
│
├── ai-demo/                      # AI demo components
│   ├── chat-demo.tsx           # Chat interface (3 imports)
│   └── ...demo components       # Additional AI demos
│
├── charts/                       # Data visualization
│   ├── LineChart.tsx           # Line charts (1 import)
│   └── PieChart.tsx            # Pie charts (1 import)
│
└── ConvexClientProvider.tsx     # Convex provider wrapper
```

**Component Statistics:**
- **Total component files:** 49
- **UI components (shadcn/ui):** 18+
- **Dashboard widgets:** 6+
- **Feature-specific:** ontology, skills, research, observability

---

### src/lib/ - Utilities & Helpers

**Purpose:** Shared utilities, hooks, and configurations

```
src/lib/
├── workos.ts                    # WorkOS client configuration
├── workos-server.ts             # WorkOS server utilities
├── utils.ts                     # Common utilities (cn, formatters)
├── session.ts                   # Session management
├── auth.ts                      # Auth configuration
├── config.ts                    # App configuration
│
├── hooks/                       # Custom React hooks
│   ├── use-work-os.ts          # WorkOS hook (1 import)
│   ├── use-auth.ts             # Auth hook
│   ├── use-stats.ts            # Dashboard stats
│   ├── use-agent-metrics.ts    # Agent metrics
│   └── ...custom hooks          # Additional hooks
│
└── contexts/                    # React contexts
    └── org-context.tsx         # Organization context (1 import)
```

---

### src/examples/ - Example Code

**Purpose:** Documentation and example implementations

```
src/examples/
└── ai-sdk/
    └── README.md               # AI SDK usage examples (1 import)
```

---

## convex/ - Backend Modules (14 files)

**Overview:**
- **Total Files:** 14 TypeScript modules
- **Lines of Code:** 3,872
- **Purpose:** Convex real-time backend with 16 tables

```
convex/
├── schema.ts                    # Database schema definition (497 LOC)
│                               # 16 tables with indexes
│
├── users.ts                     # User management (184 LOC)
│                               # WorkOS sync, profile CRUD
│
├── orgs.ts                      # Organization management (90 LOC)
│                               # Multi-tenancy support
│
├── stats.ts                     # Dashboard statistics (240 LOC)
│                               # Metrics aggregation
│
├── agentMetrics.ts              # Agent performance (256 LOC)
│                               # Analytics data
│
├── clientProfiles.ts            # Client CRUD (140 LOC)
│                               # Full-text search
│
├── clientResearch.ts            # Research workflow (228 LOC)
│                               # Approval process
│
├── skills.ts                    # Skills queries (312 LOC)
│                               # Library management
│
├── skills_mutations.ts          # Skills mutations (228 LOC)
│                               # CRUD operations
│
├── observability.ts             # Event tracking (680 LOC)
│                               # UCE neural network
│                               # Squadron status
│
├── http.ts                      # HTTP endpoints (294 LOC)
│                               # Observability API
│                               # Neural activation
│                               # Squadron updates
│
├── notifications.ts             # Notification system (52 LOC)
│
├── initDemo.ts                  # Demo data seeding (76 LOC)
│
└── _generated/                  # Auto-generated by Convex
    ├── server.js               # Server functions
    └── api.js                  # API definitions
```

**Convex Module Breakdown:**

| Module | Lines | Purpose |
|--------|-------|---------|
| schema.ts | 497 | Database schema with 16 tables |
| observability.ts | 680 | Event tracking, neural network, squadrons |
| skills.ts | 312 | Skills library queries |
| http.ts | 294 | HTTP endpoints for observability |
| stats.ts | 240 | Dashboard statistics |
| agentMetrics.ts | 256 | Agent performance metrics |
| skills_mutations.ts | 228 | Skills CRUD operations |
| clientResearch.ts | 228 | Research workflow |
| users.ts | 184 | User management with WorkOS sync |
| orgs.ts | 90 | Organization multi-tenancy |
| clientProfiles.ts | 140 | Client profile management |
| notifications.ts | 52 | Notification system |
| initDemo.ts | 76 | Demo data generation |

---

## Database Schema (16 Tables)

### Core Tables
1. **orgs** - Organizations (multi-tenancy root)
2. **users** - User profiles with WorkOS sync
3. **stats** - Dashboard metrics
4. **recentActivities** - Activity feed

### Project & Agent Tables
5. **projectActivities** - Globe visualization data
6. **projectPerformance** - Project metrics
7. **agentActivities** - Agent activity log
8. **agentMetrics** - Agent analytics
9. **agentCalls** - Agent call history

### Skills Management Tables
10. **skills** - Skill library
11. **skillVersions** - Version history
12. **skillScrapingJobs** - Background jobs
13. **skillCategories** - Categorization

### Client Research Tables
14. **clientProfiles** - Client information
15. **clientResearch** - Research workflow

### Observability Tables (ALIAS Hivemind V3)
16. **observabilityEvents** - Event stream
17. **uceNeuralActivations** - UCE neural network (35 neurons)
18. **squadronStatus** - Squadron tracking (3 squadrons × 9 agents)

---

## Configuration Files

### Root Level
```
├── package.json                 # Dependencies, scripts
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind theme
├── tsconfig.json                # TypeScript config
├── biome.json                   # Biome linter
├── proxy.ts                     # WorkOS proxy
├── playwright.config.ts         # E2E tests
├── netlify.toml                 # Netlify deploy
└── vercel.json                  # Vercel deploy
```

### Documentation
```
docs/
├── forensic-analysis/           # This analysis
│   ├── TECH_STACK.md
│   ├── FILE_STRUCTURE.md
│   ├── DEPENDENCY_GRAPH.md
│   └── COMPLEXITY_METRICS.md
└── ...project documentation
```

---

## Testing Structure

```
tests/
└── e2e/                         # Playwright E2E tests
    ├── 01-authentication.spec.ts
    ├── 02-navigation.spec.ts
    ├── 03-ai-demo.spec.ts
    ├── 04-client-research.spec.ts
    ├── 05-skills-management.spec.ts
    ├── 06-observability.spec.ts
    └── 07-globe-visualization.spec.ts
```

**Test Coverage:**
- 7 test files
- Multi-browser support (Chromium, Firefox, WebKit)
- Device testing (desktop + mobile)
- Auth flow, navigation, AI demo, client research, skills, observability, globe

---

## Skill Manager (Standalone Tool)

```
skill-manager/
├── README.md                    # Skill Seeker documentation
├── package.json                 # Independent dependencies
└── ...skill manager source      # Standalone tool
```

**Purpose:** Convert documentation websites into Claude AI skills

---

## Key File Metrics

### Largest Source Files (by LOC)
1. **app/deploy/page.tsx** - 1,007 LOC
2. **app/projects/[id]/page.tsx** - 989 LOC
3. **app/agents/designer/page.tsx** - 940 LOC
4. **app/ontology/page.tsx** - 790 LOC
5. **app/run-node/page.tsx** - 575 LOC
6. **app/agents/metrics/page.tsx** - 573 LOC
7. **components/ontology/OntologyVisualizer.tsx** - 568 LOC
8. **app/knowledge-base/page.tsx** - 480 LOC
9. **components/skills/skill-builder.tsx** - 436 LOC
10. **app/projects/page.tsx** - 429 LOC

### Largest Backend Modules (by LOC)
1. **schema.ts** - 497 LOC
2. **observability.ts** - 680 LOC
3. **skills.ts** - 312 LOC
4. **http.ts** - 294 LOC
5. **stats.ts** - 240 LOC

---

## Import Patterns

### Internal Imports (187 occurrences across 71 files)
- **@/components** - Component imports
- **@/lib** - Utility and hook imports
- **convex/* - Backend function imports

### External Dependencies
- **WorkOS** - Authentication
- **Convex** - Database queries/mutations
- **AI SDK** - Multi-LLM integration
- **Radix UI** - Component primitives
- **Framer Motion** - Animations
- **Three.js** - 3D visualization

---

## File Organization Principles

### Next.js App Router
- File-based routing in `src/app/`
- Route groups for layout organization `(dashboard)`
- API routes in `src/app/api/`
- Server and client components mixed

### Component Organization
- **ui/** - Generic, reusable components (shadcn/ui)
- **feature/** - Feature-specific components
- **layout/** - App shell components

### Backend Organization
- **schema.ts** - Single source of truth for data model
- **feature.ts** - Queries per feature
- **feature_mutations.ts** - Mutations per feature
- **http.ts** - HTTP endpoints

---

**End of File Structure Documentation**
