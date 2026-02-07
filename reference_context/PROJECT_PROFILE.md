# Project DNA Profile

## 🧬 Codebase Analysis

### Intent & Purpose
**ALIAS - AEOS** is a real-time SaaS dashboard platform for:
- Agent management and orchestration
- Knowledge base and ontology management
- Client research and profiling
- Project lifecycle tracking
- Multi-agent observability

### Architectural DNA

#### 1. Real-time First Architecture
- **Pattern:** Convex WebSocket subscriptions
- **Manifestation:** All data queries are reactive
- **Files:** `src/lib/hooks/*.ts`, `convex/*.ts`
- **Pattern:** `useQuery` → automatic re-renders on data changes

#### 2. Type-Safe Everything
- **Pattern:** TypeScript strict mode + Zod validation
- **Manifestation:** Generated types from Convex schema
- **Files:** `convex/_generated/*`, `convex/schema.ts`
- **Pattern:** End-to-end type safety from DB to UI

#### 3. Server Components by Default
- **Pattern:** Next.js App Router server components
- **Manifestation:** Client components only when needed
- **Files:** `src/app/**/*.tsx` (mostly server components)
- **Pattern:** Minimal client-side JavaScript

#### 4. Middleware-Based Auth
- **Pattern:** WorkOS session validation in middleware
- **Manifestation:** Route protection at edge
- **Files:** `src/middleware.ts`
- **Pattern:** Session cookie → route access control

#### 5. Multi-Provider Abstraction
- **Pattern:** Unified AI SDK interface
- **Manifestation:** Provider-agnostic AI calls
- **Files:** `src/app/api/ai-demo/*/route.ts`
- **Pattern:** Model selection via configuration

#### 6. Component Composition
- **Pattern:** shadcn/ui + Radix primitives
- **Manifestation:** Composable UI components
- **Files:** `src/components/ui/*`
- **Pattern:** Base primitives → composed components

#### 7. Event-Driven Observability
- **Pattern:** Real-time event streaming
- **Manifestation:** Observability dashboard with live updates
- **Files:** `convex/observability.ts`, `src/components/observability/*`
- **Pattern:** Events → Convex → React subscriptions

---

## 🔍 Tech Stack Constraints

### Hard Constraints
1. **Next.js 16+** (App Router required)
2. **Convex** (Real-time database)
3. **WorkOS** (Authentication)
4. **TypeScript** (Strict mode)
5. **React 19** (Server components)

### Soft Constraints
1. **Bun** (Preferred package manager)
2. **Biome** (Linting/formatting)
3. **Tailwind CSS** (Styling)
4. **shadcn/ui** (Component system)

### Version Pinning
- Next.js: `^16.0.3`
- Convex: `^1.29.3`
- WorkOS: `^2.11.0`
- React: `^19.2.0`
- TypeScript: `^5.9.3`

---

## 📊 Codebase Metrics

### File Structure
- **Total Files:** ~3,500+ (including node_modules)
- **Source Files:** ~150 TypeScript/TSX files
- **Convex Functions:** ~20 queries/mutations
- **API Routes:** ~5 routes
- **Components:** ~40 React components

### Key Directories
```
src/
├── app/              # Next.js App Router pages (34 files)
├── components/       # React components (43 files)
├── lib/              # Utilities and hooks (9 files)
└── middleware.ts     # Route protection

convex/
├── schema.ts         # Database schema
├── users.ts          # User management
├── observability.ts  # Event tracking
├── skills.ts         # Skills management
└── ...               # Other functions
```

---

## 🎯 Feature Domains

### 1. Authentication & Users
- **Files:** `src/lib/workos.ts`, `src/lib/hooks/use-work-os.ts`, `convex/users.ts`
- **Pattern:** WorkOS → Convex sync
- **Features:** OAuth, SSO, MFA, session management

### 2. Agent Management
- **Files:** `src/app/agents/*`, `convex/agentMetrics.ts`
- **Pattern:** Real-time agent tracking
- **Features:** Agent library, metrics, observability

### 3. Skills System
- **Files:** `src/app/(dashboard)/skills/`, `convex/skills*.ts`
- **Pattern:** Web scraping → Knowledge base
- **Features:** Skill creation, versioning, scraping jobs

### 4. Client Research
- **Files:** `src/app/client-profiles/*`, `src/app/research-hub/*`
- **Pattern:** CRUD with approval workflow
- **Features:** Client profiles, research management

### 5. Observability
- **Files:** `src/app/observability/`, `convex/observability.ts`
- **Pattern:** Event streaming dashboard
- **Features:** Real-time events, neural network viz, cost tracking

### 6. Knowledge Base
- **Files:** `src/app/knowledge-base/`
- **Pattern:** Content management
- **Features:** Knowledge organization, search

### 7. Ontology Editor
- **Files:** `src/app/ontology/`, `src/components/ontology/*`
- **Pattern:** 3D visualization with Three.js
- **Features:** Graph visualization, collaboration

---

## 🔗 Integration Points

### External Services
1. **WorkOS** - Authentication provider
2. **Convex** - Database and real-time backend
3. **AI Providers** - Multiple LLM providers via AI SDK
4. **Netlify** - Deployment platform (configured)

### Internal Integrations
1. **WorkOS ↔ Convex** - User synchronization
2. **Convex ↔ React** - Real-time subscriptions
3. **AI SDK ↔ Next.js** - Edge runtime API routes
4. **Three.js ↔ Convex** - 3D data visualization

---

## 🚀 Performance Characteristics

### Real-time Latency
- **Convex Subscriptions:** <100ms update propagation
- **WebSocket Connection:** Persistent, auto-reconnect

### Bundle Size
- **Client JS:** Optimized via Next.js App Router
- **Server Components:** Zero client bundle impact
- **Code Splitting:** Automatic route-based splitting

### Database
- **Query Performance:** Indexed queries, real-time updates
- **Schema Design:** Normalized with strategic denormalization

---

## 🎨 Design Patterns

### State Management
- **Pattern:** Convex as single source of truth
- **No Redux/Zustand:** Real-time subscriptions replace global state
- **Local State:** React `useState` for UI-only state

### Data Fetching
- **Pattern:** `useQuery` for all data
- **No SWR/React Query:** Convex handles caching/subscriptions
- **Mutations:** `useMutation` for writes

### Error Handling
- **Pattern:** Try-catch in mutations, error boundaries in React
- **Convex:** Automatic error propagation
- **UI:** Error states in components

---

## 📝 Code Style DNA

### TypeScript
- **Strict Mode:** Enabled
- **Type Inference:** Preferred over explicit types
- **Zod:** Runtime validation for all inputs

### React
- **Server Components:** Default
- **Client Components:** Only when needed (`"use client"`)
- **Hooks:** Custom hooks for reusable logic

### Styling
- **Tailwind:** Utility-first CSS
- **shadcn/ui:** Component-based design system
- **Responsive:** Mobile-first approach

### Testing
- **Playwright:** E2E tests
- **No Unit Tests:** Currently (to be added)

---

## 🔮 Future Trajectory

### Planned Features
1. Enhanced observability
2. Advanced agent orchestration
3. Knowledge graph expansion
4. Multi-tenant support

### Technical Debt
1. Add unit tests
2. Improve error handling
3. Performance optimization
4. Documentation expansion

---

## 🎯 Platonic Ideals to Find

Based on this profile, search for:

1. **Next.js 16 + Convex** best practices
2. **WorkOS AuthKit** advanced patterns
3. **AI SDK multi-provider** architectures
4. **Real-time dashboard** implementations
5. **Type-safe full-stack** patterns
6. **Server Components** optimization
7. **Event-driven observability** systems


