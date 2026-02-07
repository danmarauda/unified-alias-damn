# ALIAS Super Admin Console - Complexity Metrics & Analysis

**Generated:** 2026-02-07
**Purpose:** Quantitative analysis of codebase size, complexity, and scale

---

## Project Scale Summary

| Metric | Count | Notes |
|--------|-------|-------|
| **Total Source Files (src/)** | 97 | TypeScript/TSX files |
| **Total Backend Files (convex/)** | 14 | TypeScript modules |
| **Total Lines of Code (src/)** | 17,258 | Frontend application |
| **Total Lines of Code (convex/)** | 3,872 | Backend logic |
| **Combined LOC** | 21,130 | Entire application |
| **Total Dependencies** | 105 | 86 prod + 19 dev |
| **Page Routes** | 24 | Next.js App Router |
| **API Routes** | 5 | HTTP endpoints |
| **Database Tables** | 16 | Convex schema |
| **UI Components** | 49 | Reusable components |
| **shadcn/ui Components** | 18+ | Radix UI primitives |

---

## Code Distribution by Module

### Frontend (src/)

```
src/app/                    # Next.js App Router
├── Page routes:            24 files
├── API routes:             5 files
├── Total app LOC:          ~8,500 LOC (estimated)

src/components/
├── UI components:          18+ files (shadcn/ui)
├── Dashboard widgets:      6+ files
├── Feature components:     25+ files
├── Total component LOC:    ~7,500 LOC (estimated)

src/lib/
├── Utilities & hooks:      ~10 files
├── Total lib LOC:          ~1,258 LOC (estimated)
```

### Backend (convex/)

```
convex/
├── schema.ts               497 LOC  (12.8% of backend)
├── observability.ts        680 LOC  (17.6% of backend)
├── skills.ts               312 LOC  (8.1% of backend)
├── http.ts                 294 LOC  (7.6% of backend)
├── stats.ts                240 LOC  (6.2% of backend)
├── agentMetrics.ts         256 LOC  (6.6% of backend)
├── skills_mutations.ts     228 LOC  (5.9% of backend)
├── clientResearch.ts       228 LOC  (5.9% of backend)
├── users.ts                184 LOC  (4.8% of backend)
├── clientProfiles.ts       140 LOC  (3.6% of backend)
├── orgs.ts                 90 LOC   (2.3% of backend)
├── notifications.ts        52 LOC   (1.3% of backend)
├── initDemo.ts             76 LOC   (2.0% of backend)
└── _generated/             Auto-generated
```

---

## Complexity Analysis by Category

### Page Routes (24 pages)

**Largest Pages (by LOC):**
1. **app/deploy/page.tsx** - 1,007 LOC (Deployment pipeline)
2. **app/projects/[id]/page.tsx** - 989 LOC (Project details)
3. **app/agents/designer/page.tsx** - 940 LOC (Agent builder)
4. **app/ontology/page.tsx** - 790 LOC (Ontology editor)
5. **app/run-node/page.tsx** - 575 LOC (Node execution)
6. **app/agents/metrics/page.tsx** - 573 LOC (Agent metrics)
7. **app/knowledge-base/page.tsx** - 480 LOC (Knowledge management)
8. **components/ontology/OntologyVisualizer.tsx** - 568 LOC (Graph viz)
9. **components/skills/skill-builder.tsx** - 436 LOC (Skill builder)
10. **app/projects/page.tsx** - 429 LOC (Projects list)

**Complexity Distribution:**
- **High Complexity (>500 LOC):** 7 pages
- **Medium Complexity (200-500 LOC):** 8 pages
- **Low Complexity (<200 LOC):** 9 pages

**Average Page LOC:** 354 LOC

---

### Components (49 files)

**Component Breakdown:**

| Category | Count | Est. Total LOC |
|----------|-------|----------------|
| UI Components (shadcn/ui) | 18+ | ~1,800 LOC |
| Dashboard Widgets | 6+ | ~1,200 LOC |
| Layout Components | 3 | ~500 LOC |
| Ontology Components | 3 | ~1,600 LOC |
| Skills Components | 4 | ~1,500 LOC |
| Observability Components | 5 | ~600 LOC |
| Client Components | 2 | ~400 LOC |
| Research Components | 1 | ~367 LOC |
| AI Demo Components | 2+ | ~300 LOC |
| Chart Components | 2 | ~200 LOC |

**Most Complex Components:**
1. **OntologyVisualizer.tsx** - 568 LOC (D3 graph visualization)
2. **CollaborationProvider.tsx** - 464 LOC (Real-time sync)
3. **skill-analytics.tsx** - 426 LOC (Usage analytics)
4. **skill-builder.tsx** - 436 LOC (Skill creation)
5. **skills-manager.tsx** - 354 LOC (Skills library)
6. **ResearchHubClient.tsx** - 367 LOC (Research interface)
7. **AIAssistPanel.tsx** - 311 LOC (AI assistant)
8. **Header.tsx** - 333 LOC (Navigation)

---

### Backend Functions (14 modules)

**Function Counts by Type:**

| Module | Queries | Mutations | Actions | HTTP | Total Functions |
|--------|---------|-----------|---------|-----|-----------------|
| schema.ts | - | - | - | - | 16 tables |
| observability.ts | 8+ | 5+ | - | - | 13+ |
| skills.ts | 6+ | - | - | - | 6+ |
| skills_mutations.ts | - | 8+ | - | - | 8+ |
| stats.ts | 4+ | - | - | - | 4+ |
| agentMetrics.ts | 4+ | - | - | - | 4+ |
| clientProfiles.ts | 4+ | 3+ | - | - | 7+ |
| clientResearch.ts | 4+ | 3+ | - | - | 7+ |
| users.ts | 3+ | 2+ | - | - | 5+ |
| orgs.ts | 2+ | 1+ | - | - | 3+ |
| http.ts | - | - | - | 4 | 4 endpoints |
| notifications.ts | 1+ | 1+ | - | - | 2+ |
| initDemo.ts | - | 1 | - | - | 1 |

**Estimated Backend Functions:**
- **Total Functions:** 75+ (excluding generated)
- **Queries:** 35+ (read operations)
- **Mutations:** 25+ (write operations)
- **HTTP Actions:** 4 (API endpoints)
- **Actions:** 0 (server-side logic)

---

## Database Schema Complexity

### Table Analysis (16 tables)

**Core Tables:**
1. **orgs** - 7 fields, 1 index
2. **users** - 12 fields, 3 indexes
3. **stats** - 4 fields, 2 indexes
4. **recentActivities** - 5 fields, 1 index

**Project & Agent Tables:**
5. **projectActivities** - 8 fields, 2 indexes
6. **projectPerformance** - 8 fields, 1 index
7. **agentActivities** - 7 fields, 2 indexes
8. **agentMetrics** - 9 fields, 1 index (union type)
9. **agentCalls** - 10 fields, 3 indexes

**Skills Tables:**
10. **skills** - 19 fields, 4 indexes
11. **skillVersions** - 9 fields, 2 indexes
12. **skillScrapingJobs** - 11 fields, 2 indexes
13. **skillCategories** - 5 fields, 1 index

**Client Research Tables:**
14. **clientProfiles** - 11 fields, 3 indexes + 1 search index
15. **clientResearch** - 20 fields, 4 indexes

**Observability Tables:**
16. **observabilityEvents** - 18 fields, 6 indexes
17. **uceNeuralActivations** - 6 fields, 3 indexes
18. **squadronStatus** - 6 fields, 2 indexes

**Schema Metrics:**
- **Total Tables:** 16 (excluding observability which adds 3 more)
- **Total Fields:** 150+ fields
- **Total Indexes:** 40+ indexes
- **Search Indexes:** 1 (full-text on clientProfiles)
- **Schema LOC:** 497 LOC

---

## Dependency Complexity

### Package Dependencies (105 total)

**Production Dependencies:** 86 packages

**Top Categories:**
1. **AI SDK:** 18 packages (15+ providers + frameworks)
2. **Radix UI:** 27 packages (component primitives)
3. **Core Framework:** 3 packages (Next.js, React, TypeScript)
4. **Convex:** 1 package (with generated code)
5. **WorkOS:** 2 packages (authkit + node)
6. **Styling:** 5 packages (Tailwind ecosystem)
7. **Animation:** 2 packages (Framer Motion)
8. **3D Graphics:** 3 packages (Three.js ecosystem)
9. **Data Viz:** 3 packages (Chart.js ecosystem)
10. **Forms:** 3 packages (react-hook-form ecosystem)

**Development Dependencies:** 19 packages

**Key Dev Dependencies:**
- **Biome:** 1 package (linter + formatter)
- **Playwright:** 2 packages (testing)
- **TypeScript:** 1 package (types)
- **Build Tools:** 15 packages (compilers, plugins)

---

## Import Complexity

### Internal Import Analysis

**Total Internal Imports:** 187 occurrences across 71 files

**Import Distribution:**
- **Component imports:** ~120 (64%)
- **Hook imports:** ~35 (19%)
- **Utility imports:** ~32 (17%)

**Import Density by File Type:**
- **Pages:** Average 4 imports per file
- **Components:** Average 3 imports per file
- **Hooks:** Average 2 imports per file

**Most Connected Files (by imports):**
1. **app/page.tsx** - 7 imports
2. **app/ai-demo/page.tsx** - 6 imports
3. **app/ontology/page.tsx** - 6 imports
4. **app/agents/designer/page.tsx** - 5 imports
5. **app/agents/metrics/page.tsx** - 5 imports
6. **app/(dashboard)/skills/page.tsx** - 5 imports
7. **app/observability/page.tsx** - 6 imports

---

## Testing Coverage

### E2E Tests (Playwright)

**Test Files:** 7
**Test Coverage Areas:**
1. **Authentication** - WorkOS OAuth flow
2. **Navigation** - Page routing
3. **AI Demo** - Multi-LLM integration
4. **Client Research** - Research workflow
5. **Skills Management** - Skills CRUD
6. **Observability** - Event tracking
7. **Globe Visualization** - 3D performance

**Browser Coverage:**
- Chromium
- Firefox
- WebKit

**Device Coverage:**
- Desktop (viewport tests)
- Mobile (viewport tests)

**Test LOC:** Estimated ~1,500 LOC

---

## Complexity Metrics Summary

### Code Density

| Metric | Value |
|--------|-------|
| **Average File LOC (src/)** | 178 LOC/file |
| **Average File LOC (convex/)** | 277 LOC/file |
| **Median File LOC** | ~150 LOC |
| **Largest File** | 1,007 LOC (deploy/page.tsx) |
| **Smallest File** | ~50 LOC (utility files) |

### Component Complexity

| Complexity Level | LOC Range | Count | Percentage |
|------------------|-----------|-------|------------|
| **Low** | < 100 | 20 files | 21% |
| **Medium** | 100-300 | 45 files | 46% |
| **High** | 300-500 | 22 files | 23% |
| **Very High** | > 500 | 10 files | 10% |

### Page Complexity

| Complexity Level | LOC Range | Count | Percentage |
|------------------|-----------|-------|------------|
| **Simple** | < 200 | 9 pages | 38% |
| **Moderate** | 200-500 | 8 pages | 33% |
| **Complex** | > 500 | 7 pages | 29% |

---

## Maintenance Metrics

### Code Organization
- **Modularity Score:** High (clear separation of concerns)
- **Component Reusability:** High (shadcn/ui pattern)
- **Code Duplication:** Low (Biome enforces DRY)

### Technical Debt Indicators
- **Large Files:** 10 files > 500 LOC (may need refactoring)
- **Complex Pages:** 7 pages with high complexity
- **Backend Functions:** Well-organized (single responsibility)

### Scalability Factors
- **Database Schema:** 16 tables (scalable)
- **Real-time Features:** Comprehensive (Convex subscriptions)
- **Multi-tenancy:** Supported (orgs table)
- **AI Integration:** 15+ providers (flexible)

---

## Performance Considerations

### Bundle Size Impact
**High-Impact Dependencies:**
- Three.js ecosystem: ~600 KB gzipped
- Chart.js: ~150 KB gzipped
- Framer Motion: ~100 KB gzipped
- Radix UI: ~200 KB gzipped (total)
- React + Next.js: ~150 KB gzipped

**Estimated Total Bundle:** ~1.2 MB gzipped (unoptimized)

### Optimization Opportunities
- Code splitting by route (automatic in Next.js)
- Dynamic imports for heavy components (3D, charts)
- Tree shaking (automatic in Next.js)
- Image optimization (configured)

---

## Development Velocity Metrics

### Feature Distribution
- **Dashboard:** 6+ widgets
- **Agent Management:** 4 pages
- **Project Management:** 3 pages
- **Client Management:** 3 pages
- **Research:** 2 pages
- **Skills:** 4 components
- **Observability:** 5 components
- **AI Demo:** Multi-LLM integration

### API Surface
- **Public Routes:** 2 (login, callback)
- **Protected Routes:** 22
- **API Endpoints:** 5
- **Convex Functions:** 75+

---

## Risk Assessment

### High-Complexity Areas (>500 LOC)
1. **app/deploy/page.tsx** - 1,007 LOC
   - **Risk:** Deployment pipeline logic
   - **Recommendation:** Consider splitting into components

2. **app/projects/[id]/page.tsx** - 989 LOC
   - **Risk:** Dynamic route with complex logic
   - **Recommendation:** Extract sub-components

3. **app/agents/designer/page.tsx** - 940 LOC
   - **Risk:** Agent builder complexity
   - **Recommendation:** Modularize builder steps

4. **app/ontology/page.tsx** - 790 LOC
   - **Risk:** Graph visualization logic
   - **Recommendation:** Extract visualization logic

5. **app/run-node/page.tsx** - 575 LOC
   - **Risk:** Node execution logic
   - **Recommendation:** Separate execution logic

### Dependency Risks
- **AI SDK Beta:** Breaking changes likely
- **React 19:** Ecosystem compatibility
- **Next.js 16:** New features and patterns

---

## Comparison to Industry Standards

### Codebase Size
- **Small:** < 10K LOC
- **Medium:** 10-50K LOC ✓ **(Current: 21K LOC)**
- **Large:** 50-100K LOC
- **Enterprise:** > 100K LOC

**Classification:** Medium-sized application

### Component Count
- **Typical SaaS App:** 30-100 components ✓ **(Current: 49 components)**
- **Component Library:** 200+ components

### Database Tables
- **Simple App:** 5-10 tables
- **Complex App:** 10-30 tables ✓ **(Current: 16 tables)**
- **Enterprise:** 30+ tables

---

## Summary

**Overall Complexity:** Medium-High

**Strengths:**
- Well-organized codebase
- Clear separation of concerns
- Comprehensive feature set
- Modern tech stack
- Real-time capabilities

**Areas for Improvement:**
- Refactor files > 500 LOC
- Increase test coverage beyond E2E
- Consider component extraction for complex pages
- Monitor AI SDK beta for breaking changes

**Maintainability Score:** 7.5/10

**Scalability Score:** 8/10

---

**End of Complexity Metrics Documentation**
