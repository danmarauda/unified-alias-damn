# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ALIAS Super Admin Console** - Single pane of glass for complete organizational visibility.
Built on AEOS (ALIAS Enterprise Operating System).

### This Project

The Super Admin Console is:
- **Single Pane of Glass** - See EVERYTHING across the organization
- **Executive Showcase** - Demo for potential executives on what AEOS enables
- **Proof of Concept** - Shows proper ontology + data foundation + AI working together
- **3D Globe** - ALIAS Global Deployments (Clients, Agents, Internal, External)

### ALIAS Organization
- **ALIAS** - Consulting & software engineering services
- **ALIAS Labs** - AI/ML research & development, model training, AI solutions

### ALIAS Products
- **AEOS** (flagship) - Enterprise Operating System (solo → Fortune 500)
- **AgentWorks** - Managed Agents-as-a-Service
- **The Toolbox** - Business tools subscription (lead funnel → tailored solutions)

**Status:** Production-ready (85%), actively developed
**Primary Stack:** Next.js 16.0.10 + Convex 1.31.2 + WorkOS AuthKit 2.11.0

**Key Features:**
- 27 AI Agents (3 squadrons: Data, Knowledge, Validation - 9 agents each)
- 35 UCE Neural Network neurons for agent coordination
- AI Operating Modes: Autopilot (>90%), Copilot (70-90%), Manual (<70%)
- Belt System: 10-level progressive security clearance (White → Red)
- Decision Gates: Risk-based approval workflows
- 12-Area Knowledge Taxonomy for unified context
- Real-time observability with comprehensive event tracking
- Client research workflow with multi-stage approval process
- Skills management system (Skill Seeker integration)
- Multi-LLM support (15+ AI providers via Vercel AI SDK v6)
- Enterprise authentication (WorkOS SSO/SAML/MFA)

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

# Alternative package managers (Bun is primary)
bun dev                   # Bun runtime (5.6x faster installs)
bun install               # Install dependencies with Bun
```

## Architecture

### Technology Stack

**Core Framework:**
- **Next.js** 16.0.10 - App Router + Turbopack + proxy.ts
- **React** 19.2.0 - Latest stable release
- **TypeScript** 5.9.3 - Strict mode enabled
- **Bun** 1.0.25 - Primary package manager & runtime

**Backend & Database:**
- **Convex** 1.31.2 - Real-time reactive database-as-a-service
- **WorkOS AuthKit** 2.11.0 - Enterprise SSO/SAML/MFA authentication

**AI & Multi-LLM (Vercel AI SDK v6):**
- **15+ AI Providers:** OpenAI, Anthropic, Google, Cerebras, Mistral, Groq, DeepSeek, Cohere, Fireworks, Together AI, Perplexity, xAI, AWS Bedrock, Azure, Google Vertex
- **AI SDK Core** 6.0.0-beta.84 - Streaming, tool calling, multi-framework
- **Cross-framework support:** React, Svelte, Vue, Solid

**UI & Styling:**
- **shadcn/ui + Radix UI** - Accessible component primitives
- **Tailwind CSS** 3.4.18 - Utility-first styling
- **Framer Motion** 12.23.24 - Animations
- **Lucide React** 0.548.0 - Icon library
- **next-themes** 0.4.6 - Dark mode support

**3D Visualization:**
- **Three.js** 0.180.0 - 3D rendering engine
- **React Three Fiber** 9.4.0 - React integration
- **React Three Drei** 10.7.6 - Helper utilities

**Data Visualization:**
- **Chart.js** 4.5.1 - Canvas-based charts
- **React Chart.js 2** 5.3.1 - React wrapper
- **reaviz** 16.1.0 - Advanced visualizations

**Development Tools:**
- **Biome** 2.3.2 - Fast linter & formatter (replaces ESLint + Prettier)
- **Ultracite** 6.0.5 - Advanced linting rules
- **TypeScript** 5.9.3 with strict mode

### Project Structure

```
src/
├── app/                          # Next.js App Router (27 pages)
│   ├── page.tsx                 # Home/Dashboard
│   ├── dashboard/               # Main dashboard view
│   ├── login/                   # WorkOS login initiation
│   ├── callback/                # OAuth callback handler
│   ├── agents/                  # Agent management
│   │   ├── page.tsx            # Agent overview
│   │   ├── metrics/            # Performance metrics & analytics
│   │   ├── library/            # Agent library
│   │   ├── designer/           # Agent designer/builder
│   │   └── management/         # Agent management
│   ├── projects/                # Project lifecycle
│   │   ├── page.tsx            # Projects list
│   │   ├── [id]/               # Project details
│   │   └── activities/         # Project activities
│   ├── client-profiles/         # Client management
│   │   ├── page.tsx            # Clients list
│   │   ├── new/                # Create client
│   │   └── [id]/               # Client details
│   ├── research-hub/            # Research management
│   │   ├── page.tsx            # Research hub
│   │   └── new/                # Create research
│   ├── ontology/                # Ontology editor
│   ├── knowledge-base/          # Knowledge management
│   ├── deploy/                  # Deployment pipeline
│   ├── profile/                 # User profile
│   ├── ai-demo/                 # AI multi-LLM demo (15+ providers)
│   ├── (dashboard)/skills/      # Skills management (route group)
│   ├── run-node/                # Node execution utility
│   ├── generate-data/           # Demo data generation
│   ├── api/                     # API routes
│   │   ├── auth/               # Auth endpoints
│   │   └── ai-demo/            # AI demo endpoints
│   └── providers.tsx            # Global providers
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── globe/Globe.tsx     # 3D globe (Three.js)
│   │   └── ...16+ components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx          # Navigation (9 items)
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   ├── dashboard/               # Dashboard widgets
│   │   ├── NetworkOverview.tsx
│   │   ├── ProjectsSummary.tsx
│   │   ├── LiveFeed.tsx
│   │   ├── AgentActivities.tsx
│   │   └── ...6+ widgets
│   ├── ontology/                # Ontology visualization
│   ├── skills/                  # Skills management UI
│   ├── client-profiles/         # Client UI components
│   ├── research/                # Research UI
│   ├── ai-demo/                 # AI demo components
│   └── ConvexClientProvider.tsx
├── lib/
│   ├── workos.ts               # WorkOS client
│   ├── workos-server.ts        # WorkOS server utilities
│   ├── utils.ts                # Utilities (cn, etc.)
│   ├── session.ts              # Session management
│   ├── auth.ts                 # Auth configuration
│   ├── config.ts               # App configuration
│   └── hooks/                  # Custom React hooks
│       ├── use-work-os.ts      # WorkOS hook
│       ├── use-auth.ts         # Auth hook
│       ├── use-stats.ts        # Dashboard stats
│       └── use-agent-metrics.ts
└── proxy.ts                    # Next.js 16 proxy (replaced middleware.ts)

convex/                          # Convex backend (16 tables, 54 functions)
├── schema.ts                   # Database schema
├── http.ts                     # HTTP routes (observability)
├── users.ts                    # User management
├── stats.ts                    # Dashboard stats
├── agentMetrics.ts             # Agent performance
├── clientProfiles.ts           # Client CRUD
├── clientResearch.ts           # Research workflow
├── skills.ts                   # Skills queries
├── skills_mutations.ts         # Skills mutations
├── observability.ts            # Event tracking, neural network
└── initDemo.ts                 # Demo data

proxy.ts                         # WorkOS AuthKit route protection (Next.js 16 proxy pattern)
react.d.ts                       # JSX namespace (react-markdown compat)
skill-manager/                   # Skill Seeker tool
```

### Key Architectural Patterns

1. **WorkOS Authentication Flow**
   - Proxy (`proxy.ts`) handles all authentication via WorkOS AuthKit (Next.js 16 pattern)
   - Public routes: `/login`, `/callback` (unauthenticated access)
   - All other routes require authentication
   - User data synced to Convex `users` table with WorkOS user ID
   - Session management handled automatically by WorkOS

2. **Real-time Data with Convex**
   - All data operations go through Convex functions
   - Use `useQuery` hooks for reactive data fetching
   - Use `useMutation` hooks for data modifications
   - Schema-defined tables provide type safety
   - No manual API routes needed for data operations

3. **Provider Hierarchy**
   ```typescript
   ConvexClientProvider
   └── ThemeProvider
       └── Application Components
   ```

4. **Component Patterns**
   - Use `forwardRef` for components needing DOM access
   - Apply `cn()` utility from `/lib/utils.ts` for className merging
   - Follow shadcn/ui patterns for new UI components
   - Keep components focused and composable

5. **Database Schema**
   Key tables in Convex:
   - `users` - WorkOS authentication with profile data (indexed by workosUserId, email)
   - `stats` - Dashboard metrics
   - `projectActivities` - Globe visualization data
   - `agentCalls` - Agent performance tracking
   - `agentMetrics` - Agent analytics data
   - `clientProfiles` - Client profile management (with full-text search on name)
   - `clientResearch` - Comprehensive research workflow with approval process
   - `skills` - Skill library management
   - `skillVersions` - Skill version history
   - `skillScrapingJobs` - Background scraping job tracking
   - `skillCategories` - Skill categorization

### Code Style

- **Formatter**: Biome with double quotes, 2-space indentation
- **Linter**: Biome with relaxed a11y rules
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/*` maps to `./src/*`

### Observability Architecture (ALIAS Hivemind V3)

**Comprehensive Event Tracking System:**

1. **Event Sources:**
   - Voice Controller (voice commands)
   - Browser Actions (user interactions)
   - LLM Router (AI model calls)
   - Agent Coordination (27 agents)

2. **UCE Neural Network:**
   - 35 neurons (uce-01 to uce-35)
   - Activation tracking (0.0-1.0 scale)
   - Weight management
   - Context-aware processing

3. **Squadron Organization:**
   - **Data Squadron:** 9 agents (data processing)
   - **Knowledge Squadron:** 9 agents (knowledge management)
   - **Validation Squadron:** 9 agents (quality assurance)

4. **HTTP Endpoints:**
   - `POST /api/observability/ingest` - Event ingestion (single/batch)
   - `POST /api/observability/neural` - Neural activation tracking
   - `POST /api/observability/squadron` - Squadron status updates
   - `GET /api/observability/health` - Health check

5. **Metrics Tracked:**
   - LLM provider usage (OpenAI, Gemini, Claude, etc.)
   - Token consumption (prompt + completion)
   - Cost estimates per call
   - Agent performance
   - Squadron efficiency
   - Session correlation

### Environment Variables

Required in `.env.local`:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=     # Public Convex URL (from Convex dashboard)
CONVEX_DEPLOYMENT=          # Convex deployment identifier

# WorkOS Authentication
WORKOS_API_KEY=             # WorkOS API key (starts with 'sk_')
WORKOS_CLIENT_ID=           # WorkOS Client ID (starts with 'client_')
WORKOS_COOKIE_PASSWORD=     # 32+ character secret (generate with openssl rand -base64 32)
NEXT_PUBLIC_WORKOS_REDIRECT_URI= # OAuth redirect URI (http://localhost:3000/callback)

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI SDK v6 (15+ providers - all optional, demo keys provided)
OPENAI_API_KEY=             # OpenAI GPT-4
ANTHROPIC_API_KEY=          # Claude 3.5 Sonnet
GEMINI_API_KEY=             # Google Gemini
CEREBRAS_API_KEY=           # Cerebras (ultra-fast inference)
GROQ_API_KEY=               # Groq (fast inference)
MISTRAL_API_KEY=            # Mistral AI
DEEPSEEK_API_KEY=           # DeepSeek
COHERE_API_KEY=             # Cohere
FIREWORKS_API_KEY=          # Fireworks AI
TOGETHERAI_API_KEY=         # Together AI
PERPLEXITY_API_KEY=         # Perplexity
XAI_API_KEY=                # xAI (Grok)
# ... plus AWS Bedrock, Azure OpenAI, Google Vertex AI (see AI-SDK-SETUP-COMPLETE.md)
```

### WorkOS Authentication Setup

1. **Configure WorkOS Dashboard**:
   - Redirect URIs: `http://localhost:3000/callback` (dev), `https://your-domain.com/callback` (prod)
   - Initiate Login URL: `http://localhost:3000/login`
   - Logout Redirect: `http://localhost:3000`

2. **Authentication Flow**:
   - Login: Users navigate to `/login` to initiate authentication
   - OAuth Redirect: WorkOS handles the OAuth flow securely
   - Callback: WorkOS redirects to `/callback` with auth tokens
   - Session Creation: Secure session cookies are created
   - User Sync: User data automatically synced to Convex database

3. **Protected Routes**: All routes except `/login` and `/callback` require authentication (controlled by proxy.ts)

### Deployment

Configured for Netlify with:
- Bun 1.0.25 runtime
- Next.js plugin
- Convex deployment during build
- Remote image optimization for Unsplash

### BMAD Framework Integration

The project includes `.cursor/rules/` with agent personas for development workflow:
- `bmad-orchestrator.mdc` - BMAD workflow orchestrator
- `dev.mdc` - Full Stack Developer agent
- `architect.mdc` - System Architect agent
- `qa.mdc` - Quality Assurance agent
- `pm.mdc` - Project Manager agent
- `po.mdc` - Product Owner agent
- `analyst.mdc` - Analyst agent
- `infra-devops-platform.mdc` - Infrastructure & DevOps agent

These define structured development workflows with task execution patterns and validation checkpoints.

### Skill Manager Integration

Located in `skill-manager/` directory - a standalone tool for converting documentation websites into Claude AI skills:

**Key Features:**
- Automated documentation scraping and skill generation
- MCP server integration with 9 tools for Claude Code
- Support for large documentation (10K-40K+ pages)
- AI-powered enhancement of skill files
- Automatic upload to Claude

**See:** `skill-manager/README.md` for complete documentation

### Convex Development Reference

**Reference File**: `convex_rules.txt` in project root contains comprehensive Convex development guidelines including:
- Modern function syntax using `query`, `mutation`, `action` with proper validators
- HTTP endpoint patterns with `httpAction` decorator
- Complete validator reference for all Convex data types (Id, Null, Int64, Float64, Boolean, String, Bytes, Array, Object, Record)
- Function registration best practices (public vs internal functions)
- Database operations, pagination, indexing patterns
- Full chat app implementation example with AI integration

This reference should be consulted when working with Convex functions, schema definitions, or database operations.

## Client Research Workflow

The application includes a comprehensive client research management system:

1. **Client Profiles** (`clientProfiles` table):
   - Basic client information (name, industry, size, location)
   - Status tracking (active, prospect, inactive)
   - Full-text search on client names
   - Tag-based organization

2. **Client Research** (`clientResearch` table):
   - Multi-stage approval workflow: draft → awaiting_approval → approved → published
   - Quality assurance process with QA status and scores
   - Agent collaboration with assigned agents
   - Version tracking with revision numbers
   - Comprehensive metadata (risk scores, fact-check scores, quality scores)
   - Attachment management

**Access:** `/client-profiles` page for UI implementation

## Common Development Tasks

### Running Tests

```bash
bun run lint              # Lint and type check
bunx tsc --noEmit         # TypeScript validation only
```

### Adding New Convex Functions

1. Create/edit file in `convex/` directory
2. Use modern function syntax with validators:
```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  args: { userId: v.id("users") },
  returns: v.object({ name: v.string() }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return { name: user?.firstName || "Unknown" };
  },
});
```

### Adding New Protected Routes

All routes are protected by default except `/login` and `/callback`. To make a route public, update `proxy.ts`:

```typescript
// proxy.ts (Next.js 16 pattern)
const authkitHandler = authkitMiddleware({
  middlewareAuth: {
    enabled: false,  // Disabled for public pages with auth UI
    unauthenticatedPaths: [],
  },
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authkitHandler(request, event);
}
```

### Adding New UI Components

Follow shadcn/ui patterns:
```bash
# Add a new shadcn component
npx shadcn-ui@latest add button

# Components are added to src/components/ui/
```

## Troubleshooting

### WorkOS Authentication Issues

**"Invalid redirect URI" error**:
- Ensure redirect URIs in WorkOS Dashboard exactly match your `.env.local`
- Include protocol (`http://` or `https://`)
- No trailing slashes

**Sessions not persisting**:
- Verify `WORKOS_COOKIE_PASSWORD` is at least 32 characters
- Check browser cookie settings (allow third-party cookies)

**User not syncing to Convex**:
- Check Convex logs in dashboard
- Verify `convex/users.ts` is deployed
- Ensure user email is valid

### Convex Issues

**Build errors**:
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && bun install`
- Check TypeScript errors: `bunx tsc --noEmit`

**Middleware not working**:
- Verify `middleware.ts` is in project root (not `/src`)
- Check matcher configuration
- Restart dev server after changes

## Testing

### E2E Testing with Playwright

The project uses Playwright for end-to-end testing across multiple browsers (Chromium, Firefox, WebKit) and devices (desktop + mobile).

**Test Coverage:**
- `01-authentication.spec.ts` - WorkOS authentication flow
- `02-navigation.spec.ts` - Page navigation and routing
- `03-ai-demo.spec.ts` - Multi-LLM demo (15+ providers)
- `04-client-research.spec.ts` - Client research workflow
- `05-skills-management.spec.ts` - Skills library management
- `06-observability.spec.ts` - Agent metrics and UCE neural network
- `07-globe-visualization.spec.ts` - 3D globe performance testing

**Running Tests:**
```bash
# Run all tests
bun run test

# Interactive UI mode (recommended for development)
bun run test:ui

# Run with visible browser
bun run test:headed

# Generate and view HTML report
bun run test:report
```

**Test Configuration:** See `playwright.config.ts` for browser and device configurations.

**Note:** Some tests require WorkOS authentication and are marked with `.skip()`. These can be enabled once test credentials are configured.

## Additional Documentation

- [README.md](README.md) - Complete setup and authentication guide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Migration from Better Auth to WorkOS
- [MIGRATION_STATUS.md](MIGRATION_STATUS.md) - Current migration status
- [skill-manager/README.md](skill-manager/README.md) - Skill Seeker documentation
- [convex_rules.txt](convex_rules.txt) - Comprehensive Convex development guidelines
- [playwright.config.ts](playwright.config.ts) - Playwright testing configuration
- [tests/e2e/](tests/e2e/) - E2E test suite (7 test files)
