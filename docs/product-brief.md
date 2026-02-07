# Product Brief

> **Status:** In Progress - Phase 1 (Discovery)
> **Project:** ALIAS Super Admin Console
> **Parent Product:** AEOS (ALIAS Enterprise Operating System)
> **Last Updated:** 2025-12-20

## This Project: Super Admin Console

The **ALIAS Super Admin Console** is:

1. **Single Pane of Glass** - See EVERYTHING across the entire organization
2. **Executive Showcase** - Demonstrate to potential executives what's possible with AEOS
3. **Proof of Concept** - Shows what happens when:
   - Data is organized into a proper ontology
   - Data foundation is engineered correctly
   - AI operates within a well-structured environment

**Purpose:** Prove that with the right architecture (AEOS), you can have complete organizational visibility and AI that actually works.

### Key Visualization: 3D Globe

The **ALIAS Global Deployments Globe** (Three.js) displays:

| Layer | What It Shows |
|-------|---------------|
| **Clients** | Client deployments worldwide |
| **Agents** | AI agent instances running globally |
| **Internal** | ALIAS internal infrastructure |
| **External** | Third-party integrations & external deployments |

Real-time visualization of the entire ALIAS ecosystem across the globe - a powerful executive demo showing operational scale and reach.

---

## About ALIAS

ALIAS uses AEOS internally to run all our operations. We're now offering our products to help businesses of all sizes leverage AI to transform how they work.

### ALIAS Organization

| Division | Focus |
|----------|-------|
| **ALIAS** | Consulting & software engineering services |
| **ALIAS Labs** | AI/ML research & development, training models, delivering software & AI solutions |

### ALIAS Products

| Product | Type | Description |
|---------|------|-------------|
| **AEOS** | Flagship | Enterprise Operating System - AI-augmented operations platform |
| **AgentWorks** | Managed Service | Agents-as-a-Service - managed AI agent solutions |
| **The Toolbox** | Subscription | Business tools subscription - also serves as lead funnel for tailored solutions |

**AEOS is the flagship product** - this document focuses on AEOS.

### Product Ecosystem

```
                    ┌─────────────────────────────────────┐
                    │           ALIAS (Services)          │
                    │   Consulting • Software Engineering │
                    └─────────────────────────────────────┘
                                      │
                    ┌─────────────────────────────────────┐
                    │          ALIAS Labs (R&D)           │
                    │  AI/ML Research • Model Training    │
                    └─────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      AEOS       │       │   AgentWorks    │       │   The Toolbox   │
│   (Flagship)    │       │   (Managed)     │       │  (Subscription) │
│                 │       │                 │       │                 │
│ Enterprise OS   │       │ Agents-as-a-    │       │ Business Tools  │
│ Solo → Fortune  │       │ Service         │       │ Lead Funnel →   │
│ 500 scale       │       │                 │       │ Tailored Options│
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

## Problem Statement

Businesses of all sizes face critical operational challenges:

1. **Knowledge Fragmentation** - Institutional knowledge scattered across emails, documents, and siloed systems
2. **Manual Process Overhead** - Standard operating procedures requiring human execution with inconsistent quality
3. **Decision-Making Delays** - Lack of real-time insights and governance frameworks slow critical approvals
4. **AI Integration Barriers** - No unified framework for safely deploying AI assistance across operations
5. **Scaling Challenges** - Systems that work for small teams break down as organizations grow

---

## Target Market

**AEOS scales from solo entrepreneurs to global enterprises.**

### Market Segments

| Segment | Size | Key Needs |
|---------|------|-----------|
| **Solo / Startup** | 1-5 people | AI co-pilot from day one, automate early |
| **Small Business** | 5-50 people | Team coordination, process standardization |
| **Mid-Market** | 50-500 people | Governance, compliance, multi-team workflows |
| **Enterprise** | 500-5,000 people | Security, audit trails, SSO/SAML integration |
| **Global Enterprise** | 5,000+ people | Multi-region, Fortune 500 scale, custom SLAs |

---

## Target Users

### Primary Personas

**1. Solo Founder / Entrepreneur**
- Needs AI to multiply their capacity from day one
- Wants to build processes that scale as they grow
- Values simplicity and immediate productivity gains

**2. Small Business Owner / Team Lead**
- Manages growing team operations
- Needs standardized workflows without enterprise complexity
- Values affordability and ease of adoption

**3. Operations Manager (Mid-Market)**
- Manages daily workflow execution across teams
- Oversees SOP compliance and quality
- Monitors team performance metrics

**4. Executive / C-Suite (Enterprise)**
- Needs real-time operational visibility across the organization
- Requires governance controls and risk management
- Values strategic decision support and ROI metrics

**5. IT Administrator (Enterprise)**
- Manages user access and security at scale
- Configures SSO/SAML and system integrations
- Monitors system health and compliance

---

## Key Value Propositions

### 1. AI Operating Modes with Confidence-Based Routing
- **Autopilot Mode (>90% confidence)**: Full AI automation with human verification
- **Copilot Mode (70-90% confidence)**: AI drafts with human approval
- **Manual Mode (<70% confidence)**: Human-led with AI assistance

### 2. Belt System - Progressive Security Clearance
10-level martial arts-inspired progression:
- White → Yellow → Orange → Green → Blue → Purple → Brown → Black → Red (Master) → System
- Each level unlocks additional capabilities and access

### 3. Unified Context Engine (UCE)
- Central knowledge retrieval across all 12 organizational areas
- Real-time context injection for AI agents
- 35 neural network neurons for agent coordination

### 4. Decision Gates Framework
- Risk-based approval workflows
- Multi-level stakeholder sign-offs
- Audit trail and compliance logging

### 5. 70+ Automated SOPs
- Standardized procedures with automation levels
- Quality consistency across operations
- Reduced training overhead

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Knowledge retrieval time | <2 seconds | UCE query latency |
| SOP completion accuracy | 95%+ | Validation squadron scores |
| AI confidence average | >85% | Agent decision metrics |
| User adoption rate | 80% in 90 days | Active user tracking |
| Decision gate throughput | 50% faster | Approval cycle time |
| Security incident rate | Zero critical | Belt system violations |

---

## Constraints & Assumptions

### Technical Constraints
- **Stack**: Next.js 16 + Convex + WorkOS AuthKit (current implementation)
- **Target Stack**: Frappe backend integration (future)
- **Mobile**: Expo React Native (planned)
- **AI**: Multi-LLM via Vercel AI SDK v6 (15+ providers)

### Assumptions
- Users have basic digital literacy
- Organization has existing SOP documentation
- Minimum 10+ users for viable deployment
- Cloud deployment (Vercel/Netlify)

### Dependencies
- WorkOS for enterprise SSO/SAML
- Convex for real-time database
- MCP integration for AI agents
- Third-party LLM providers (OpenAI, Anthropic, etc.)

---

## Competitive Landscape

### Competitors by Segment

**Solo / Small Business:**
| Solution | Strengths | Gaps |
|----------|-----------|------|
| **Notion** | Knowledge management, free tier | No AI automation, no scaling path |
| **ClickUp** | All-in-one, affordable | AI is add-on, complex feature creep |
| **Asana** | Task management | Limited AI, enterprise-focused pricing |

**Mid-Market / Enterprise:**
| Solution | Strengths | Gaps |
|----------|-----------|------|
| **Monday.com** | Work management, integrations | Limited AI, no progressive trust |
| **ServiceNow** | Enterprise workflows | Complex, expensive, poor UX |
| **Salesforce** | CRM, ecosystem | Massive, expensive, overkill for ops |
| **Zapier + AI** | Automation | Fragmented, no unified context |

### ALIAS AEOS Differentiation

1. **AI-Native from Day One** - Built for AI from ground up, not bolted on
2. **Scales with You** - Same platform from 1 person to 10,000+ employees
3. **Progressive Trust Model** - Belt system creates earned autonomy as users prove capability
4. **Unified Context Engine** - Single source of truth for all AI interactions
5. **Decision Gates** - Governance framework that grows with your compliance needs
6. **Dogfooded Daily** - ALIAS runs on AEOS, so we feel every friction point

---

## 12-Area Knowledge Taxonomy

AEOS organizes knowledge across 12 core areas:

| # | Area | Description |
|---|------|-------------|
| 1 | Strategic Planning | Vision, mission, OKRs |
| 2 | Client Management | CRM, relationships, research |
| 3 | Project Delivery | Execution, milestones, resources |
| 4 | Knowledge Management | Documents, templates, SOPs |
| 5 | Financial Operations | Billing, invoicing, reporting |
| 6 | Human Resources | Team, training, performance |
| 7 | Technology & Systems | IT, integrations, security |
| 8 | Marketing & Business Dev | Pipeline, proposals, branding |
| 9 | Quality Assurance | Standards, audits, compliance |
| 10 | Risk Management | Governance, controls, incidents |
| 11 | Innovation & R&D | New capabilities, experiments |
| 12 | External Relations | Partners, vendors, regulators |

---

---

## Current Feature Map (Implemented)

### Dashboard & Visualization

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Home Dashboard** | ✅ Done | `/` | Main landing with overview widgets |
| **Dashboard View** | ✅ Done | `/dashboard` | Detailed metrics and stats |
| **3D Globe** | ✅ Done | Component | Global deployments visualization (Three.js) |
| **Network Overview** | ✅ Done | Widget | System health visualization |
| **Live Feed** | ✅ Done | Widget | Real-time activity stream |
| **Projects Summary** | ✅ Done | Widget | Project status overview |
| **Agent Activities** | ✅ Done | Widget | Agent action stream |
| **Leaderboard** | ✅ Done | Widget | Performance rankings |
| **AI Assist Panel** | ✅ Done | Widget | AI assistant interface |

### Agent Management (27 Agents)

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Agents Overview** | ✅ Done | `/agents` | All agents dashboard |
| **Agent Metrics** | ✅ Done | `/agents/metrics` | Performance analytics |
| **Agent Library** | ✅ Done | `/agents/library` | Agent catalog |
| **Agent Designer** | ✅ Done | `/agents/designer` | Build new agents |
| **Agent Management** | ✅ Done | `/agents/management` | Configure agents |
| **3 Squadrons** | ✅ Done | Backend | Data, Knowledge, Validation (9 each) |

### Observability (ALIAS Hivemind V3)

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Observability Dashboard** | ✅ Done | `/observability` | Event tracking hub |
| **Neural Network Viz** | ✅ Done | Component | 35 UCE neurons visualization |
| **Squadron Panel** | ✅ Done | Component | Squadron status tracking |
| **Event Timeline** | ✅ Done | Component | Real-time event stream |
| **Cost Tracker** | ✅ Done | Component | LLM cost monitoring |
| **Filter Panel** | ✅ Done | Component | Event filtering |
| **HTTP Endpoints** | ✅ Done | API | Ingest, neural, squadron, health |

### Client Management

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Client Profiles List** | ✅ Done | `/client-profiles` | All clients view |
| **Client Detail** | ✅ Done | `/client-profiles/[id]` | Single client view |
| **New Client** | ✅ Done | `/client-profiles/new` | Create client |
| **Full-text Search** | ✅ Done | Backend | Search by client name |
| **Status Tracking** | ✅ Done | Backend | Active, prospect, inactive |

### Research Workflow

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Research Hub** | ✅ Done | `/research-hub` | All research view |
| **New Research** | ✅ Done | `/research-hub/new` | Create research |
| **Approval Workflow** | ✅ Done | Backend | Draft → Approval → Published |
| **QA Status** | ✅ Done | Backend | Quality assurance tracking |
| **Quality Scores** | ✅ Done | Backend | Fact-check, risk, quality scores |

### Projects

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Projects List** | ✅ Done | `/projects` | All projects |
| **Project Detail** | ✅ Done | `/projects/[id]` | Single project view |
| **Project Activities** | ✅ Done | `/projects/activities` | Activity timeline |
| **Performance Metrics** | ✅ Done | Backend | Velocity, quality, budget |

### Knowledge & Ontology

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Ontology Editor** | ✅ Done | `/ontology` | Visual ontology builder |
| **Ontology Visualizer** | ✅ Done | Component | Graph visualization |
| **Collaborative Mode** | ✅ Done | Component | Real-time collaboration |
| **Knowledge Base** | ✅ Done | `/knowledge-base` | Knowledge repository |

### Skills Management

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Skills Manager** | ✅ Done | `/skills` | Skill library UI |
| **Skill Builder** | ✅ Done | Component | Create new skills |
| **Skill Versions** | ✅ Done | Component | Version history |
| **Skill Analytics** | ✅ Done | Component | Usage analytics |
| **Scraping Jobs** | ✅ Done | Backend | Background doc scraping |

### AI Demo (Multi-LLM)

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **AI Demo Page** | ✅ Done | `/ai-demo` | Multi-provider showcase |
| **Chat Demo** | ✅ Done | Component | Interactive chat |
| **15+ Providers** | ✅ Done | Backend | OpenAI, Anthropic, Google, etc. |

### Authentication & Users

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **WorkOS SSO/SAML** | ✅ Done | Auth | Enterprise authentication |
| **User Profile** | ✅ Done | `/profile` | User settings |
| **Session Management** | ✅ Done | Backend | Secure sessions |

### Infrastructure

| Feature | Status | Route | Description |
|---------|--------|-------|-------------|
| **Deploy Pipeline** | ✅ Done | `/deploy` | Deployment management |
| **Demo Data Generator** | ✅ Done | `/generate-data` | Seed data tool |
| **Run Node** | ✅ Done | `/run-node` | Node execution utility |

### Data Foundation (Convex - 17 Tables)

| Table | Purpose |
|-------|---------|
| `users` | WorkOS user profiles |
| `stats` | Dashboard metrics |
| `projectActivities` | Globe visualization data |
| `recentActivities` | Activity feed |
| `projectPerformance` | Project metrics |
| `agentActivities` | Agent action log |
| `agentMetrics` | Agent analytics |
| `agentCalls` | Call tracking |
| `skills` | Skill definitions |
| `skillVersions` | Version history |
| `skillScrapingJobs` | Background jobs |
| `skillCategories` | Skill categories |
| `clientProfiles` | Client data |
| `clientResearch` | Research workflow |
| `observabilityEvents` | Event stream |
| `uceNeuralActivations` | Neural network state |
| `squadronStatus` | Squadron tracking |

---

## Next Steps (Discovery Phase)

- [ ] Conduct stakeholder interviews
- [ ] Document detailed user journeys
- [ ] Map current SOP inventory
- [ ] Prioritize MVP feature set
- [ ] Define phased rollout plan
