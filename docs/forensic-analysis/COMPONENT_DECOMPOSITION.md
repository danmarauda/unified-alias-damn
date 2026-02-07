# Component Decomposition Strategy

**Project:** ALIAS Super Admin Console (AEOS)
**Date:** 2025-02-07
**Total Components Analyzed:** 36
**Total Lines of Code:** 7,603
**Status:** Active Development (85% complete)

---

## Executive Summary

The ALIAS Super Admin Console has a moderate component complexity with several components exceeding recommended size limits. This document provides a prioritized refactoring strategy to improve maintainability, testability, and developer experience.

### Key Findings

| Metric | Current | Recommended | Status |
|--------|---------|-------------|--------|
| Components >150 LOC | 8 | 0 | ⚠️ Needs Attention |
| Components with >10 props | 4 | 0 | ⚠️ Needs Attention |
| Components mixing concerns | 6 | 0 | ⚠️ Needs Attention |
| Average component size | 211 LOC | <150 LOC | ⚠️ Above Target |
| Nested components in files | 12 | 0 | ✅ Separate files |

### Priority Breakdown

- **High Priority (Immediate Action):** 4 components
- **Medium Priority (Next Sprint):** 4 components
- **Low Priority (Technical Debt):** 2 components

---

## 1. HIGH PRIORITY COMPONENTS (Immediate Action)

### 1.1 OntologyVisualizer (/src/components/ontology/OntologyVisualizer.tsx)

**Current Metrics:**
- Lines of Code: 569
- Props: 3 (data, height, width)
- Nested Components: 3 (createSimulation, applyForces, drawNodes, drawLinks)
- Responsibilities: 6 (visualization, simulation, canvas rendering, filtering, zoom, UI controls)

**Issues:**
1. **Massive single file** - Contains visualization logic, physics simulation, rendering, and UI
2. **Mixed concerns** - Canvas manipulation mixed with React state
3. **Complex helper functions** - Force simulation and drawing logic should be separate
4. **Hard to test** - Canvas rendering tightly coupled with component

**Suggested Decomposition:**

```
src/components/ontology/
├── OntologyVisualizer.tsx          (150 LOC) - Main orchestration
├── OntologyCanvas.tsx              (120 LOC) - Canvas rendering wrapper
├── OntologyControls.tsx            (80 LOC) - Filter/zoom controls
├── OntologyLegend.tsx              (60 LOC) - Layer legend
└── lib/
    ├── forceSimulation.ts          (100 LOC) - Physics engine
    ├── nodeRenderer.ts             (80 LOC) - Node drawing logic
    └── linkRenderer.ts             (70 LOC) - Link drawing logic
```

**Pattern:** Compound Component + Custom Hooks

**Estimated Effort:** 6-8 hours

**Benefits:**
- Testable simulation logic
- Reusable rendering functions
- Clear separation of concerns
- Easier to add new visualization features

---

### 1.2 CollaborativeOntologyVisualizer (/src/components/ontology/CollaborativeOntologyVisualizer.tsx)

**Current Metrics:**
- Lines of Code: 278
- Props: 4 (projectId, data, height, width)
- Nested Components: 3 (UserCursor, UsersList, CollaborativeVisualizerInner)
- Responsibilities: 5 (collaboration, cursor tracking, user management, base viz, UI)

**Issues:**
1. **Complex collaboration logic** mixed with visualization
2. **Nested components** should be separate files
3. **WebSocket/WebRTC** concerns coupled with UI
4. **CollaborationProvider** creates additional complexity

**Suggested Decomposition:**

```
src/components/ontology/
├── CollaborativeOntologyVisualizer.tsx    (80 LOC) - Main wrapper
├── collaboration/
│   ├── UserCursor.tsx                     (50 LOC) - Individual cursor
│   ├── UsersList.tsx                      (60 LOC) - Users panel
│   ├── CollaborationProvider.tsx         (100 LOC) - WebSocket logic
│   └── useCollaboration.ts                (40 LOC) - Collaboration hook
```

**Pattern:** Provider Pattern + Custom Hooks

**Estimated Effort:** 4-6 hours

**Benefits:**
- Isolated collaboration logic
- Reusable collaboration features
- Easier to test without real-time connections
- Cleaner component tree

---

### 1.3 SkillsManager (/src/components/skills/skills-manager.tsx)

**Current Metrics:**
- Lines of Code: 355
- Props: 0 (container component)
- Nested Components: 0
- Responsibilities: 7 (data fetching, filtering, search, grid display, active jobs, UI state, formatting)

**Issues:**
1. **Monolithic container** - Does too many things
2. **Complex filtering logic** embedded in component
3. **Formatting utilities** should be separate
4. **Active jobs tracking** mixed with main display
5. **Search and filter state** management complex

**Suggested Decomposition:**

```
src/components/skills/
├── SkillsManager.tsx                  (100 LOC) - Container/orchestration
├── SkillsFilterBar.tsx                (120 LOC) - Search & filters
├── SkillsGrid.tsx                     (80 LOC) - Grid layout
├── SkillCard.tsx                      (100 LOC) - Individual skill card
├── ActiveJobsPanel.tsx                (60 LOC) - Active scraping jobs
├── hooks/
│   ├── useSkillsFilters.ts            (50 LOC) - Filter logic
│   └── useSkillsData.ts               (40 LOC) - Data fetching
└── utils/
    ├── skillFormatters.ts             (30 LOC) - Date/size formatting
    └── skillConstants.ts              (40 LOC) - Categories, status colors
```

**Pattern:** Container/Presenter + Custom Hooks

**Estimated Effort:** 5-7 hours

**Benefits:**
- Testable filter logic
- Reusable card component
- Clear data flow
- Easier to add new filters

---

### 1.4 SkillBuilder (/src/components/skills/skill-builder.tsx)

**Current Metrics:**
- Lines of Code: 437
- Props: 1 (skillId)
- Nested Components: 0
- Responsibilities: 8 (config form, scraping logic, progress tracking, log display, presets, recent skills, statistics, UI state)

**Issues:**
1. **Massive complexity** - Multiple unrelated features in one file
2. **Progress simulation** mixed with real scraping logic
3. **Log management** should be separate
4. **Quick actions** (presets, recent skills, stats) clutter main component
5. **Configuration form** too complex

**Suggested Decomposition:**

```
src/components/skills/
├── SkillBuilder.tsx                   (120 LOC) - Main container
├── SkillConfigPanel.tsx               (150 LOC) - Configuration form
├── ScrapingProgressPanel.tsx          (80 LOC) - Progress display
├── ScrapingLogViewer.tsx              (100 LOC) - Log output
├── QuickActionsPanel.tsx              (80 LOC) - Presets & recent skills
├── SkillStatistics.tsx                (60 LOC) - Build metrics
└── hooks/
    └── useScrapingProgress.ts         (70 LOC) - Progress simulation
```

**Pattern:** Compound Component + Custom Hooks

**Estimated Effort:** 7-9 hours

**Benefits:**
- Modular scraping workflow
- Reusable progress components
- Testable configuration logic
- Clear separation of concerns

---

## 2. MEDIUM PRIORITY COMPONENTS (Next Sprint)

### 2.1 SkillAnalytics (/src/components/skills/skill-analytics.tsx)

**Current Metrics:**
- Lines of Code: 427
- Props: 0
- Nested Components: 0
- Responsibilities: 5 (data fetching, metric calculation, chart rendering, activity feed, time range selection)

**Issues:**
1. **Complex data transformations** in component
2. **Chart configuration** mixed with business logic
3. **Multiple visualization types** in one file
4. **Time range filtering** logic embedded

**Suggested Decomposition:**

```
src/components/skills/
├── SkillAnalytics.tsx                 (100 LOC) - Container
├── analytics/
│   ├── MetricsCards.tsx               (80 LOC) - Key metrics grid
│   ├── StatusBreakdown.tsx            (80 LOC) - Status visualization
│   ├── CategoryChart.tsx              (70 LOC) - Doughnut chart
│   ├── TrendChart.tsx                 (70 LOC) - Line chart
│   └── RecentActivity.tsx             (60 LOC) - Activity feed
├── hooks/
│   └── useSkillAnalytics.ts           (80 LOC) - Data fetching & transformation
└── utils/
    └── analyticsFormatters.ts         (50 LOC) - Time/metric formatting
```

**Pattern:** Container/Presenter + Custom Hooks

**Estimated Effort:** 5-6 hours

---

### 2.2 EventTimeline (/src/components/observability/EventTimeline.tsx)

**Current Metrics:**
- Lines of Code: 206
- Props: 7 (orgId, sessionId, sourceApp, eventType, squadron, status, limit)
- Nested Components: 1 (EventCard)
- Responsibilities: 4 (data fetching, auto-scroll, rendering, filtering)

**Issues:**
1. **Too many props** (7) - indicates complex component
2. **EventCard** should be separate file
3. **Auto-scroll logic** mixed with rendering
4. **Color/icon mappings** should be constants

**Suggested Decomposition:**

```
src/components/observability/
├── EventTimeline.tsx                  (80 LOC) - Container
├── EventCard.tsx                      (100 LOC) - Individual event (extracted)
├── hooks/
│   └── useEventStream.ts              (50 LOC) - Real-time event stream
└── constants/
    └── eventConfig.ts                 (60 LOC) - Colors, icons, mappings
```

**Pattern:** Custom Hooks + Constants

**Estimated Effort:** 3-4 hours

---

### 2.3 NeuralNetworkViz (/src/components/observability/NeuralNetworkViz.tsx)

**Current Metrics:**
- Lines of Code: 240
- Props: 2 (orgId, sessionId)
- Nested Components: 1 (StatCard)
- Responsibilities: 4 (data fetching, visualization, color scale, layout)

**Issues:**
1. **NEURON_CATEGORIES** constant should be separate
2. **StatCard** should be in shared components
3. **Color scale logic** embedded in component
4. **Hardcoded categorization** structure

**Suggested Decomposition:**

```
src/components/observability/
├── NeuralNetworkViz.tsx               (100 LOC) - Main container
├── NeuralGrid.tsx                     (80 LOC) - Neuron grid display
├── shared/
│   └── StatCard.tsx                   (40 LOC) - Move to shared UI
└── constants/
    └── neuralNetwork.ts               (80 LOC) - Neuron categories & config
```

**Pattern:** Container + Constants

**Estimated Effort:** 2-3 hours

---

### 2.4 CostTracker (/src/components/observability/CostTracker.tsx)

**Current Metrics:**
- Lines of Code: 188
- Props: Unknown (estimated 3-5)
- Responsibilities: Multiple (cost display, filtering, aggregation)

**Issues:**
1. **Moderate complexity** - needs review for decomposition
2. **Likely mixing concerns** based on size

**Suggested Action:**
- Review after refactoring higher-priority components
- Consider extracting cost calculation logic
- Separate filtering logic from display

**Estimated Effort:** 3-4 hours (pending detailed analysis)

---

## 3. LOW PRIORITY COMPONENTS (Technical Debt)

### 3.1 Header (/src/components/layout/Header.tsx)

**Current Metrics:**
- Lines of Code: 334
- Props: 0
- Nested Components: 0 (inline user menu)
- Responsibilities: 6 (navigation, user menu, mobile menu, authentication, theme toggle, logo)

**Issues:**
1. **Large file** but acceptable for a main layout component
2. **User menu** should be separate component
3. **Navigation items** could be data-driven
4. **Mobile/desktop duplication** - menu items repeated

**Suggested Decomposition:**

```
src/components/layout/
├── Header.tsx                         (120 LOC) - Main container
├── UserMenu.tsx                       (80 LOC) - User dropdown menu
├── Navigation.tsx                     (60 LOC) - Main navigation
├── MobileMenu.tsx                     (80 LOC) - Mobile navigation drawer
└── constants/
    └── navigationItems.ts             (40 LOC) - Nav item config
```

**Pattern:** Data-Driven Navigation

**Estimated Effort:** 3-4 hours

**Benefits:**
- Easier to add/remove nav items
- Testable menu components
- Reduced duplication

---

### 3.2 Globe (/src/components/ui/globe/Globe.tsx)

**Current Metrics:**
- Lines of Code: 163
- Props: 1 (points)
- Nested Components: 2 (ActivityPoint, Earth)
- Responsibilities: 4 (3D rendering, animation, interaction, coordinate conversion)

**Issues:**
1. **Nested components** should be separate files
2. **Three.js logic** could be extracted to custom hook
3. **Coordinate conversion** utility should be separate

**Suggested Decomposition:**

```
src/components/ui/globe/
├── Globe.tsx                          (60 LOC) - Main container
├── GlobeEarth.tsx                     (50 LOC) - Earth sphere
├── GlobeActivityPoint.tsx             (50 LOC) - Individual point
└── utils/
    └── coordinateConversion.ts        (40 LOC) - Lat/lng to 3D conversion
```

**Pattern:** Compound Component

**Estimated Effort:** 2-3 hours

---

## 4. PATTERNS & GUIDELINES

### 4.1 Component Size Guidelines

**Recommended Limits:**
- **Target:** <150 LOC per component
- **Acceptable:** 150-200 LOC (with justification)
- **Review Required:** >200 LOC
- **Immediate Action:** >300 LOC

**Rationale:**
- Smaller components are easier to understand
- Easier to test in isolation
- More reusable across the application
- Better code navigation

---

### 4.2 Props Management Patterns

**Current Issues:**
- Components with >10 props indicate high complexity
- Props drilling in some areas (e.g., OntologyVisualizer)

**Recommended Patterns:**

1. **Composition Over Props:**
```typescript
// Instead of:
<ComplexComponent
  onConfigChange={...}
  onFilterChange={...}
  onSortChange={...}
  onSearchChange={...}
  ...
/>

// Use:
<ComplexComponent>
  <ComplexComponent.Config onChange={...} />
  <ComplexComponent.Filters onChange={...} />
  <ComplexComponent.Sort onChange={...} />
  <ComplexComponent.Search onChange={...} />
</ComplexComponent>
```

2. **Configuration Objects:**
```typescript
// Instead of:
<Component
  width={800}
  height={600}
  backgroundColor="blue"
  fontSize={14}
  ...
/>

// Use:
<Component
  layout={{ width: 800, height: 600 }}
  style={{ backgroundColor: 'blue', fontSize: 14 }}
/>
```

3. **Custom Hooks for Complex State:**
```typescript
// Instead of passing many state handlers:
<Component
  value={value}
  onChange={onChange}
  error={error}
  loading={loading}
  disabled={disabled}
/>

// Use hook:
const { inputProps, meta } = useFormField(config);
<Component {...inputProps} {...meta} />
```

---

### 4.3 Composition Patterns

**1. Compound Components:**

Use for components with multiple related parts:

```typescript
<OntologyVisualizer>
  <OntologyVisualizer.Canvas />
  <OntologyVisualizer.Controls />
  <OntologyVisualizer.Legend />
</OntologyVisualizer>
```

**2. Container/Presenter:**

Separate data fetching from rendering:

```typescript
// Container: SkillsManagerContainer.tsx
export function SkillsManagerContainer() {
  const skills = useSkillsData();
  const filters = useSkillsFilters();

  return <SkillsManager skills={skills} filters={filters} />;
}

// Presenter: SkillsManager.tsx
export function SkillsManager({ skills, filters }: Props) {
  // Pure rendering logic
}
```

**3. Render Props:**

For flexible rendering with shared logic:

```typescript
<DataSource>
  {({ data, loading, error }) => (
    <CustomVisualization data={data} loading={loading} error={error} />
  )}
</DataSource>
```

**4. Custom Hooks:**

Extract reusable logic:

```typescript
// hooks/useNeuralNetwork.ts
export function useNeuralNetwork(orgId?: string, sessionId?: string) {
  const neuralState = useQuery(api.observability.getNeuralNetworkState, {
    orgId,
    sessionId,
    limit: 200,
  });

  const activationMap = useMemo(() => {
    // Complex transformation logic
  }, [neuralState]);

  return { neuralState, activationMap };
}
```

---

### 4.4 Shared Logic Patterns

**1. Utility Functions:**

Place in `/lib/utils/` or component-specific `utils/`:

```typescript
// lib/utils/formatters.ts
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / 1024 ** i) * 100) / 100 + " " + sizes[i];
}
```

**2. Constants:**

Place in component-specific `constants/` files:

```typescript
// components/skills/constants/skillConfig.ts
export const SKILL_CATEGORIES = [
  { value: "frontend", label: "Frontend", color: "bg-blue-500" },
  { value: "backend", label: "Backend", color: "bg-green-500" },
  ...
] as const;

export const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  scraping: "bg-yellow-100 text-yellow-800",
  ...
} as const;
```

**3. Type Definitions:**

Centralize shared types:

```typescript
// types/skills.ts
export interface Skill {
  _id: string;
  name: string;
  description: string;
  status: SkillStatus;
  category: SkillCategory;
  ...
}

export type SkillStatus = "draft" | "scraping" | "processing" | "ready" | "error";
```

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1: Quick Wins (Week 1)

**Target:** High-impact, low-effort decompositions

1. **Extract nested components** (2-3 hours)
   - Move `EventCard` to separate file
   - Move `StatCard` to shared components
   - Move `GlobeActivityPoint` and `GlobeEarth` to separate files

2. **Extract constants** (1-2 hours)
   - `NEURON_CATEGORIES` → `constants/neuralNetwork.ts`
   - `SKILL_CATEGORIES` → `constants/skillConfig.ts`
   - Event color/icon mappings → `constants/eventConfig.ts`

3. **Create shared utilities** (2-3 hours)
   - `lib/utils/formatters.ts` (date, file size, time)
   - `lib/utils/validation.ts` (if needed)

**Expected Outcomes:**
- 3 components reduced by 20-30%
- Improved code organization
- No functional changes

---

### Phase 2: Medium Complexity (Week 2-3)

**Target:** Skills-related components

1. **Refactor SkillsManager** (5-7 hours)
   - Extract filter logic to `useSkillsFilters` hook
   - Create `SkillsFilterBar` component
   - Create `SkillCard` component
   - Create `ActiveJobsPanel` component

2. **Refactor SkillBuilder** (7-9 hours)
   - Extract configuration form
   - Create progress panel component
   - Create log viewer component
   - Extract quick actions to separate components

3. **Refactor SkillAnalytics** (5-6 hours)
   - Extract chart components
   - Create `useSkillAnalytics` hook
   - Separate metric calculations

**Expected Outcomes:**
- 3 major components refactored
- Improved testability
- Clear separation of concerns

---

### Phase 3: High Complexity (Week 4-5)

**Target:** Visualization components

1. **Refactor OntologyVisualizer** (6-8 hours)
   - Extract force simulation logic
   - Create separate rendering utilities
   - Extract controls and legend
   - Create canvas wrapper component

2. **Refactor CollaborativeOntologyVisualizer** (4-6 hours)
   - Extract collaboration provider
   - Separate user management
   - Create cursor component
   - Create users list component

**Expected Outcomes:**
- Most complex components simplified
- Reusable visualization utilities
- Testable collaboration logic

---

### Phase 4: Technical Debt (Week 6)

**Target:** Remaining components

1. **Refactor Header** (3-4 hours)
   - Extract user menu
   - Data-driven navigation
   - Separate mobile menu

2. **Review and refactor remaining components** (as needed)
   - Address any components >200 LOC
   - Extract shared patterns

**Expected Outcomes:**
- All components within size guidelines
- Consistent patterns across codebase
- Reduced technical debt

---

## 6. TESTING STRATEGY

### Benefits of Decomposition

**Before:** Hard to test
```typescript
// OntologyVisualizer - 569 LOC
// Canvas rendering, physics, React state all mixed
// Nearly impossible to test in isolation
```

**After:** Testable units
```typescript
// forceSimulation.test.ts
describe('Force Simulation', () => {
  it('should apply repulsive forces between nodes', () => {
    const nodes = createTestNodes();
    const links = [];
    applyForces(nodes, links, 800, 600);

    expect(nodes[0].x).not.toBe(nodes[1].x);
  });
});

// OntologyCanvas.test.tsx
describe('OntologyCanvas', () => {
  it('should render nodes correctly', () => {
    const { container } = render(<OntologyCanvas nodes={mockNodes} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
```

---

## 7. METRICS & SUCCESS CRITERIA

### Target Metrics

| Metric | Current | Target | Success Criteria |
|--------|---------|--------|------------------|
| Components >150 LOC | 8 | 0 | ✅ All components <150 LOC |
| Components >200 LOC | 3 | 0 | ✅ All components <200 LOC |
| Avg component size | 211 LOC | <100 LOC | ✅ 50% reduction |
| Nested components in files | 12 | 0 | ✅ All components separate |
| Components with >10 props | 4 | 0 | ✅ All components <10 props |
| Test coverage | ~20% | >60% | ✅ Testable components |

### Quality Gates

Before marking refactoring complete:

1. ✅ All components follow size guidelines
2. ✅ All tests pass (no regressions)
3. ✅ New tests added for refactored components
4. ✅ TypeScript strict mode passes
5. ✅ Biome linting passes
6. ✅ Manual smoke test completed

---

## 8. RISK MITIGATION

### Potential Risks

1. **Breaking Changes**
   - **Risk:** Refactoring may break existing functionality
   - **Mitigation:** Comprehensive test coverage before refactoring, incremental changes

2. **Performance Regression**
   - **Risk:** More components may impact render performance
   - **Mitigation:** Profile before/after, use React.memo where appropriate

3. **Development Slowdown**
   - **Risk:** Learning new patterns may slow development
   - **Mitigation:** Pair programming, documentation, gradual adoption

4. **Over-Engineering**
   - **Risk:** Extracting too much may create unnecessary complexity
   - **Mitigation:** Follow YAGNI principle, refactor only when needed

---

## 9. DEVELOPER GUIDELINES

### When to Create a New Component

**Create a new component when:**

1. **Complexity:** Component exceeds 150 LOC
2. **Reusability:** UI pattern used 2+ times
3. **Testing:** Logic needs unit testing
4. **Single Responsibility:** Component has multiple unrelated concerns
5. **Props:** Component has >10 props

### When to Use Custom Hooks

**Create a custom hook when:**

1. **State Logic:** Complex state management needed
2. **Data Fetching:** API calls with caching/polling
3. **Side Effects:** WebSocket connections, intervals
4. **Reusable Logic:** Same logic used in multiple components

### Component Structure Template

```typescript
"use client";

// 1. Imports (grouped and sorted)
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Constants
const DEFAULT_VALUE = "...";

// 4. Helper functions
function helperFunction() {
  // ...
}

// 5. Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // 6. Hooks (top of component)
  const [state, setState] = useState();

  // 7. Event handlers
  const handleClick = () => {
    // ...
  };

  // 8. Effects
  useEffect(() => {
    // ...
  }, []);

  // 9. Render
  return (
    <div>...</div>
  );
}
```

---

## 10. CONCLUSION

The ALIAS Super Admin Console would benefit significantly from systematic component decomposition. The proposed strategy:

- **Reduces average component size** by 50% (211 → <100 LOC)
- **Improves testability** through smaller, focused units
- **Enables better code reuse** through shared components and hooks
- **Maintains functionality** through incremental refactoring
- **Provides clear patterns** for future development

### Next Steps

1. ✅ Review and approve this strategy
2. ✅ Create GitHub issues for each phase
3. ✅ Set up test coverage baseline
4. ✅ Begin Phase 1 (Quick Wins)
5. ✅ Measure and track progress

---

**Document Version:** 1.0
**Last Updated:** 2025-02-07
**Authors:** Claude Code (Forensic Analysis)
**Status:** Ready for Implementation
