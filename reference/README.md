# Reference Repositories

This directory contains reference implementations to learn from during development of the ALIAS Enterprise Platform.

## Repositories

### 1. Ever Gauzy
**Location:** `./ever-gauzy/`
**GitHub:** https://github.com/ever-co/ever-gauzy
**Purpose:** Comprehensive business management platform

**Key Features to Reference:**
- Time & Activity Tracking
- Project & Task Management
- Employee Management
- Financial Management (Invoicing, Expenses)
- CRM & Sales Pipeline
- Reports & Analytics
- Multi-tenant architecture

**Key Directories:**
- `apps/` - Application packages
- `packages/` - Shared packages
- `apps/gauzy/` - Main web application
- `apps/mobile/` - React Native mobile app

### 2. Ever Teams
**Location:** `./ever-teams/`
**GitHub:** https://github.com/ever-co/ever-teams
**Purpose:** Team collaboration and time tracking

**Key Features to Reference:**
- Real-time collaboration
- Task management
- Time tracking with screenshots
- Activity monitoring
- Mobile apps (iOS/Android)

**Key Directories:**
- `apps/` - Application packages
- `apps/web/` - Next.js web application
- `apps/mobile/` - React Native Expo app

### 3. Convex SaaS (Official Template)
**Location:** `./convex-saas/`
**GitHub:** https://github.com/get-convex/convex-saas
**Purpose:** Production-ready Convex SaaS starter

**Key Features to Reference:**
- Convex Auth integration patterns
- Stripe payment integration
- TanStack Router setup
- Resend email integration
- shadcn/ui components
- Production-ready architecture

**Key Directories:**
- `src/` - Next.js application
- `convex/` - Convex backend functions
- `components/` - Shared UI components

### 4. Convex Auth + RBAC (Official)
**Location:** `./convex-auth-with-role-based-permissions/`
**GitHub:** https://github.com/get-convex/convex-auth-with-role-based-permissions
**Purpose:** Role-based access control with Convex

**Key Features to Reference:**
- Hierarchical role system (READ, WRITE, ADMIN)
- Server-side permission checks
- Convex Auth integration
- Row-level security patterns

**Key Directories:**
- `convex/` - Permission logic and auth config
- `src/` - Frontend with role checks

### 5. Vercel Platforms (Multi-tenant)
**Location:** `./platforms/`
**GitHub:** https://github.com/vercel/platforms
**Purpose:** Multi-tenant with custom subdomains

**Key Features to Reference:**
- Subdomain routing in middleware
- Multi-tenant data isolation
- Custom domain support
- ISR (Incremental Static Regeneration)

**Key Directories:**
- `app/` - Next.js app router
- `middleware.ts` - Subdomain detection
- `lib/` - Multi-tenant utilities

### 6. Next.js Enterprise Boilerplate
**Location:** `./next-enterprise/`
**GitHub:** https://github.com/Blazity/next-enterprise
**Purpose:** Enterprise-grade Next.js template

**Key Features to Reference:**
- Project structure best practices
- TypeScript strict mode
- Testing setup (Jest, Playwright)
- CI/CD with GitHub Actions
- Performance optimizations

**Key Directories:**
- `src/` - Source code structure
- `tests/` - Testing examples
- `.github/` - CI/CD workflows

### 7. Next.js SaaS RBAC
**Location:** `./next-saas-rbac/`
**GitHub:** https://github.com/rcmonteiro/next-saas-rbac
**Purpose:** Full-stack SaaS with RBAC/ABAC

**Key Features to Reference:**
- CASL authorization library
- Clean Architecture + DDD
- RBAC and ABAC patterns
- Fastify backend example

**Key Directories:**
- `apps/api/` - Backend API
- `apps/web/` - Next.js frontend
- `packages/auth/` - Shared auth logic

### 8. TailAdmin Dashboard
**Location:** `./free-nextjs-admin-dashboard/`
**GitHub:** https://github.com/TailAdmin/free-nextjs-admin-dashboard
**Purpose:** Admin dashboard template

**Key Features to Reference:**
- Dashboard UI components
- Charts and data visualization
- Tables with sorting/filtering
- Form components
- Page layouts

**Key Directories:**
- `src/components/` - Reusable components
- `src/app/` - Dashboard pages

### 9. next-forge (Production Turborepo)
**Location:** `./next-forge/`
**GitHub:** https://github.com/haydenbleasel/next-forge
**Purpose:** Production-grade Turborepo template for Next.js SaaS

**Key Features to Reference:**
- Monorepo architecture (Turborepo)
- Marketing site + App + API + Docs
- Email templates with React Email
- Design system package
- Storybook integration
- Comprehensive CI/CD
- Environment management
- Package versioning

**Key Directories:**
- `apps/app/` - Main SaaS application
- `apps/web/` - Marketing website
- `apps/api/` - API server
- `apps/docs/` - Documentation site
- `apps/email/` - Email templates
- `packages/design-system/` - Shared UI
- `packages/database/` - Database layer
- `packages/auth/` - Authentication

### 10. eververse (Product Management Platform)
**Location:** `./eververse/`
**GitHub:** https://github.com/haydenbleasel/eververse
**Purpose:** Open source product management platform

**Key Features to Reference:**
- Product roadmap management
- Feature planning workflows
- AI-assisted product decisions
- Jira/GitHub/Linear integrations
- Customer feedback collection
- Voting and prioritization
- Changelog generation

**Key Directories:**
- Built on next-forge architecture
- Uses Convex for backend
- Integration patterns with dev tools

### 11. convex-v1 (Midday Port)
**Location:** `./v1/`
**GitHub:** https://github.com/get-convex/v1
**Purpose:** Production SaaS starter based on Midday, ported to Convex

**Key Features to Reference:**
- Full-stack Convex + Next.js
- Financial dashboard patterns
- Invoice management
- Receipt scanning (AI)
- Bank integrations
- Team collaboration
- Real-time sync
- Production-ready patterns

**Key Directories:**
- `convex/` - Backend functions and schema
- `app/` - Next.js application
- `components/` - UI components

## Usage Guidelines

### When to Reference
- ✅ **Architecture patterns** - How they structure multi-tenant systems
- ✅ **Component examples** - UI/UX patterns for similar features
- ✅ **Data models** - Database schema inspiration
- ✅ **Mobile implementation** - React Native best practices
- ✅ **Time tracking logic** - Algorithm examples

### What NOT to Copy
- ❌ **Direct code copying** - Adapt to our Convex backend
- ❌ **Their backend** - We're using Convex, not their stack
- ❌ **Their auth** - We're using WorkOS AuthKit
- ❌ **Dependencies** - Only add what we actually need

## Our Differences

| Feature | Ever Gauzy/Teams | ALIAS Platform |
|---------|-----------------|----------------|
| **Backend** | NestJS + TypeORM | Convex (real-time) |
| **Auth** | Custom | WorkOS AuthKit |
| **Database** | PostgreSQL | Convex |
| **Real-time** | WebSockets | Convex subscriptions |
| **Mobile** | React Native | React Native + Expo |
| **Unique Features** | - | Super Admin Portal, Client Intelligence, Agent Fleet, Ontology |

## Key Learnings to Extract

### From Ever Gauzy
1. **Multi-tenant data isolation patterns**
2. **Time tracking algorithms** (billable hours, utilization)
3. **Invoice generation** from time entries
4. **Financial calculations** (profit/loss, budgets)
5. **Permission system** (RBAC implementation)
6. **Report generation** logic

### From Ever Teams
1. **Real-time collaboration** UI patterns
2. **Screenshot capture** (mobile native module)
3. **Activity tracking** implementation
4. **Task board** (Kanban UI/UX)
5. **Mobile app structure** (Expo + navigation)
6. **Offline mode** and sync strategies

## Next Steps

As we build each phase, reference these repos for:
- Inspiration and best practices
- Understanding complex workflows
- UI/UX patterns that work
- Mobile app implementation details

**Remember:** We're building something BETTER with:
- Real-time Convex backend
- AI-native features throughout
- Advanced visualizations
- Unified Super Admin portal
- Better architecture and DX
