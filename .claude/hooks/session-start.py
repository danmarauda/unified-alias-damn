#!/usr/bin/env python3
"""
Claude Code Session Start Hook - ALIAS Hivemind V3 Observability

Sends session initialization event to the observability dashboard.
Automatically triggered by Claude Code when a new session starts.

Environment Variables:
- SESSION_ID: Unique session identifier (auto-generated if not set)
- CONVEX_URL: Convex deployment URL (default: http://localhost:3000)
"""

import os
import sys
import json
import uuid
from urllib.request import urlopen, Request
from urllib.error import URLError

# Configuration
CONVEX_URL = os.getenv("CONVEX_URL", "http://localhost:3000")
INGEST_ENDPOINT = f"{CONVEX_URL}/api/observability/ingest"
SESSION_ID = os.getenv("SESSION_ID", f"session-{uuid.uuid4().hex[:12]}")

# Save session ID to environment for subsequent hooks
print(f"export SESSION_ID={SESSION_ID}", file=sys.stdout)

def send_event(event_data):
    """Send event to Convex observability endpoint"""
    try:
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Claude-Code-Hook/1.0",
        }

        request = Request(
            INGEST_ENDPOINT,
            data=json.dumps(event_data).encode("utf-8"),
            headers=headers,
            method="POST",
        )

        with urlopen(request, timeout=5) as response:
            if response.status == 200:
                print(f"✅ Session started: {SESSION_ID}", file=sys.stderr)
                return True
            else:
                print(f"⚠️  Unexpected response: {response.status}", file=sys.stderr)
                return False

    except URLError as e:
        print(f"⚠️  Failed to send event: {e}", file=sys.stderr)
        print(f"💡 Make sure Convex is running at {CONVEX_URL}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"❌ Error in session-start hook: {e}", file=sys.stderr)
        return False

def main():
    """Main hook execution"""
    # Get session information from environment
    user = os.getenv("USER", "unknown")
    cwd = os.getcwd()
    project_name = os.path.basename(cwd)

    # Build event payload
    event = {
        "sessionId": SESSION_ID,
        "sourceApp": "claude-code",
        "eventType": "SessionStart",
        "action": f"Started Claude Code session in {project_name}",
        "status": "completed",
        "agentName": "claude-code-orchestrator",
        "metadata": {
            "hook": "session-start",
            "user": user,
            "cwd": cwd,
            "projectName": project_name,
        },
    }

    # Send event
    send_event(event)

    # Print session info for user
    print(f"\n🧠 ALIAS Hivemind V3 Observability Active", file=sys.stderr)
    print(f"📊 Dashboard: {CONVEX_URL}/observability", file=sys.stderr)
    print(f"🔗 Session ID: {SESSION_ID}\n", file=sys.stderr)

    # Exit successfully
    sys.exit(0)

if __name__ == "__main__":
    main()
