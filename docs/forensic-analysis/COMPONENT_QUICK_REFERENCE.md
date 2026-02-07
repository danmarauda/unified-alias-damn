# Component Analysis Quick Reference

**Generated:** 2025-02-07
**Project:** ALIAS Super Admin Console (AEOS)

## Component Inventory by Size

| Component | LOC | Status | Priority | Complexity |
|-----------|-----|--------|----------|------------|
| **OntologyVisualizer** | 569 | 🔴 Critical | P0 | Very High |
| **CollaborativeOntologyVisualizer** | 278 | 🔴 High | P0 | High |
| **SkillsManager** | 355 | 🔴 High | P0 | High |
| **SkillBuilder** | 437 | 🔴 High | P0 | High |
| **SkillAnalytics** | 427 | 🟡 Medium | P1 | High |
| **EventTimeline** | 206 | 🟡 Medium | P1 | Medium |
| **NeuralNetworkViz** | 240 | 🟡 Medium | P1 | Medium |
| **CostTracker** | 188 | 🟡 Medium | P1 | Medium |
| **Header** | 334 | 🟢 Low | P2 | Medium |
| **Globe** | 163 | 🟢 Low | P2 | Medium |
| **SquadronPanel** | 140 | ✅ OK | P3 | Low |
| **FilterPanel** | 171 | ⚠️ Review | P3 | Medium |
| **Leaderboard** | 157 | ⚠️ Review | P3 | Medium |
| **ProjectsSummary** | 108 | ✅ OK | P3 | Low |
| **LiveFeed** | 116 | ✅ OK | P3 | Low |
| **AgentActivities** | 98 | ✅ OK | - | Low |
| **AIAssistPanel** | 312 | 🟡 Medium | P1 | High |
| **chat-demo** | 164 | ⚠️ Review | P3 | Medium |
| **ClientProfilesClient** | 141 | ✅ OK | - | Low |
| **NetworkOverview** | 102 | ✅ OK | - | Low |
| **MainLayout** | 18 | ✅ OK | - | Very Low |
| **Footer** | ~30 | ✅ OK | - | Very Low |

## Status Legend

- 🔴 **Critical** - Immediate refactoring required (>300 LOC or severe complexity)
- 🟡 **Medium** - Should refactor in next sprint (200-300 LOC or complexity issues)
- 🟢 **Low** - Technical debt, refactor when possible
- ⚠️ **Review** - Needs closer inspection
- ✅ **OK** - Within acceptable limits

## Priority Levels

**P0 - Immediate Action (This Sprint):**
1. OntologyVisualizer (569 LOC)
2. CollaborativeOntologyVisualizer (278 LOC)
3. SkillsManager (355 LOC)
4. SkillBuilder (437 LOC)

**P1 - Next Sprint:**
1. SkillAnalytics (427 LOC)
2. AIAssistPanel (312 LOC)
3. EventTimeline (206 LOC)
4. NeuralNetworkViz (240 LOC)
5. CostTracker (188 LOC)

**P2 - Technical Debt (When Time Permits):**
1. Header (334 LOC)
2. Globe (163 LOC)

**P3 - Review/Low Priority:**
1. FilterPanel (171 LOC)
2. Leaderboard (157 LOC)
3. chat-demo (164 LOC)

## Component Categories

### Visualization Components (High Complexity)
- OntologyVisualizer (569 LOC) - Force-directed graph with canvas
- CollaborativeOntologyVisualizer (278 LOC) - Real-time collaboration
- Globe (163 LOC) - 3D globe with Three.js
- NeuralNetworkViz (240 LOC) - Neural network heatmap

### Data Management Components (High Complexity)
- SkillsManager (355 LOC) - Skills CRUD with filtering
- SkillBuilder (437 LOC) - Skill creation workflow
- SkillAnalytics (427 LOC) - Analytics dashboard
- ClientProfilesClient (141 LOC) - Client management

### Observability Components (Medium Complexity)
- EventTimeline (206 LOC) - Real-time event stream
- CostTracker (188 LOC) - LLM cost tracking
- SquadronPanel (140 LOC) - Squadron status
- FilterPanel (171 LOC) - Event filtering

### Dashboard Components (Low-Medium Complexity)
- NetworkOverview (102 LOC) - Metrics cards
- LiveFeed (116 LOC) - Activity feed with globe
- AgentActivities (98 LOC) - Agent activity list
- ProjectsSummary (108 LOC) - Project overview
- Leaderboard (157 LOC) - Performance rankings
- OntologyOverview (78 LOC) - Ontology stats

### Layout Components (Low Complexity)
- Header (334 LOC) - Navigation and user menu
- MainLayout (18 LOC) - Page wrapper
- Footer (~30 LOC) - Footer links

### AI Components (High Complexity)
- AIAssistPanel (312 LOC) - AI chat interface
- chat-demo (164 LOC) - Multi-LLM chat demo

## Quick Stats

```
Total Components: 49
Total LOC: 7,603
Average LOC: 155 (median: ~140)
Components >150 LOC: 8 (16%)
Components >200 LOC: 3 (6%)
Components >300 LOC: 3 (6%)
Nested Components in Files: 12
Components with >10 Props: 4
```

## Refactoring Impact Estimate

**High Priority (P0):**
- Components: 4
- Total LOC: 1,639
- Estimated Effort: 22-30 hours
- Impact: High

**Medium Priority (P1):**
- Components: 5
- Total LOC: 1,333
- Estimated Effort: 18-24 hours
- Impact: Medium-High

**Low Priority (P2):**
- Components: 2
- Total LOC: 497
- Estimated Effort: 5-7 hours
- Impact: Low-Medium

**Total Estimated Effort: 45-61 hours (6-8 developer days)**

## Recommended First Actions

### Week 1 - Quick Wins (5-8 hours)
1. Extract `EventCard` from `EventTimeline`
2. Extract `StatCard` from `NeuralNetworkViz`
3. Move `GlobeActivityPoint` and `GlobeEarth` to separate files
4. Create `constants/` files for configuration

### Week 2-3 - Skills Components (17-22 hours)
1. Refactor `SkillsManager` (5-7 hours)
2. Refactor `SkillBuilder` (7-9 hours)
3. Refactor `SkillAnalytics` (5-6 hours)

### Week 4-5 - Visualization Components (10-14 hours)
1. Refactor `OntologyVisualizer` (6-8 hours)
2. Refactor `CollaborativeOntologyVisualizer` (4-6 hours)

### Week 6 - Technical Debt (5-7 hours)
1. Refactor `Header` (3-4 hours)
2. Review remaining components (2-3 hours)

## File Structure After Refactoring

```
src/components/
├── ui/ (shadcn/ui + shared components)
│   ├── globe/
│   │   ├── Globe.tsx (60 LOC)
│   │   ├── GlobeEarth.tsx (50 LOC)
│   │   ├── GlobeActivityPoint.tsx (50 LOC)
│   │   └── utils/
│   │       └── coordinateConversion.ts (40 LOC)
│   └── shared/
│       ├── StatCard.tsx (40 LOC)
│       └── ...
├── ontology/
│   ├── OntologyVisualizer.tsx (150 LOC)
│   ├── OntologyCanvas.tsx (120 LOC)
│   ├── OntologyControls.tsx (80 LOC)
│   ├── OntologyLegend.tsx (60 LOC)
│   ├── CollaborativeOntologyVisualizer.tsx (80 LOC)
│   ├── collaboration/
│   │   ├── UserCursor.tsx (50 LOC)
│   │   ├── UsersList.tsx (60 LOC)
│   │   ├── CollaborationProvider.tsx (100 LOC)
│   │   └── useCollaboration.ts (40 LOC)
│   └── lib/
│       ├── forceSimulation.ts (100 LOC)
│       ├── nodeRenderer.ts (80 LOC)
│       └── linkRenderer.ts (70 LOC)
├── skills/
│   ├── SkillsManager.tsx (100 LOC)
│   ├── SkillsFilterBar.tsx (120 LOC)
│   ├── SkillsGrid.tsx (80 LOC)
│   ├── SkillCard.tsx (100 LOC)
│   ├── ActiveJobsPanel.tsx (60 LOC)
│   ├── SkillBuilder.tsx (120 LOC)
│   ├── SkillConfigPanel.tsx (150 LOC)
│   ├── ScrapingProgressPanel.tsx (80 LOC)
│   ├── ScrapingLogViewer.tsx (100 LOC)
│   ├── QuickActionsPanel.tsx (80 LOC)
│   ├── SkillStatistics.tsx (60 LOC)
│   ├── SkillAnalytics.tsx (100 LOC)
│   ├── analytics/
│   │   ├── MetricsCards.tsx (80 LOC)
│   │   ├── StatusBreakdown.tsx (80 LOC)
│   │   ├── CategoryChart.tsx (70 LOC)
│   │   ├── TrendChart.tsx (70 LOC)
│   │   └── RecentActivity.tsx (60 LOC)
│   ├── hooks/
│   │   ├── useSkillsFilters.ts (50 LOC)
│   │   ├── useSkillsData.ts (40 LOC)
│   │   ├── useScrapingProgress.ts (70 LOC)
│   │   └── useSkillAnalytics.ts (80 LOC)
│   └── utils/
│       ├── skillFormatters.ts (30 LOC)
│       └── skillConstants.ts (40 LOC)
├── observability/
│   ├── EventTimeline.tsx (80 LOC)
│   ├── EventCard.tsx (100 LOC)
│   ├── NeuralNetworkViz.tsx (100 LOC)
│   ├── NeuralGrid.tsx (80 LOC)
│   ├── CostTracker.tsx (120 LOC)
│   ├── SquadronPanel.tsx (140 LOC)
│   ├── FilterPanel.tsx (120 LOC)
│   ├── hooks/
│   │   └── useEventStream.ts (50 LOC)
│   └── constants/
│       ├── eventConfig.ts (60 LOC)
│       └── neuralNetwork.ts (80 LOC)
├── layout/
│   ├── Header.tsx (120 LOC)
│   ├── UserMenu.tsx (80 LOC)
│   ├── Navigation.tsx (60 LOC)
│   ├── MobileMenu.tsx (80 LOC)
│   ├── MainLayout.tsx (18 LOC)
│   └── constants/
│       └── navigationItems.ts (40 LOC)
└── dashboard/
    ├── NetworkOverview.tsx (102 LOC)
    ├── LiveFeed.tsx (116 LOC)
    ├── AgentActivities.tsx (98 LOC)
    ├── ProjectsSummary.tsx (108 LOC)
    ├── Leaderboard.tsx (157 LOC)
    ├── OntologyOverview.tsx (78 LOC)
    └── AIAssistPanel.tsx (200 LOC)
```

## Notes

- All LOC estimates are approximate
- "LOC" = Lines of Code (excluding blank lines and comments)
- Priority based on complexity and usage frequency
- Effort estimates include testing
- Some components may need further review after initial refactoring
