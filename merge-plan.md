# Merge Plan: alias-agent-hub into alias-aeos

## Project Analysis

### Current Project (alias-aeos-backup-20250804-103835)
- **Framework**: Next.js 15 with App Router
- **Database**: Convex (real-time, reactive)
- **Auth**: Better Auth (WorkOS)
- **UI**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **3D**: Three.js with React Three Fiber
- **Build Tool**: Next.js with Turbopack

### Source Project (alias-agent-hub)
- **Framework**: Vite + React (SPA)
- **Database**: Convex + Supabase
- **UI**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Additional**: More comprehensive Radix UI components

## Merge Strategy

### Phase 1: Dependency Analysis & Compatibility
1. **Framework Migration**: Vite → Next.js
2. **Database Integration**: Merge Convex schemas
3. **Component Integration**: Migrate React components
4. **Configuration Harmonization**: Merge configs

### Phase 2: Architecture Integration
1. **App Router Structure**: Convert Vite pages to Next.js app structure
2. **Convex Schema Merge**: Combine database schemas
3. **Component Migration**: Move reusable components
4. **Asset Integration**: Handle public assets

### Phase 3: Feature Integration
1. **Knowledge Base**: Integrate knowledge management features
2. **Client Research**: Add client research capabilities
3. **UI Enhancements**: Merge additional Radix components
4. **Integration Updates**: Handle Supabase integration

## Detailed Implementation Steps

### Step 1: Analyze & Backup
- [x] Backup current project state
- [x] Document current Convex schema
- [x] List all dependencies to merge
- [x] Identify conflicting configurations

### Step 2: Dependency Management
- [x] Merge package.json dependencies
- [x] Update Next.js to handle additional Radix components
- [x] Integrate Supabase client if needed
- [x] Handle React version compatibility (18 vs 19)

### Step 3: Convex Schema Integration
- [x] Analyze alias-agent-hub Convex schema
- [x] Merge with existing schema.ts
- [x] Handle potential conflicts
- [ ] Update generated types

### Step 4: Component Migration
- [x] Migrate knowledge management components
- [x] Transfer client research functionality
- [x] Update component imports for Next.js
- [x] Handle client/server component boundaries

### Step 5: Configuration Updates
- [x] Update Next.js config for new dependencies
- [x] Merge Tailwind configurations
- [x] Handle Vite-specific code conversion
- [x] Update TypeScript configurations

### Step 6: Feature Integration
- [x] Integrate knowledge base routing
- [x] Add client research pages
- [x] Update navigation and layout
- [ ] Handle authentication integration

### Step 7: Testing & Validation
- [x] Run linting and type checking
- [x] Test Convex functions
- [x] Validate UI components
- [x] Check build process
- [x] Test development server

## Risk Mitigation

1. **React Version**: Handle React 18 → 19 migration carefully
2. **Framework Differences**: Convert Vite-specific patterns to Next.js
3. **Database Conflicts**: Carefully merge Convex schemas
4. **Build Process**: Ensure Next.js build handles all dependencies
5. **Type Safety**: Maintain TypeScript compatibility

## Success Criteria

- [x] All features from alias-agent-hub working in Next.js
- [x] No breaking changes to existing functionality
- [x] Convex schema properly merged
- [x] Build and lint processes pass
- [x] UI components render correctly
- [x] Knowledge management features integrated

## Post-Merge Tasks

- [ ] Clean up unused dependencies
- [ ] Update documentation
- [ ] Test deployment process
- [ ] Validate all environments