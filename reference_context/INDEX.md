# Knowledge Lattice Index

## Mapping: Local Files → External References

### Core Framework & Routing

#### `src/app/layout.tsx` → Next.js App Router Patterns
- **Reference:** `patterns/nextjs-app-router-layouts.md`
- **GitHub:** `github_repos/nextjs-app-router-examples/`
- **Docs:** Next.js 16 App Router Documentation
- **Pattern:** Root layout with providers, metadata, global styles

#### `src/middleware.ts` → Authentication Middleware
- **Reference:** `patterns/workos-middleware-patterns.md`
- **GitHub:** `github_repos/workos-nextjs-examples/`
- **Docs:** WorkOS AuthKit Middleware Guide
- **Pattern:** Route protection with session validation

#### `src/app/(dashboard)/*` → Route Groups
- **Reference:** `patterns/nextjs-route-groups.md`
- **Pattern:** Organized route structure with shared layouts

---

### Database & Real-time

#### `convex/schema.ts` → Convex Schema Design
- **Reference:** `patterns/convex-schema-patterns.md`
- **GitHub:** `github_repos/convex-examples/`
- **Docs:** Convex Schema Documentation
- **Pattern:** Type-safe schema with indexes and search indexes

#### `convex/users.ts` → User Management
- **Reference:** `patterns/convex-user-sync.md`
- **Pattern:** WorkOS → Convex user synchronization

#### `convex/observability.ts` → Real-time Events
- **Reference:** `patterns/convex-realtime-subscriptions.md`
- **Pattern:** Event-driven observability with WebSocket subscriptions

#### `src/lib/hooks/use-stats.ts` → Convex React Hooks
- **Reference:** `examples/convex-react-hooks.ts`
- **Pattern:** `useQuery` for real-time data subscriptions

---

### Authentication

#### `src/lib/workos.ts` → WorkOS Configuration
- **Reference:** `patterns/workos-configuration.md`
- **GitHub:** `github_repos/workos-authkit-examples/`
- **Docs:** WorkOS AuthKit Next.js Guide
- **Pattern:** Environment-based configuration

#### `src/lib/hooks/use-work-os.ts` → WorkOS + Convex Integration
- **Reference:** `patterns/workos-convex-integration.md`
- **Pattern:** Dual authentication state (WorkOS + Convex)

#### `src/app/login/route.ts` → Login Flow
- **Reference:** `examples/workos-login-flow.ts`
- **Pattern:** OAuth initiation with redirect handling

#### `src/app/callback/route.ts` → OAuth Callback
- **Reference:** `examples/workos-callback-handler.ts`
- **Pattern:** Session creation and user sync

---

### AI Integration

#### `src/app/api/ai-demo/chat/route.ts` → AI SDK Streaming
- **Reference:** `examples/ai-sdk-streaming-chat.ts`
- **GitHub:** `github_repos/vercel-ai-sdk-examples/`
- **Docs:** Vercel AI SDK Documentation
- **Pattern:** Multi-provider streaming with edge runtime

#### `src/app/api/ai-demo/structured/route.ts` → Structured Outputs
- **Reference:** `examples/ai-sdk-structured-outputs.ts`
- **Pattern:** Zod schema validation with AI generation

#### `src/components/ai-demo/chat-demo.tsx` → React AI Hooks
- **Reference:** `examples/ai-sdk-react-hooks.tsx`
- **Pattern:** `useChat` hook for streaming UI

---

### UI Components

#### `src/components/ui/*` → shadcn/ui Components
- **Reference:** `github_repos/shadcn-ui/`
- **Docs:** shadcn/ui Documentation
- **Pattern:** Radix UI primitives with Tailwind styling

#### `src/components/dashboard/*` → Dashboard Patterns
- **Reference:** `patterns/dashboard-layouts.md`
- **Pattern:** Grid layouts with responsive design

#### `src/components/observability/*` → Real-time Dashboards
- **Reference:** `patterns/realtime-dashboard-patterns.md`
- **Pattern:** Auto-updating components with Convex subscriptions

---

### Forms & Validation

#### `src/app/client-profiles/new/page.tsx` → Form Patterns
- **Reference:** `patterns/react-hook-form-zod.md`
- **Pattern:** Type-safe forms with Zod validation

---

### 3D Visualizations

#### `src/components/ontology/*` → Three.js Integration
- **Reference:** `examples/threejs-react-three-fiber.md`
- **GitHub:** `github_repos/react-three-fiber-examples/`
- **Pattern:** React Three Fiber with Convex data

---

## Technology-Specific Mappings

### Next.js 16
- **Official Docs:** https://nextjs.org/docs
- **App Router Guide:** `documentation/nextjs-app-router.md`
- **Server Components:** `patterns/nextjs-server-components.md`
- **API Routes:** `patterns/nextjs-api-routes.md`

### Convex
- **Official Docs:** https://docs.convex.dev
- **Schema Guide:** `documentation/convex-schema.md`
- **React Integration:** `documentation/convex-react.md`
- **Real-time Patterns:** `patterns/convex-realtime.md`

### WorkOS
- **Official Docs:** https://workos.com/docs
- **AuthKit Guide:** `documentation/workos-authkit.md`
- **Next.js Integration:** `documentation/workos-nextjs.md`

### AI SDK
- **Official Docs:** https://sdk.vercel.ai/docs
- **Streaming Guide:** `documentation/ai-sdk-streaming.md`
- **Multi-Provider:** `patterns/ai-sdk-multi-provider.md`

### shadcn/ui
- **Official Docs:** https://ui.shadcn.com
- **Component Library:** `github_repos/shadcn-ui/`
- **Installation Guide:** `documentation/shadcn-installation.md`

---

## Curation Strategy

**Current Strategy:** `MUTATE` (Innovation-focused)

This means we prioritize:
- Newer libraries and patterns
- Alternative architectures
- Modern best practices
- Innovation over strict alignment

To switch to `MIRROR` strategy, see `CURATION_STRATEGY.md`


