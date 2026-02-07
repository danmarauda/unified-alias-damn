# ALIAS Hivemind V3 Observability Hooks

These Claude Code hooks automatically send events to the observability dashboard for real-time monitoring of multi-agent workflows.

## Available Hooks

### `session-start.py`
Triggered when a new Claude Code session starts.
- Generates unique session ID
- Sends SessionStart event
- Prints session info to terminal

### `post-task.py`
Triggered after each task completion.
- Tracks task descriptions and outcomes
- Records execution duration
- Categorizes by event type (AgentSpawn, ToolUse, etc.)

### `post-edit.py`
Triggered after file modifications.
- Tracks file edits, creates, and deletes
- Categorizes by file type (TypeScript, Python, etc.)
- Associates with squadron (data, knowledge, validation)

## Configuration

Set environment variables in your shell or `.env` file:

```bash
# Required: Convex deployment URL
export CONVEX_URL="http://localhost:3000"  # Development
# export CONVEX_URL="https://your-app.convex.site"  # Production

# Optional: Custom session ID (auto-generated if not set)
export SESSION_ID="my-custom-session-id"
```

## Testing Hooks

Test individual hooks manually:

```bash
# Test session-start hook
export CONVEX_URL="http://localhost:3000"
./.claude/hooks/session-start.py

# Test post-task hook
export TASK_DESCRIPTION="Implemented user authentication"
export TASK_STATUS="completed"
export TASK_DURATION="5420"
./.claude/hooks/post-task.py

# Test post-edit hook
export FILE_PATH="/path/to/file.ts"
export EDIT_TYPE="modify"
./.claude/hooks/post-edit.py
```

## Enabling Hooks in Claude Code

Claude Code automatically runs hooks from `.claude/hooks/` directory when:
- Session starts → `session-start.py`
- Task completes → `post-task.py`
- File edited → `post-edit.py`

Hooks run asynchronously and **won't block Claude Code** if they fail.

## Dashboard Access

View real-time observability data at:
- **Local Development:** http://localhost:3000/observability
- **Production:** https://your-app.vercel.app/observability

## Troubleshooting

**Hooks not sending events?**
1. Verify Convex is running: `bunx convex dev`
2. Check CONVEX_URL environment variable
3. Test HTTP endpoint: `curl http://localhost:3000/api/observability/health`

**Permission denied?**
```bash
chmod +x .claude/hooks/*.py
```

**Want more verbose output?**
Hooks print to stderr. Check terminal output when running Claude Code.

## Integration with Hivemind V3

For full BIG 3 SUPER AGENT observability, run Hivemind V3 orchestrator:

```bash
cd /Users/alias/ALIAS-Clients/ARAPS-AEOS/alias-dotai
bun start  # Start Hivemind V3 with Voice + Browser + Multi-LLM
```

Hivemind V3 will automatically send:
- Voice command events (OpenAI Realtime API)
- Browser action events (Gemini 2.5 Flash)
- LLM routing decisions (OpenAI, Gemini, Claude)
- UCE neural activations (35 neurons)
- Squadron status updates (27 agents)
