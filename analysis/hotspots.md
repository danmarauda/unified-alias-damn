# ALIAS MOSAIC - Complexity Hotspots Analysis

> **Generated**: 2025-11-27 | **Turn**: 0 - Forensic Analysis

## Critical Hotspots (>700 LOC)

### 1. `/src/app/deploy/page.tsx` - 1007 LOC 🔴 CRITICAL

**Evidence**: `src/app/deploy/page.tsx:1-1007`

**Issues**:
- Monolithic page component
- Mixing UI, state management, and business logic
- Multiple inline styled components
- No separation of concerns

**Recommendation**:
- Extract to `DeployPage`, `DeployPipeline`, `DeployConfig`, `DeployHistory` components
- Move deployment logic to custom hooks
- Target: <200 LOC main page, 5-6 extracted components

---

### 2. `/src/app/agents/designer/page.tsx` - 940 LOC 🔴 CRITICAL

**Evidence**: `src/app/agents/designer/page.tsx:1-940`

**Issues**:
- Agent configuration form spans entire file
- Inline code preview component
- State management mixed with rendering
- Hard-coded data structures

**Recommendation**:
- Extract `AgentConfigForm`, `CodePreview`, `AgentTemplates` components
- Create `useAgentDesigner` hook for state
- Target: <250 LOC main page

---

### 3. `/src/app/projects/[id]/page.tsx` - 893 LOC 🔴 CRITICAL

**Evidence**: `src/app/projects/[id]/page.tsx:1-893`

**Issues**:
- Project details, timeline, team, and settings in single file
- Multiple tab implementations inline
- Form handling mixed with display logic

**Recommendation**:
- Extract tab content to separate components
- Create `ProjectHeader`, `ProjectTimeline`, `ProjectTeam`, `ProjectSettings`
- Target: <200 LOC main page

---

### 4. `/src/app/ontology/page.tsx` - 790 LOC 🟠 HIGH

**Evidence**: `src/app/ontology/page.tsx:1-790`

**Issues**:
- Dual visualizer modes (regular vs collaborative)
- Toolbar and controls inline
- Entity creation forms embedded

**Recommendation**:
- Already has `OntologyVisualizer` extracted (568 LOC)
- Further extract `OntologyToolbar`, `EntityCreator`, `OntologyFilters`
- Target: <300 LOC main page

---

### 5. `/src/app/agents/metrics/page.tsx` - 768 LOC 🟠 HIGH

**Evidence**: `src/app/agents/metrics/page.tsx:1-768`

**Issues**:
- Custom `SimpleLineChart` and `SimplePieChart` inline (124 LOC)
- `StatusBadge` component inline
- Helper functions mixed with component

**Recommendation**:
- Extract chart components to `/components/charts/`
- Extract `StatusBadge` to `/components/ui/`
- Move helpers to `/lib/formatters.ts`
- Target: <400 LOC

---

## High Complexity Components (400-700 LOC)

| File | LOC | Issue | Action |
|:-----|----:|:------|:-------|
| `src/app/run-node/page.tsx` | 571 | Node execution UI monolith | Extract NodeRunner, NodeOutput components |
| `components/ontology/OntologyVisualizer.tsx` | 568 | Graph rendering complexity | Consider react-flow/d3 abstraction |
| `convex/observability.ts` | 533 | Many query variants | Group by use-case, consider views |
| `src/app/knowledge-base/page.tsx` | 480 | KB management monolith | Extract KBList, KBSearch, KBFilters |
| `components/ontology/CollaborationProvider.tsx` | 464 | Real-time state machine | Document state transitions |
| `components/skills/skill-builder.tsx` | 434 | Complex form | Use react-hook-form + zod |

---

## Medium Complexity (300-400 LOC)

| File | LOC | Notes |
|:-----|----:|:------|
| `components/research/ResearchHubClient.tsx` | 373 | Convex integration, could split |
| `convex/schema.ts` | 361 | 16 tables, well-organized |
| `components/skills/skill-analytics.tsx` | 360 | Chart-heavy, OK |
| `components/skills/skills-manager.tsx` | 349 | CRUD operations |
| `components/layout/Header.tsx` | 343 | Desktop + mobile nav |
| `convex/http.ts` | 340 | HTTP endpoints |
| `src/app/client-profiles/[id]/page.tsx` | 339 | Client detail form |

---

## Type Safety Hotspots

### Uses of `v.any()` in Schema

**Evidence**: `convex/schema.ts:89,317,327`

```typescript
// Line 89 - agentMetrics.data
data: v.any(), // Flexible data structure for different metric types

// Line 317 - observabilityEvents.payload
payload: v.any(), // Flexible JSON for event-specific data

// Line 327 - observabilityEvents.metadata
metadata: v.optional(v.any()),
```

**Risk**: Type safety bypassed, runtime errors possible

**Recommendation**:
- Define discriminated union types for metric data
- Create typed payload interfaces per event type
- Replace `any` with `v.union()` of known shapes

---

## Accessibility Debt

**Evidence**: `biome.json:43-61`

15 a11y rules disabled:
- `noAutofocus`, `useAltText`, `useKeyWithClickEvents`, etc.

**Recommendation**: Progressive enablement plan:
1. Enable `useAltText`, `useButtonType` first
2. Add to pages incrementally
3. Target WCAG 2.2 AA compliance

---

## Dependency Coupling Analysis

### High-Coupling Modules

| Module | Imported By | Risk |
|:-------|:------------|:-----|
| `@/components/ui/button` | 25+ files | Low (intended) |
| `@/components/ui/card` | 20+ files | Low (intended) |
| `@/components/layout/MainLayout` | 15+ pages | Medium - single point of failure |
| `@/lib/hooks/use-work-os` | 5 files | Low |
| `convex/_generated/api` | 12+ files | Medium - schema changes ripple |

### Recommended Seams for Extraction

1. **Chart System** - Extract SimpleLineChart, SimplePieChart to shared module
2. **Form System** - Standardize on react-hook-form + zod
3. **Status/Badge System** - Consolidate StatusBadge variants
4. **Date Formatting** - Centralize in `/lib/formatters.ts`

