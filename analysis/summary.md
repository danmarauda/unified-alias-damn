# ALIAS MOSAIC - Codebase Analysis Summary

> **Generated**: 2025-11-27 | **Turn**: 0 - Intake & Global Context Map Bootstrap

## Auto-Detected Variables

| Variable | Detected Value | Source |
|:---------|:---------------|:-------|
| `[STACK_TARGET]` | TypeScript, Bun 1.0+, Next.js 16.0.3, React 19, Convex 1.29, WorkOS AuthKit | package.json, bun.lock |
| `[PACKAGE_MANAGER]` | Bun (primary), pnpm (secondary lockfile exists) | bun.lock, pnpm-lock.yaml |
| `[UX_AXIS]` | UX-first | Next.js App Router detected |
| `[MODE]` | Transform | Large pages, legacy patterns detected |
| `[AI_STACK]` | AI SDK v6 (15 providers), OpenAI, Anthropic, Google, Cerebras, Groq, +10 | @ai-sdk/* dependencies |
| `[NODE_VERSION]` | Not specified | No .nvmrc found |

## Codebase Statistics

| Metric | Value |
|:-------|:------|
| Total TypeScript/TSX Files | 101 |
| Total Lines of Code | 19,118 |
| App Router Pages | 27 |
| Components | 40+ |
| Convex Tables | 16 |
| Convex Functions | 54+ |
| AI Providers | 15 |
| Playwright Test Files | 7 |

## Module Breakdown

### `/src/app` (27 pages)

| Route | Purpose | LOC | Complexity |
|:------|:--------|----:|:-----------|
| `/` | Dashboard home | 34 | Low |
| `/dashboard` | Secondary dashboard | ~150 | Medium |
| `/agents/metrics` | Agent performance | 768 | **HIGH** |
| `/agents/designer` | Agent builder | 940 | **HIGH** |
| `/agents/library` | Agent catalog | 255 | Medium |
| `/agents/management` | Agent admin | ~200 | Medium |
| `/projects/[id]` | Project details | 893 | **HIGH** |
| `/projects/activities` | Globe viz | ~100 | Medium |
| `/ontology` | Ontology editor | 790 | **HIGH** |
| `/deploy` | Deployment pipeline | 1007 | **CRITICAL** |
| `/knowledge-base` | KB management | 480 | Medium |
| `/client-profiles` | Client list | ~100 | Low |
| `/client-profiles/[id]` | Client details | 339 | Medium |
| `/research-hub` | Research list | ~50 | Low |
| `/skills` | Skills management | ~100 | Low |
| `/ai-demo` | Multi-LLM demo | 234 | Medium |
| `/observability` | Agent observability | ~200 | Medium |
| `/profile` | User profile | 272 | Medium |
| `/run-node` | Node execution | 571 | **HIGH** |

### `/src/components` (40+ components)

| Component | LOC | Ownership | Notes |
|:----------|----:|:----------|:------|
| `layout/Header.tsx` | 343 | Frontend | Complex, desktop+mobile menus |
| `ontology/OntologyVisualizer.tsx` | 568 | Frontend | Graph rendering |
| `ontology/CollaborationProvider.tsx` | 464 | Frontend | Real-time collab |
| `skills/skill-builder.tsx` | 434 | Frontend | Form-heavy |
| `skills/skill-analytics.tsx` | 360 | Frontend | Charts |
| `skills/skills-manager.tsx` | 349 | Frontend | CRUD operations |
| `research/ResearchHubClient.tsx` | 373 | Frontend | Convex integration |
| `observability/NeuralNetworkViz.tsx` | 231 | Frontend | Canvas visualization |
| `ui/globe/Globe.tsx` | ~200 | Frontend | Three.js integration |
| `dashboard/*` | ~800 total | Frontend | 6 dashboard widgets |

### `/convex` (Backend)

| File | LOC | Functions | Tables Touched |
|:-----|----:|:----------|:---------------|
| `schema.ts` | 361 | - | Defines 16 tables |
| `observability.ts` | 533 | 12 | observabilityEvents, uceNeuralActivations, squadronStatus |
| `http.ts` | 340 | 5 | Via observability mutations |
| `stats.ts` | 275 | 8 | stats, projectActivities, recentActivities |
| `agentMetrics.ts` | 273 | 6 | agentMetrics, agentCalls |
| `clientResearch.ts` | 261 | 9 | clientResearch, clientProfiles |
| `skills_mutations.ts` | 257 | 7 | skills, skillVersions, skillScrapingJobs |
| `users.ts` | 174 | 5 | users |
| `clientProfiles.ts` | ~150 | 5 | clientProfiles |

## Ownership Map (Inferred)

| Domain | Owner (Inferred) | Files | Priority |
|:-------|:-----------------|:------|:---------|
| Authentication | Platform Team | middleware.ts, lib/workos*.ts, convex/users.ts | P0 |
| Dashboard/UI | Frontend Team | /components/dashboard/*, /components/ui/* | P1 |
| Agent System | AI Engineering | /agents/*, convex/agentMetrics.ts, /observability/* | P0 |
| Ontology | Frontend + Backend | /ontology/*, /components/ontology/* | P1 |
| Skills | Full Stack | /skills/*, convex/skills*.ts, skill-manager/ | P1 |
| Client Research | Full Stack | /client-profiles/*, /research-hub/*, convex/clientResearch.ts | P2 |
| Deployment | DevOps + Frontend | /deploy/* | P2 |

## Key Findings Summary

1. **5 CRITICAL complexity hotspots** (>700 LOC per file)
2. **No circular dependencies** detected in import graph
3. **1 TODO marker** found (use-auth.ts line 1)
4. **Relaxed a11y rules** in Biome config (15 rules disabled)
5. **No automated unit tests** (only Playwright e2e scaffolded)
6. **Type safety good** - strict mode enabled, but `v.any()` used in schema
7. **WorkOS migration complete** - clean auth implementation

