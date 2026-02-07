# Feature Implementation Reference Mapping

This guide maps each feature we're building to the best reference repositories to learn from.

## Phase 0: Foundation

### Route Organization
**Primary:** `next-forge` - Production Turborepo monorepo structure
**Secondary:** `next-enterprise` - Clean app router structure
**Tertiary:** `platforms` - Multi-tenant route patterns
**Quaternary:** `convex-saas` - SaaS-specific routing

**What to look for:**
- Turborepo workspace configuration (`next-forge/`)
- Apps vs packages structure
- Route group organization (`(auth)`, `(dashboard)`, etc.)
- Layout hierarchy patterns
- Middleware implementation
- Monorepo best practices

### Multi-Tenant Architecture
**Primary:** `platforms` - Official Vercel multi-tenant example
**Secondary:** `convex-saas` - Convex-specific patterns
**Tertiary:** `ever-gauzy` - Complex multi-tenant implementation

**What to look for:**
- Subdomain detection in middleware
- Tenant isolation patterns
- Organization/workspace data models
- Tenant-scoped queries

---

## Phase 1: Multi-Tenant Core

### Organization Management
**Primary:** `platforms` - Site/organization structure
**Secondary:** `convex-saas` - Convex org patterns
**Tertiary:** `ever-gauzy/packages/core/src/organization/` - Complex org hierarchy

**What to look for:**
- Organization creation flow
- Member invitation system
- Organization settings schema

### RBAC System
**Primary:** `convex-auth-with-role-based-permissions` - Official Convex RBAC
**Secondary:** `next-saas-rbac` - CASL advanced patterns
**Tertiary:** `ever-gauzy` - Granular permissions

**What to look for:**
```typescript
// convex-auth-with-role-based-permissions/convex/permissions.ts
- Role hierarchy (READ < WRITE < ADMIN)
- Permission checking functions
- Row-level security

// next-saas-rbac/packages/auth/
- CASL ability definitions
- Permission composition
- ABAC patterns
```

### User Invitation Flow
**Primary:** `convex-saas` - Invitation with Resend
**Secondary:** `platforms` - Team invitation
**Tertiary:** `ever-gauzy` - Complex invitation workflow

**What to look for:**
- Invitation token generation
- Email templates
- Invitation acceptance flow
- Expired invitation handling

---

## Phase 2: Time & Activity Tracking

### Timer Implementation
**Primary:** `ever-teams` - Time tracking core
**Secondary:** `ever-gauzy/packages/core/src/time-tracking/` - Advanced tracking

**What to look for:**
```typescript
// ever-teams/apps/web/lib/features/task-time-tracking/
- Start/stop timer logic
- Timer state management
- Background tracking (web)
- Time entry storage
```

### Timesheet Views
**Primary:** `ever-gauzy/apps/gauzy/src/app/@shared/timesheet/` - Comprehensive UI
**Secondary:** `ever-teams` - Simplified view

**What to look for:**
- Calendar views
- Weekly/daily aggregation
- Approval workflow UI
- Export functionality

### Activity Tracking
**Primary:** `ever-gauzy/apps/desktop/` - Desktop activity monitoring
**Secondary:** `ever-teams` - Screenshot capture

**What to look for:**
- Activity log schema
- Screenshot capture timing
- Privacy controls
- Activity visualization

---

## Phase 3: Project & Task Management

### Project Structure
**Primary:** `ever-gauzy/packages/core/src/organization-projects/`
**Secondary:** `ever-teams/apps/web/lib/features/project/`

**What to look for:**
- Project creation with budget
- Project-member assignments
- Project status workflows
- Budget tracking

### Task Management
**Primary:** `ever-teams/apps/web/lib/features/task/`
**Secondary:** `ever-gauzy/packages/core/src/tasks/`

**What to look for:**
```typescript
// Task schema
- Task hierarchy (tasks > subtasks)
- Assignments & ownership
- Status/priority enums
- Dependencies tracking
- Time estimates vs actuals
```

### Kanban Board
**Primary:** `ever-teams/apps/web/app/[locale]/tasks/` - Kanban UI
**Secondary:** `ever-gauzy` - Advanced board features

**What to look for:**
- Drag-and-drop implementation
- Column customization
- Card components
- Real-time updates with Convex

### Gantt Chart
**Primary:** `ever-gauzy` - Timeline visualization
**Look for:** Third-party libraries or custom SVG implementation

---

## Phase 4: Team Management

### Employee Profiles
**Primary:** `ever-gauzy/packages/core/src/employee/`
**Secondary:** `ever-teams/apps/web/lib/features/team/`

**What to look for:**
- Profile data schema
- Skills/certifications
- Department hierarchy
- Manager relationships

### PTO Management
**Primary:** `ever-gauzy/packages/core/src/time-off-request/`

**What to look for:**
- PTO request workflow
- Approval chain
- Balance tracking
- Calendar integration

### Availability & Scheduling
**Primary:** `ever-gauzy/packages/core/src/availability-slots/`

**What to look for:**
- Availability calendar
- Shift scheduling
- Conflict detection
- Team calendar view

---

## Phase 5: Financial Management

### Invoice Generation
**Primary:** `v1` (convex-v1) - Modern invoice management with Convex
**Secondary:** `ever-gauzy/packages/core/src/invoice/`

**What to look for:**
```typescript
// v1/ - Convex patterns for invoices
- Real-time invoice updates
- Receipt scanning with AI
- Invoice generation from time entries
- Line item calculations
- Tax handling
- Invoice templates
- Payment status tracking
- Bank integration patterns
```

### Expense Tracking
**Primary:** `ever-gauzy/packages/core/src/expense/`

**What to look for:**
- Expense submission
- Receipt upload/storage
- Approval workflow
- Category management
- Reimbursement tracking

### Budget Management
**Primary:** `ever-gauzy` - Project budgets

**What to look for:**
- Budget allocation
- Burn rate calculations
- Budget vs actual reports
- Alert thresholds

### Stripe Integration
**Primary:** `convex-saas` - Stripe with Convex
**Secondary:** `ever-gauzy` - Payment processing

**What to look for:**
```typescript
// convex-saas/convex/stripe.ts
- Webhook handling
- Payment intent creation
- Subscription management
- Customer portal integration
```

---

## Phase 6: Business Intelligence

### Dashboard Components
**Primary:** `free-nextjs-admin-dashboard` - Dashboard UI
**Secondary:** `ever-gauzy/apps/gauzy/src/app/pages/dashboard/` - BI dashboards

**What to look for:**
- Metric cards
- Chart components (Recharts/Chart.js)
- Data aggregation patterns
- Real-time updates

### Report Builder
**Primary:** `ever-gauzy` - Report generation
**Look for:** Custom report builder or use libraries like react-pivottable

**What to look for:**
- Dynamic field selection
- Filter builder UI
- Aggregation logic
- Export to CSV/PDF

### Predictive Analytics
**Research:** TensorFlow.js or custom algorithms
**Reference:** None specific - custom implementation

**What to implement:**
- Time-series forecasting
- Churn prediction models
- Resource allocation optimization
- Trend analysis

---

## Phase 7: Mobile Apps

### React Native Structure
**Primary:** `ever-teams/apps/mobile/` - Expo setup
**Secondary:** `ever-gauzy/apps/mobile/` - Advanced features

**What to look for:**
```
ever-teams/apps/mobile/
├── app/ - Expo Router
├── components/ - Shared components
├── lib/ - Business logic
├── hooks/ - Custom hooks
└── services/ - API calls
```

### Native Modules
**Primary:** `ever-gauzy/apps/desktop/` - Native integrations
**Secondary:** `ever-teams` - Screenshot capture

**What to look for:**
- React Native Modules bridge
- Camera integration
- Background services
- File system access
- Biometric auth

### Offline Mode
**Primary:** `ever-teams` - Offline sync
**Reference:** Convex React Native docs

**What to look for:**
- Local storage with SQLite
- Sync queue implementation
- Conflict resolution
- Optimistic updates

---

## Phase 8: Advanced Integrations

### Stripe (Financial Metrics)
**Primary:** `convex-saas/convex/stripe.ts`

**What to look for:**
- Webhook verification
- Event handling
- Customer data sync
- Subscription lifecycle

### Email (Resend)
**Primary:** `convex-saas/convex/resend.ts`

**What to look for:**
- Email template patterns
- Transactional emails
- Email scheduling
- Tracking opens/clicks

### Real-time Subscriptions
**Primary:** `convex-auth-with-role-based-permissions` - Convex patterns
**Secondary:** All Convex repos - Use `useQuery`

**What to look for:**
```typescript
// Convex real-time patterns
- useQuery() for reactive data
- useMutation() for updates
- Optimistic updates
- Subscription management
```

---

## Key Files to Study by Repo

### Convex SaaS (`convex-saas/`)
```
convex/
├── schema.ts               # Data models
├── auth.ts                 # Authentication setup
├── stripe.ts               # Payment integration
├── resend.ts               # Email sending
└── organizations.ts        # Multi-tenant org management

src/
├── app/(auth)/            # Auth pages
├── app/(dashboard)/       # Protected pages
└── components/            # shadcn/ui components
```

### Convex RBAC (`convex-auth-with-role-based-permissions/`)
```
convex/
├── permissions.ts         # CRITICAL: Permission checks
├── auth.ts                # Role assignment
└── documents.ts           # Row-level security example

src/
└── components/            # Permission-aware UI
```

### Vercel Platforms (`platforms/`)
```
middleware.ts              # CRITICAL: Multi-tenant routing
app/
├── [domain]/              # Tenant-specific pages
└── api/                   # Tenant-scoped APIs

lib/
└── fetchers.ts            # Tenant data fetching
```

### Ever Gauzy (`ever-gauzy/`)
```
packages/core/src/
├── time-tracking/         # Time tracking logic
├── organization/          # Org management
├── employee/              # Employee profiles
├── invoice/               # Invoicing system
└── tasks/                 # Task management

apps/gauzy/src/app/
└── pages/                 # Page examples
```

### Ever Teams (`ever-teams/`)
```
apps/web/lib/features/
├── task/                  # Task management
├── team/                  # Team collaboration
└── task-time-tracking/    # Timer implementation

apps/mobile/               # React Native app
```

---

## Quick Reference by Feature

| Feature | Primary Repo | Key File/Directory |
|---------|--------------|-------------------|
| **Monorepo structure** | next-forge | `turbo.json`, `apps/`, `packages/` |
| **Multi-tenant routing** | platforms | `middleware.ts` |
| **RBAC** | convex-auth-with-role-based-permissions | `convex/permissions.ts` |
| **Stripe** | convex-saas | `convex/stripe.ts` |
| **Financial dashboard** | v1 | `convex/`, `app/` |
| **Invoice management** | v1 | `convex/invoices.ts` |
| **Receipt AI scanning** | v1 | AI integration patterns |
| **Time tracking** | ever-teams | `apps/web/lib/features/task-time-tracking/` |
| **Task management** | ever-teams | `apps/web/lib/features/task/` |
| **Product roadmaps** | eververse | Product management workflows |
| **Dev tool integrations** | eververse | Jira/GitHub/Linear patterns |
| **Mobile app** | ever-teams | `apps/mobile/` |
| **Dashboard UI** | free-nextjs-admin-dashboard | `src/components/` |
| **Enterprise structure** | next-enterprise | Project root |
| **Email templates** | next-forge | `apps/email/` |
| **Design system** | next-forge | `packages/design-system/` |

---

## Best Practices Summary

### From Convex Repos
- ✅ Always use validators for function arguments
- ✅ Check permissions at function entry
- ✅ Use indexes for common queries
- ✅ Implement optimistic updates in UI

### From Ever Gauzy/Teams
- ✅ Separate business logic from UI
- ✅ Use feature-based directory structure
- ✅ Implement proper error boundaries
- ✅ Design for mobile-first

### From Next.js Enterprise
- ✅ Strict TypeScript configuration
- ✅ Comprehensive testing setup
- ✅ CI/CD from day one
- ✅ Performance monitoring

### From Platforms
- ✅ Edge middleware for routing
- ✅ ISR for dynamic content
- ✅ Subdomain validation
- ✅ Tenant isolation patterns

---

## Development Workflow

**When implementing a new feature:**

1. **Read this mapping** - Find the relevant reference repos
2. **Study the reference code** - Understand the pattern
3. **Adapt for Convex** - Convert to Convex patterns (if from non-Convex repo)
4. **Test with real data** - Use demo data from convex
5. **Document differences** - Note what we did differently and why

**Remember:** These are references, not templates. Adapt, don't copy. We're building something better with Convex!

---

## 🌟 Special Focus: New Reference Repos

### next-forge - The Monorepo Blueprint

**Why it's valuable:**
- Shows production-ready Turborepo architecture at scale
- Multiple apps (marketing, app, API, docs, email) with shared packages
- Environment variable management across workspaces
- CI/CD for monorepo deployments
- Design system as a package

**When to reference:**
```
✅ Phase 0: Deciding monorepo vs multi-repo structure
✅ Phase 8: Building marketing site alongside app
✅ All phases: Package sharing patterns
✅ Email templates: React Email best practices
✅ Design system: Component library structure
```

**Key learnings:**
- `turbo.json` - Task orchestration and caching
- `apps/app/` - Main SaaS application structure
- `packages/design-system/` - Shared UI components
- `apps/email/` - Transactional email templates
- `.github/workflows/` - Monorepo CI/CD patterns

---

### eververse - Product Management Done Right

**Why it's valuable:**
- Built on next-forge + Convex (same stack as us!)
- Shows how to integrate with dev tools (Jira, GitHub, Linear)
- AI-assisted product decisions
- Roadmap and feature voting UI patterns
- Customer feedback collection

**When to reference:**
```
✅ Phase 3: Project/Task management UI inspiration
✅ Phase 6: Planning/roadmap visualization
✅ Phase 8: Dev tool integrations (GitHub, Jira, Linear)
✅ Future: Adding product management features
✅ AI: How to integrate AI for decision assistance
```

**Key learnings:**
- Integration patterns with external APIs
- Voting/prioritization UI
- Changelog generation
- Feedback collection workflows
- AI-assisted feature suggestions

---

### convex-v1 (Midday Port) - Financial Dashboard Master

**Why it's valuable:**
- Official Convex example of complex financial app
- Receipt scanning with AI
- Bank integrations
- Invoice management with real-time sync
- Team collaboration on financial data

**When to reference:**
```
✅ Phase 5: Invoice generation and management
✅ Phase 5: Receipt/expense tracking with AI
✅ Phase 6: Financial dashboard visualizations
✅ Phase 8: Bank/payment integrations
✅ All phases: Advanced Convex patterns
```

**Key learnings:**
```typescript
// v1/convex/
- Financial data models
- Real-time transaction sync
- Receipt AI processing
- Invoice generation workflows
- Team-based financial access control
- Bank integration patterns

// v1/app/
- Financial dashboard UI
- Transaction visualization
- Invoice management interface
- Receipt upload/preview
```

**Convex patterns to extract:**
- Complex queries with multiple indexes
- Real-time aggregations
- File upload handling
- Background job processing
- Webhook management

---

## 🎯 Decision Matrix: Which Repo for What?

### Starting a new feature module?
1. Check `next-forge` for monorepo structure
2. Check `eververse` if it has similar feature (built on next-forge + Convex)
3. Check `v1` for Convex patterns
4. Check `ever-gauzy`/`ever-teams` for detailed business logic

### Building financial features?
1. **Start with `v1`** - Modern Convex patterns
2. Fall back to `ever-gauzy` - Comprehensive but older stack

### Building time tracking?
1. **Start with `ever-teams`** - Modern, focused
2. Reference `ever-gauzy` for advanced features

### Building dashboards/BI?
1. **Start with `v1`** - Financial dashboard patterns
2. Reference `free-nextjs-admin-dashboard` - UI components
3. Reference `ever-gauzy` - Complex analytics

### Setting up monorepo?
1. **Start with `next-forge`** - Production-proven
2. Reference `next-enterprise` - Clean structure
3. Reference `ever-gauzy` - Large-scale example

### Need AI integration patterns?
1. **Start with `v1`** - Receipt AI scanning
2. Reference `eververse` - AI-assisted decisions
3. Build custom with your AI integrations

---

## 📊 Repository Comparison Matrix

| Feature | next-forge | eververse | v1 | ever-gauzy | convex-saas |
|---------|-----------|-----------|----|-----------| ------------|
| **Convex Backend** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Monorepo** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Production-Ready** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Financial Features** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Time Tracking** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **AI Integration** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Dev Tool Integrations** | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Email Templates** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Design System** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multi-tenant** | ❌ | ✅ | ✅ | ✅ | ✅ |

---

**Updated:** Added next-forge, eververse, and v1 (convex-v1) to reference collection
**Total Repos:** 11 comprehensive reference implementations
