# ALIAS Super Admin Console - Technology Stack Inventory

**Generated:** 2026-02-07
**Project Version:** 0.1.0
**Analysis Scope:** Complete dependency inventory from package.json

---

## Core Framework

### Next.js
- **Version:** 16.1.0
- **Runtime:** Bun 1.0.25 (primary), Node.js compatible
- **Router:** App Router (File-based routing in src/app/)
- **Features:**
  - Turbopack enabled for development (`-H 0.0.0.0 -p 3000`)
  - Proxy pattern with proxy.ts (replaces middleware.ts for Next.js 16)
  - Bundle analyzer integration (@next/bundle-analyzer 16.1.0)
  - Remote image optimization configured

### React
- **Version:** 19.2.3
- **Type Overrides:**
  - @types/react: 19.2.7
  - @types/react-dom: 19.2.3
- **Key Features:**
  - Server Components support
  - Concurrent rendering
  - Latest hooks and patterns

### TypeScript
- **Version:** 5.9.3
- **Configuration:** Strict mode enabled
- **Type Safety:** Comprehensive coverage with Zod validation

---

## Authentication & Identity

### WorkOS (Primary Auth Provider)
- **@workos-inc/authkit-nextjs:** 2.13.0
- **@workos-inc/node:** 7.82.0
- **Features:**
  - SSO/SAML/MFA enterprise authentication
  - OAuth 2.0 flow
  - Session management via iron-session 8.0.4
  - Multi-tenant organization support
  - User profile synchronization to Convex

### Session Management
- **@hapi/iron:** 7.0.1 (Secure cookie encryption)
- **iron-session:** 8.0.4
- **cookie-password:** 32+ character secret for JWT signing

---

## Backend & Database

### Convex (Real-time Database-as-a-Service)
- **Version:** 1.31.2
- **Purpose:** Reactive backend with real-time subscriptions
- **Schema:** 16 tables (organizations, users, skills, client research, observability)
- **Features:**
  - Automatic type generation
  - Real-time data synchronization
  - Built-in authentication integration
  - HTTP endpoints for observability
  - Full-text search on client profiles
  - Vector search capability

---

## AI & Multi-LLM Integration (Vercel AI SDK v6)

### AI SDK Core
- **ai:** 6.0.0-beta.99 (Core SDK)
- **@ai-sdk/react:** 2.0.128 (React integration)
- **@ai-sdk/ui-utils:** 1.2.11 (UI utilities)

### Supported AI Providers (15+)
1. **OpenAI** - @ai-sdk/openai 2.0.89
2. **Anthropic** - @ai-sdk/anthropic 2.0.58
3. **Google** - @ai-sdk/google 2.0.52
4. **Google Vertex** - @ai-sdk/google-vertex 3.0.98
5. **Cerebras** - @ai-sdk/cerebras 1.0.36 (Ultra-fast inference)
6. **Groq** - @ai-sdk/groq 2.0.34 (Fast inference)
7. **Mistral** - @ai-sdk/mistral 2.0.27
8. **DeepSeek** - @ai-sdk/deepseek 1.0.33
9. **Cohere** - @ai-sdk/cohere 2.0.22
10. **Fireworks** - @ai-sdk/fireworks 1.0.33
11. **Together AI** - @ai-sdk/togetherai 1.0.34
12. **Perplexity** - @ai-sdk/perplexity 2.0.23
13. **xAI (Grok)** - @ai-sdk/xai 2.0.56
14. **Azure OpenAI** - @ai-sdk/azure 2.0.91
15. **AWS Bedrock** - @ai-sdk/amazon-bedrock 3.0.74

### Cross-Framework Support
- **@ai-sdk/svelte:** 3.0.126
- **@ai-sdk/vue:** 2.0.126
- **@ai-sdk/solid:** 1.2.13

### Agent Integration
- **@copilotkit/react-core:** 1.51.3
- **@copilotkit/react-ui:** 1.51.3

---

## UI Component Libraries

### shadcn/ui + Radix UI Primitives
Radix UI components provide accessible, unstyled primitives:

- **Accordion:** @radix-ui/react-accordion 1.2.12
- **Alert Dialog:** @radix-ui/react-alert-dialog 1.1.15
- **Aspect Ratio:** @radix-ui/react-aspect-ratio 1.1.8
- **Avatar:** @radix-ui/react-avatar 1.1.11
- **Checkbox:** @radix-ui/react-checkbox 1.3.3
- **Collapsible:** @radix-ui/react-collapsible 1.1.12
- **Context Menu:** @radix-ui/react-context-menu 2.2.16
- **Dialog:** @radix-ui/react-dialog 1.1.15
- **Dropdown Menu:** @radix-ui/react-dropdown-menu 2.1.16
- **Hover Card:** @radix-ui/react-hover-card 1.1.15
- **Label:** @radix-ui/react-label 2.1.8
- **Menubar:** @radix-ui/react-menubar 1.1.16
- **Navigation Menu:** @radix-ui/react-navigation-menu 1.2.14
- **Popover:** @radix-ui/react-popover 1.1.15
- **Progress:** @radix-ui/react-progress 1.1.8
- **Radio Group:** @radix-ui/react-radio-group 1.3.8
- **Scroll Area:** @radix-ui/react-scroll-area 1.2.10
- **Select:** @radix-ui/react-select 2.2.6
- **Separator:** @radix-ui/react-separator 1.1.8
- **Slider:** @radix-ui/react-slider 1.3.6
- **Slot:** @radix-ui/react-slot 1.2.4
- **Switch:** @radix-ui/react-switch 1.2.6
- **Tabs:** @radix-ui/react-tabs 1.1.13
- **Toast:** @radix-ui/react-toast 1.2.15
- **Toggle:** @radix-ui/react-toggle 1.1.10
- **Toggle Group:** @radix-ui/react-toggle-group 1.1.11
- **Tooltip:** @radix-ui/react-tooltip 1.2.8

### Additional UI Libraries
- **cmdk:** 1.1.1 (Command palette)
- **embla-carousel-react:** 8.6.0 (Carousel component)
- **input-otp:** 1.4.2 (One-time password input)
- **react-day-picker:** 9.13.0 (Date picker)
- **sonner:** 2.0.7 (Toast notifications)
- **vaul:** 1.1.2 (Drawer/sheet component)

---

## Styling & Animation

### Tailwind CSS
- **Version:** 4.1.18
- **PostCSS Plugin:** @tailwindcss/postcss 4.1.18
- **Configuration:** Tailwind config with custom theme
- **Utilities:**
  - tailwind-merge: 3.4.0 (Merging classes without conflicts)
  - tailwindcss-animate: 1.0.7 (Animation utilities)
  - class-variance-authority: 0.7.1 (CVA for component variants)
  - clsx: 2.1.1 (Conditional className utility)

### Animation Libraries
- **framer-motion:** 12.31.0 (Primary animation library)
- **motion:** 12.31.0 (Motion One, lighter alternative)
- **lucide-react:** 0.548.0 (Icon library with 1000+ icons)

---

## 3D Visualization

### Three.js Ecosystem
- **three:** 0.180.0 (Core 3D rendering engine)
- **@react-three/fiber:** 9.5.0 (React renderer for Three.js)
- **@react-three/drei:** 10.7.7 (Helper utilities for R3F)
- **@types/three:** 0.180.0 (TypeScript definitions)

### Use Case
- 3D globe visualization of ALIAS global deployments
- Client, agent, internal, and external location mapping

---

## Data Visualization

### Chart Libraries
- **chart.js:** 4.5.1 (Canvas-based charting)
- **react-chartjs-2:** 5.3.1 (React wrapper for Chart.js)
- **reaviz:** 16.1.1 (Advanced data visualizations)

### Purpose
- Dashboard metrics and analytics
- Agent performance tracking
- Real-time observability charts

---

## Form & Data Management

### Form Handling
- **react-hook-form:** 7.71.1 (Form state management)
- **@hookform/resolvers:** 5.2.2 (Validation integrations)
- **zod:** 4.3.6 (Schema validation and type inference)

### Data Fetching & State
- **@tanstack/react-query:** 5.90.20 (Server state management)
- **swr:** 2.4.0 (Data fetching alternative)

### Date/Time Utilities
- **date-fns:** 4.1.0 (Modern date library)

---

## Layout & Components

### Resizable Panels
- **react-resizable-panels:** 3.0.6 (Split views, resizable layouts)

### Theme Support
- **next-themes:** 0.4.6 (Dark mode support)

---

## Development Tools

### Code Quality (Biome - Primary)
- **@biomejs/biome:** 2.3.14 (Linter + Formatter)
- **ultracite:** 6.3.2 (Advanced linting rules)

### Biome Features
- Ultra-fast performance (subsecond)
- Replaces ESLint + Prettier
- Strict type safety enforcement
- Accessibility rules (relaxed a11y)
- Zero configuration

### Alternative Linters
- **eslint:** 9.39.2
- **eslint-config-next:** 16.1.0
- **@eslint/eslintrc:** 3.3.3

### TypeScript Tooling
- **typescript:** 5.9.3
- **@types/node:** 24.10.10
- **@types/uuid:** 10.0.0
- **@types/escape-html:** 1.0.4
- **@types/chroma-js:** 3.1.2
- **@types/react-reconciler:** 0.32.3

### Build Tools
- **autoprefixer:** 10.4.24 (CSS vendor prefixes)
- **postcss:** 8.5.6 (CSS transformation)

### Environment Management
- **@t3-oss/env-nextjs:** 0.13.10 (Type-safe environment variables)

---

## Testing

### Playwright (E2E Testing)
- **@playwright/test:** 1.58.1
- **playwright:** 1.58.1
- **Coverage:**
  - 7 test files covering auth, navigation, AI demo, client research, skills, observability, globe
  - Multi-browser support (Chromium, Firefox, WebKit)
  - Device testing (desktop + mobile)

---

## Deployment

### Platform Configuration
- **Netlify:** Configured via netlify.toml
- **Runtime:** Bun 1.0.25
- **Build:** Next.js plugin with Convex deployment
- **Features:**
  - Remote image optimization (Unsplash)
  - Automatic Convex deployment during build

---

## Dependency Summary

### Total Dependencies
- **Production:** 86 dependencies
- **Development:** 19 dependencies
- **Total:** 105 unique packages

### Key Categories
1. **Core Framework:** Next.js, React, TypeScript
2. **Authentication:** WorkOS, iron-session
3. **Backend:** Convex (real-time database)
4. **AI Integration:** 15+ LLM providers via AI SDK v6
5. **UI Components:** 27+ Radix UI primitives (shadcn/ui)
6. **Styling:** Tailwind CSS 4.x
7. **Animation:** Framer Motion 12.x
8. **3D Graphics:** Three.js + React Three Fiber
9. **Data Visualization:** Chart.js, reaviz
10. **Development:** Biome (linter/formatter), Playwright (testing)

### Version Highlights
- **Next.js:** Latest 16.x with App Router
- **React:** Latest 19.x
- **Convex:** Stable 1.31.x
- **AI SDK:** Beta 6.x (cutting-edge)
- **Tailwind:** Latest 4.x
- **Biome:** Latest 2.3.x

---

## Architecture Notes

### Runtime Strategy
- **Primary:** Bun for 5.6x faster installs and execution
- **Compatibility:** Full Node.js compatibility
- **Scripts:** All package scripts use `bunx --bun` for consistency

### Multi-Framework Ready
- AI SDK includes support for React, Vue, Svelte, and Solid
- Future expansion to other frameworks is straightforward

### Enterprise-Grade Auth
- WorkOS provides SOC 2 Type II compliant authentication
- Supports SAML SSO for enterprise clients
- MFA enforcement capability

---

**End of Technology Stack Inventory**
