# ALIAS Hivemind V3 Observability - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Start Convex Backend (Terminal 1)

```bash
cd /Users/alias/Desktop/website/unified-alias-damn
bunx convex dev
```

**Expected output:**
```
✔ Convex functions ready!
✔ HTTP endpoints live at http://localhost:3000/api
✔ Dashboard: https://your-deployment.convex.cloud
```

### Step 2: Start Next.js Dashboard (Terminal 2)

```bash
cd /Users/alias/Desktop/website/unified-alias-damn
bun run dev
```

**Access dashboard at:** http://localhost:3000/observability

### Step 3: Test Observability (Terminal 3)

```bash
# Set environment variable
export CONVEX_URL="http://localhost:3000"

# Test health endpoint
curl http://localhost:3000/api/observability/health

# Send test event
curl -X POST http://localhost:3000/api/observability/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-' $(date +%s) '",
    "sourceApp": "test",
    "eventType": "AgentSpawn",
    "action": "Test agent spawned",
    "status": "completed"
  }'
```

**Check dashboard - you should see the event appear instantly! 🎉**

---

## 🔗 Hivemind V3 Integration (Optional)

### Enable Auto-Observability in Hivemind V3

1. **Add to package.json:**
```bash
cd /Users/alias/ALIAS-Clients/ARAPS-AEOS/alias-dotai
npm install node-fetch  # If not already installed
```

2. **Update orchestrator:**
```typescript
// In scripts/orchestration/hivemind-orchestrator-v3.ts
import { initObservability } from '../observability/client';

// At startup
const obs = initObservability({
  baseUrl: 'http://localhost:3000',
  sourceApp: 'hivemind-v3',
});

await obs.sessionStart();
```

3. **Start Hivemind V3:**
```bash
cd /Users/alias/ALIAS-Clients/ARAPS-AEOS/alias-dotai
export CONVEX_URL="http://localhost:3000"
bun start
```

**Now all BIG 3 events (Voice, Browser, Multi-LLM) will stream to the dashboard in real-time!**

---

## 📊 What You'll See

### Event Timeline
- Voice commands (OpenAI Realtime API)
- Browser actions (Gemini 2.5 Flash)
- LLM routing decisions
- Agent spawning events
- Real-time status updates

### Squadron Panel
- **Data Squadron** - 9 agents (indexing, parsing, validation)
- **Knowledge Squadron** - 9 agents (retrieval, semantic search)
- **Validation Squadron** - 9 agents (QA, testing)

### Neural Network (35 UCE Neurons)
- Voice layer (5 neurons)
- Browser layer (5 neurons)
- LLM layer (5 neurons)
- Agents layer (5 neurons)
- Core layer (9 neurons)
- Integration layer (6 neurons)

### Cost Tracker
- OpenAI: $30/M tokens (GPT-4o)
- Gemini: $1/M tokens (Flash - cheapest!)
- Claude: $15/M tokens (Sonnet)

**Multi-LLM routing saves 70% on costs!**

---

## 🧪 Testing

### Test Claude Code Hooks

```bash
cd /Users/alias/Desktop/website/unified-alias-damn
export CONVEX_URL="http://localhost:3000"

# Test session start
./.claude/hooks/session-start.py

# Test task completion
export TASK_DESCRIPTION="Implemented authentication"
export TASK_STATUS="completed"
export TASK_DURATION="3500"
./.claude/hooks/post-task.py

# Check dashboard for events
open http://localhost:3000/observability
```

### Test Hivemind V3 Events

```bash
cd /Users/alias/ALIAS-Clients/ARAPS-AEOS/alias-dotai

# Send voice command event
curl -X POST http://localhost:3000/api/observability/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "hivemind-test",
    "sourceApp": "hivemind-v3",
    "eventType": "VoiceCommand",
    "action": "Voice: Generate a React component",
    "agentName": "voice-controller",
    "llmProvider": "openai",
    "llmModel": "gpt-4o-realtime",
    "tokensUsed": 1250,
    "costEstimate": 0.0375,
    "status": "completed"
  }'

# Send neural activation
curl -X POST http://localhost:3000/api/observability/neural \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "hivemind-test",
    "neuronId": "uce-01",
    "neuronName": "voice-intent-recognition",
    "activationLevel": 0.85,
    "weight": 1.2,
    "context": "Processing user voice command"
  }'
```

**Events should appear on dashboard within 100ms!**

---

## 🎯 Next Steps

1. ✅ **Dashboard is live** - http://localhost:3000/observability
2. ✅ **Backend is ready** - Convex real-time subscriptions active
3. ✅ **Hooks are installed** - Claude Code auto-tracking enabled
4. ⏭️ **Integrate Hivemind V3** - Copy patterns from `example-integration.ts`
5. ⏭️ **Deploy to production** - See `HIVEMIND_V3_OBSERVABILITY.md`

---

## 🔍 Troubleshooting

**Dashboard shows "Loading..."?**
- Check Convex is running: `bunx convex dev`
- Verify URL: http://localhost:3000/observability

**No events appearing?**
- Test health: `curl http://localhost:3000/api/observability/health`
- Check CONVEX_URL environment variable
- Verify firewall isn't blocking port 3000

**Hooks not working?**
- Make executable: `chmod +x .claude/hooks/*.py`
- Test manually: `./.claude/hooks/session-start.py`
- Check Python is installed: `python3 --version`

---

## 📚 Documentation

- **Full Guide:** `docs/HIVEMIND_V3_OBSERVABILITY.md`
- **Hook Documentation:** `.claude/hooks/README.md`
- **Integration Examples:** `alias-dotai/scripts/observability/example-integration.ts`

---

**Built with:** Convex + Next.js 16 + React 19 + Reaviz + Motion

**Ready for:** BIG 3 SUPER AGENT (Voice + Browser + Multi-LLM) 🚀
