# CRUSH.md - Development Knowledge Base

## 🎯 Quick Reference

**Project:** ALIAS MOSAIC - AI-Augmented Development Framework
**Stack:** Next.js 16.0.1 + React 19.2.0 + Convex 1.28.0 + WorkOS 2.11.0
**Status:** Production-ready (85%)
**Features:** 27 AI Agents, 35 UCE Neurons, 15+ LLM Providers, Real-time Observability

## Development Commands

```bash
# Development (runs both Next.js and Convex dev servers)
npm run dev                # Starts both servers in parallel
npm run dev:next          # Start only Next.js with Turbopack on 0.0.0.0
npm run dev:convex        # Start only Convex dev server

# Build & Production
npm run build             # Builds Next.js and deploys Convex
npm run start             # Start production server

# Code Quality
npm run lint              # Run Biome linter and TypeScript type checking
npm run format            # Format code with Biome

# Alternative package managers (Bun is primary - 5.6x faster)
bun dev                   # Bun runtime
bun install               # Install dependencies with Bun
```

## Code Style & Conventions

- **Formatter**: Biome with double quotes, 2-space indentation
- **Linter**: Biome with relaxed a11y rules
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/*` maps to `./src/*`
- **Component Files**: PascalCase for React components, camelCase for functions
- **Route Directories**: kebab-case for Next.js route segments

## Architecture Reference

### Technology Stack

**Core:** Next.js 16.0.1, React 19.2.0, TypeScript 5.9.3, Bun 1.0.25
**Backend:** Convex 1.28.0 (real-time reactive database)
**Auth:** WorkOS AuthKit 2.11.0 (SSO/SAML/MFA)
**UI:** shadcn/ui + Radix UI + Tailwind CSS 3.4.18
**3D:** Three.js 0.180.0 + React Three Fiber 9.4.0
**AI:** Vercel AI SDK v6 (15+ LLM providers)
**Viz:** Chart.js 4.5.1 + reaviz 16.1.0
**Animation:** Framer Motion 12.23.24
**Linting:** Biome 2.3.2 (25x faster than ESLint + Prettier)

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── agents/            # Agent management pages (metrics, library, designer)
│   ├── projects/          # Project lifecycle management
│   ├── ontology/          # Ontology editor with collaboration
│   └── providers.tsx      # Global providers (Convex, Theme)
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components (Header, Footer, MainLayout)
│   ├── ontology/         # Ontology visualization and editing
│   └── ConvexClientProvider.tsx  # Convex client wrapper
├── lib/
│   ├── auth.ts           # Better Auth server configuration
│   ├── auth-client.ts    # Better Auth client
│   ├── utils.ts          # cn() utility for className merging
│   └── hooks/            # Custom hooks (useStats, useAuth, useAgentMetrics)
convex/
├── schema.ts             # Database schema definition
├── http.ts               # HTTP routes for auth
├── stats.ts              # Stats queries and mutations
├── agentMetrics.ts       # Agent performance data
└── initDemo.ts           # Demo data initialization
```

## Convex Development Reference

**Reference File**: `convex_rules.txt` in project root contains comprehensive Convex development guidelines:

### Key Patterns
- **Function Syntax**: Always use new function syntax with proper validators
- **HTTP Endpoints**: Defined in `convex/http.ts` with `httpAction` decorator
- **Function Registration**: Public (`query`, `mutation`, `action`) vs Internal (`internalQuery`, `internalMutation`, `internalAction`)
- **Type Safety**: All functions must include argument and return validators
- **Database Operations**: Use indexes, avoid filter in queries, use proper pagination

### Convex Data Types & Validators
- `v.id(tableName)` - Document IDs
- `v.null()` - Null values (not undefined)
- `v.int64()` - BigInt values (-2^63 to 2^63-1)
- `v.number()` - IEEE-754 double-precision floats
- `v.boolean()` - Boolean values
- `v.string()` - UTF-8 strings (< 1MB)
- `v.bytes()` - ArrayBuffer for binary data (< 1MB)
- `v.array(values)` - Arrays (max 8192 values)
- `v.object({property: value})` - Plain objects (max 1024 entries)
- `v.record(keys, values)` - Dynamic key objects

### Convex Best Practices
- Always define schema in `convex/schema.ts`
- Include all index fields in index name (e.g., "by_field1_and_field2")
- Use `ctx.runQuery`, `ctx.runMutation`, `ctx.runAction` for function calls
- Use type annotations for circular references
- Be strict with ID types (use `Id<'table'>` not `string`)

## Environment Variables

Required in `.env.local`:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=     # Public Convex URL (from dashboard)
CONVEX_DEPLOYMENT=          # Convex deployment identifier

# WorkOS Authentication (Required)
WORKOS_API_KEY=             # WorkOS API key (sk_*)
WORKOS_CLIENT_ID=           # WorkOS Client ID (client_*)
WORKOS_COOKIE_PASSWORD=     # 32+ char secret (openssl rand -base64 32)
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI SDK v6 (All Optional - Demo keys available)
# See AI-SDK-SETUP-COMPLETE.md for complete list of 15+ providers
OPENAI_API_KEY=             # OpenAI GPT-4
ANTHROPIC_API_KEY=          # Claude 3.5 Sonnet
GEMINI_API_KEY=             # Google Gemini
CEREBRAS_API_KEY=           # Cerebras (ultra-fast)
GROQ_API_KEY=               # Groq (fast inference)
# ... 10+ more providers available
```

## Key Features

**1. Multi-Agent System (27 Agents)**
- Data Squadron: 9 agents (data processing)
- Knowledge Squadron: 9 agents (knowledge management)
- Validation Squadron: 9 agents (quality assurance)

**2. UCE Neural Network**
- 35 neurons (uce-01 to uce-35)
- Real-time activation tracking
- Context-aware processing

**3. Observability (ALIAS Hivemind V3)**
- HTTP endpoints: `/api/observability/*`
- Event ingestion (single + batch)
- LLM cost tracking (15+ providers)
- Session correlation
- Neural network monitoring

**4. Client Research Workflow**
- Multi-stage approval: draft → awaiting_approval → approved → published
- QA process with scoring (quality, fact-check, risk)
- Agent collaboration
- Version tracking

**5. Skills Management**
- Skill Seeker integration (docs → Claude skills)
- Background scraping jobs
- Version control + changelog
- Category management

**6. Multi-LLM Support**
- 15+ AI providers (OpenAI, Anthropic, Google, Cerebras, etc.)
- Streaming responses
- Tool calling
- Cross-framework (React, Svelte, Vue, Solid)

## Testing Guidelines

**Current State:** ✅ Playwright E2E testing suite implemented
**Test Framework:** Playwright 1.56.1 with cross-browser support
**Test Files:** 7 E2E test files covering all critical paths
**Coverage:** Authentication, navigation, AI demo, client research, skills, observability, 3D globe

**Running Tests:**
```bash
bun run test              # Run all tests
bun run test:ui           # Interactive UI mode (recommended)
bun run test:headed       # Run with visible browser
bun run test:report       # View HTML report
```

**Test Files:**
- `tests/e2e/01-authentication.spec.ts` - WorkOS login flow
- `tests/e2e/02-navigation.spec.ts` - Page routing
- `tests/e2e/03-ai-demo.spec.ts` - Multi-LLM demo (15+ providers)
- `tests/e2e/04-client-research.spec.ts` - Research workflow
- `tests/e2e/05-skills-management.spec.ts` - Skills library
- `tests/e2e/06-observability.spec.ts` - Agent metrics + UCE neural network
- `tests/e2e/07-globe-visualization.spec.ts` - 3D globe performance

**Browser Coverage:**
- Desktop: Chromium, Firefox, WebKit (Safari)
- Mobile: Pixel 5 (Chrome), iPhone 12 (Safari)

**Manual Testing:** Run `npm run dev` and test at `http://localhost:3000`
**Quality Checks:** `npm run lint` before committing
**Convex Testing:** Use Convex dashboard or `/run-node` utility

**Critical Paths Covered:**
1. ✅ Authentication flow (WorkOS login → callback → dashboard)
2. ✅ Client research creation and approval workflow
3. ✅ Skills management (create, scrape, version)
4. ✅ Agent metrics and observability dashboard
5. ✅ Multi-LLM demo (`/ai-demo`)
6. ✅ 3D globe visualization (performance on mobile)