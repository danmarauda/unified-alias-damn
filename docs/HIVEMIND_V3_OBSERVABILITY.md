# ALIAS Hivemind V3 Observability - Integration Guide

## 🎯 Overview

Complete real-time observability dashboard for BIG 3 SUPER AGENT (Voice + Browser + Multi-LLM) with Claude Code integration.

**Key Features:**
- 🔴 **Real-time Event Timeline** - Auto-scroll chat-style feed
- 🚀 **Squadron Status** - 27 agents across 3 squadrons (Data, Knowledge, Validation)
- 🧠 **UCE Neural Network** - 35 neurons visualization with heatmaps
- 💰 **Cost Tracking** - LLM cost breakdown (OpenAI, Gemini, Claude)
- 🔍 **Advanced Filtering** - Session, source, event type, squadron, status
- 🪝 **Claude Code Hooks** - Automatic event ingestion

---

## 📦 What Was Built

### Backend (Convex)

**Schema:**
- `observabilityEvents` - Main event stream
- `uceNeuralActivations` - 35 neuron tracking
- `squadronStatus` - Squadron metrics

**Mutations & Queries:**
- `convex/observability.ts` - 15 functions total
  - 6 mutations (ingestEvent, batch operations)
  - 9 queries (real-time subscriptions)

**HTTP Endpoints:**
- `POST /api/observability/ingest` - Event ingestion
- `POST /api/observability/neural` - Neural activations
- `POST /api/observability/squadron` - Squadron updates
- `GET /api/observability/health` - Health check

### Frontend (Next.js + React)

**Components:**
```
app/components/observability/
├── PlaygroundTile.tsx       # Reusable container
├── EventTimeline.tsx        # Real-time event feed
├── SquadronPanel.tsx        # RadialGauge visualization
├── NeuralNetworkViz.tsx     # 35-neuron heatmap
├── CostTracker.tsx          # BarChart cost breakdown
└── FilterPanel.tsx          # Filter controls
```

**Dashboard:**
- `app/(dashboard)/observability/page.tsx` - Main 3-column layout

### Claude Code Hooks

```
.claude/hooks/
├── session-start.py    # Session initialization
├── post-task.py        # Task completion tracking
├── post-edit.py        # File modification tracking
└── README.md           # Hook documentation
```

---

## 🚀 Quick Start

### 1. Start Convex Backend

```bash
cd /Users/alias/Desktop/website/unified-alias-damn
bunx convex dev
```

This will:
- Start local Convex server
- Deploy schema and functions
- Enable HTTP endpoints
- Open dashboard at http://localhost:3000

### 2. Start Next.js Development Server

```bash
bun run dev
```

Access dashboard at:
**http://localhost:3000/observability**

### 3. Configure Claude Code Hooks

```bash
# Set environment variable for hooks
export CONVEX_URL="http://localhost:3000"

# Hooks will auto-run when you use Claude Code
# Events will appear in real-time on the dashboard
```

---

## 🔧 Hivemind V3 Integration

To integrate with the existing Hivemind V3 orchestrator at `/Users/alias/ALIAS-Clients/ARAPS-AEOS/alias-dotai`:

### Option 1: HTTP Client Integration (Recommended)

Add to `scripts/orchestration/hivemind-orchestrator-v3.ts`:

```typescript
import fetch from 'node-fetch';

const OBSERVABILITY_URL = process.env.CONVEX_URL || 'http://localhost:3000';

async function sendEvent(event: {
  sessionId: string;
  sourceApp: string;
  eventType: string;
  action: string;
  agentName?: string;
  squadron?: string;
  llmProvider?: string;
  llmModel?: string;
  tokensUsed?: number;
  costEstimate?: number;
  status?: string;
  duration?: number;
  payload?: any;
  metadata?: any;
}) {
  try {
    const response = await fetch(`${OBSERVABILITY_URL}/api/observability/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.warn('Failed to send observability event:', response.statusText);
    }
  } catch (error) {
    // Don't block orchestrator if observability fails
    console.warn('Observability unavailable:', error);
  }
}

// Example: Send voice command event
async function handleVoiceCommand(command: string) {
  const sessionId = process.env.SESSION_ID || `session-${Date.now()}`;

  await sendEvent({
    sessionId,
    sourceApp: 'hivemind-v3',
    eventType: 'VoiceCommand',
    action: `Voice: ${command}`,
    agentName: 'voice-controller',
    llmProvider: 'openai',
    llmModel: 'gpt-4o-realtime',
    status: 'in_progress',
  });

  // ... process voice command ...

  // Update status on completion
  await sendEvent({
    sessionId,
    sourceApp: 'hivemind-v3',
    eventType: 'VoiceCommand',
    action: `Voice: ${command}`,
    agentName: 'voice-controller',
    llmProvider: 'openai',
    llmModel: 'gpt-4o-realtime',
    tokensUsed: 1250,
    costEstimate: 0.0375,
    status: 'completed',
    duration: 850,
  });
}
```

### Option 2: Batch Event Emission

For high-throughput scenarios, batch events:

```typescript
const eventBatch: any[] = [];

function queueEvent(event: any) {
  eventBatch.push(event);

  // Flush every 10 events or 5 seconds
  if (eventBatch.length >= 10) {
    flushEvents();
  }
}

async function flushEvents() {
  if (eventBatch.length === 0) return;

  try {
    await fetch(`${OBSERVABILITY_URL}/api/observability/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch: true,
        events: eventBatch,
      }),
    });

    eventBatch.length = 0;
  } catch (error) {
    console.warn('Batch observability failed:', error);
  }
}

// Auto-flush every 5 seconds
setInterval(flushEvents, 5000);
```

### Key Integration Points

**1. Voice Controller (`scripts/voice/voice-orchestration-controller.ts`):**
```typescript
// Session start
sendEvent({ eventType: 'SessionStart', sourceApp: 'voice-controller', ... });

// Voice command processing
sendEvent({ eventType: 'VoiceCommand', llmProvider: 'openai', ... });
```

**2. Browser Validator (`scripts/browser/browser-validation-controller.ts`):**
```typescript
// Browser action
sendEvent({ eventType: 'BrowserAction', llmProvider: 'gemini', ... });

// Screenshot analysis
sendEvent({ eventType: 'ToolUse', action: 'Analyzed screenshot', ... });
```

**3. Multi-LLM Router (`scripts/llm/multi-llm-router.ts`):**
```typescript
// LLM routing decision
sendEvent({
  eventType: 'LLMRoute',
  llmProvider: selectedProvider,
  llmModel: selectedModel,
  tokensUsed: response.usage.total_tokens,
  costEstimate: calculateCost(selectedProvider, response.usage.total_tokens),
});
```

**4. UCE Neural Network:**
```typescript
// Neural activation
await fetch(`${OBSERVABILITY_URL}/api/observability/neural`, {
  method: 'POST',
  body: JSON.stringify({
    sessionId,
    neuronId: 'uce-01',
    neuronName: 'voice-intent-recognition',
    activationLevel: 0.85,
    weight: 1.2,
    context: 'User requested code generation',
  }),
});
```

**5. Squadron Management:**
```typescript
// Squadron status update
await fetch(`${OBSERVABILITY_URL}/api/observability/squadron`, {
  method: 'POST',
  body: JSON.stringify({
    squadronName: 'data',
    activeAgents: 7,
    totalAgents: 9,
    currentTasks: ['indexing', 'parsing', 'validation'],
    performanceScore: 87.5,
  }),
});
```

---

## 📊 Event Types Reference

### Core Event Types

| Event Type | Description | Source Apps |
|------------|-------------|-------------|
| `SessionStart` | New session initialized | claude-code, hivemind-v3 |
| `SessionEnd` | Session terminated | claude-code, hivemind-v3 |
| `VoiceCommand` | Voice input processed | voice-controller |
| `BrowserAction` | Browser automation step | browser-validator |
| `LLMRoute` | LLM provider selection | llm-router |
| `AgentSpawn` | New agent created | hivemind-v3 |
| `NeuralActivation` | UCE neuron fired | hivemind-v3 |
| `ToolUse` | Tool execution | claude-code, hivemind-v3 |

### Squadron Categories

- **data** - Data processing, indexing, parsing (9 agents)
- **knowledge** - Knowledge retrieval, semantic search (9 agents)
- **validation** - Quality assurance, testing (9 agents)

### LLM Providers

- **openai** - GPT-4o, GPT-4o-mini ($15-30/M tokens)
- **gemini** - Gemini 2.5 Flash ($1/M tokens)
- **claude** - Claude Sonnet ($15/M tokens)

---

## 🧪 Testing

### 1. Test HTTP Endpoints

```bash
# Health check
curl http://localhost:3000/api/observability/health

# Send test event
curl -X POST http://localhost:3000/api/observability/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "sourceApp": "test-client",
    "eventType": "AgentSpawn",
    "action": "Spawned test agent",
    "status": "completed"
  }'

# Send neural activation
curl -X POST http://localhost:3000/api/observability/neural \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "neuronId": "uce-01",
    "neuronName": "voice-intent-recognition",
    "activationLevel": 0.75,
    "weight": 1.0,
    "context": "Test activation"
  }'
```

### 2. Test Claude Code Hooks

```bash
# Test session start
export CONVEX_URL="http://localhost:3000"
./.claude/hooks/session-start.py

# Test task completion
export TASK_DESCRIPTION="Implemented authentication"
export TASK_STATUS="completed"
export TASK_DURATION="3500"
./.claude/hooks/post-task.py

# Check dashboard for events
open http://localhost:3000/observability
```

### 3. Test Hivemind V3 Integration

```bash
cd /Users/alias/ALIAS-Clients/ARAPS-AEOS/alias-dotai
export CONVEX_URL="http://localhost:3000"
export SESSION_ID="hivemind-test-$(date +%s)"

bun start  # Start Hivemind V3

# In another terminal, watch dashboard
open http://localhost:3000/observability
```

Expected events:
1. SessionStart from Hivemind V3
2. VoiceCommand events (if using voice)
3. BrowserAction events (if using browser automation)
4. LLMRoute events (multi-LLM routing decisions)
5. NeuralActivation events (UCE neurons firing)
6. Squadron status updates

---

## 🎨 UI Customization

### Color Schemes

Modify colors in components for branding:

```typescript
// EventTimeline.tsx - Event type colors
const eventTypeColors: Record<string, string> = {
  VoiceCommand: "bg-blue-500/10 text-blue-600",    // Your brand blue
  BrowserAction: "bg-purple-500/10 text-purple-600",
  LLMRoute: "bg-green-500/10 text-green-600",
};

// SquadronPanel.tsx - Squadron colors
const squadronColors: Record<string, string> = {
  data: "#3b82f6",      // Blue
  knowledge: "#8b5cf6",  // Purple
  validation: "#10b981", // Green
};
```

### Layout Customization

Modify `app/(dashboard)/observability/page.tsx` grid:

```typescript
// 2-column layout
<main className="grid grid-cols-1 lg:grid-cols-2">

// 4-column layout
<main className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
```

---

## 🔐 Production Deployment

### 1. Update Environment Variables

```bash
# .env.production
CONVEX_URL=https://your-app.convex.site
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.site
```

### 2. Deploy Convex

```bash
bunx convex deploy --prod
```

### 3. Deploy Next.js

```bash
# Vercel
vercel --prod

# Or configure in package.json
bun run build
```

### 4. Update Hook Configuration

```bash
# Update .claude/hooks/session-start.py
CONVEX_URL = os.getenv("CONVEX_URL", "https://your-app.convex.site")
```

---

## 📈 Performance Metrics

**Expected Performance:**
- Event ingestion latency: < 50ms
- Real-time update latency: < 100ms
- Dashboard load time: < 2 seconds
- Concurrent sessions: 1000+ (Convex scales automatically)

**Cost Estimates:**
- Convex Free Tier: Up to 1M function calls/month
- Vercel Hobby: Free for hobby projects
- Total estimated cost: $0-10/month for small teams

---

## 🐛 Troubleshooting

### Dashboard shows "No events yet"

1. Check Convex is running: `bunx convex dev`
2. Verify hooks are executable: `chmod +x .claude/hooks/*.py`
3. Test HTTP endpoint: `curl http://localhost:3000/api/observability/health`
4. Check CONVEX_URL environment variable

### Hooks not sending events

```bash
# Test hooks manually
export CONVEX_URL="http://localhost:3000"
export SESSION_ID="test-session"
./.claude/hooks/session-start.py

# Check for errors in stderr output
```

### Real-time updates not working

1. Verify Convex client is connected
2. Check browser console for errors
3. Ensure Convex deployment is accessible
4. Test with `convex dashboard` command

---

## 🎯 Next Steps

### Completed ✅
1. Convex schema with 3 tables
2. 15 mutations and queries
3. 4 HTTP endpoints
4. 6 React components (PlaygroundTile, EventTimeline, SquadronPanel, NeuralNetworkViz, CostTracker, FilterPanel)
5. Main observability dashboard page
6. 3 Claude Code hooks (session-start, post-task, post-edit)

### Remaining Tasks 🚧

**Phase 1: Hivemind V3 Integration** (30 minutes)
- [ ] Add `sendEvent()` function to `hivemind-orchestrator-v3.ts`
- [ ] Emit VoiceCommand events from voice controller
- [ ] Emit BrowserAction events from browser validator
- [ ] Emit LLMRoute events from multi-LLM router
- [ ] Test end-to-end event flow

**Phase 2: UCE Neural Integration** (20 minutes)
- [ ] Add neural activation tracking to UCE layer
- [ ] Map 35 neurons to event triggers
- [ ] Test heatmap visualization

**Phase 3: Squadron Status** (15 minutes)
- [ ] Track agent lifecycle in squadrons
- [ ] Update performance scores
- [ ] Test RadialGauge displays

**Phase 4: Testing & Validation** (25 minutes)
- [ ] End-to-end testing with real Hivemind V3 session
- [ ] Verify all 35 neurons visualize correctly
- [ ] Confirm cost tracking accuracy
- [ ] Load test with 100+ events
- [ ] Browser compatibility testing

**Phase 5: Production Deployment** (Optional)
- [ ] Deploy Convex to production
- [ ] Deploy Next.js to Vercel
- [ ] Configure production environment variables
- [ ] Set up monitoring and alerts

---

## 📚 Additional Resources

- **Convex Documentation:** https://docs.convex.dev
- **Reaviz Charts:** https://reaviz.io
- **LiveKit Agents Playground:** https://github.com/livekit/agents-playground
- **Claude Code Hooks:** https://docs.claude.com/en/docs/claude-code/hooks

---

**Built with:** Convex + Next.js 16 + React 19 + Reaviz + Motion (Framer Motion fork)

**Integration:** Claude Code hooks + Hivemind V3 BIG 3 SUPER AGENT
