#!/usr/bin/env python3
"""
Claude Code Post-Task Hook - ALIAS Hivemind V3 Observability

Sends task completion events to the observability dashboard after each task.
Automatically triggered by Claude Code when a task completes.

Environment Variables:
- SESSION_ID: Unique session identifier (auto-generated if not set)
- CONVEX_URL: Convex deployment URL (default: http://localhost:3000)
"""

import os
import sys
import json
import time
import uuid
import subprocess
from urllib.request import urlopen, Request
from urllib.error import URLError

# Configuration
CONVEX_URL = os.getenv("CONVEX_URL", "http://localhost:3000")
INGEST_ENDPOINT = f"{CONVEX_URL}/api/observability/ingest"
SESSION_ID = os.getenv("SESSION_ID", f"session-{uuid.uuid4().hex[:12]}")

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
                print(f"✅ Event sent to observability dashboard", file=sys.stderr)
                return True
            else:
                print(f"⚠️  Unexpected response: {response.status}", file=sys.stderr)
                return False

    except URLError as e:
        print(f"⚠️  Failed to send event: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"❌ Error in post-task hook: {e}", file=sys.stderr)
        return False

def main():
    """Main hook execution"""
    # Get task information from environment
    task_description = os.getenv("TASK_DESCRIPTION", "Unknown task")
    task_status = os.getenv("TASK_STATUS", "completed")  # completed, failed
    task_duration = os.getenv("TASK_DURATION", "0")  # milliseconds

    # Determine event type based on task description
    event_type = "AgentSpawn"
    if "test" in task_description.lower():
        event_type = "ToolUse"
    elif "code" in task_description.lower() or "implement" in task_description.lower():
        event_type = "AgentSpawn"
    elif "fix" in task_description.lower() or "debug" in task_description.lower():
        event_type = "ToolUse"

    # Build event payload
    event = {
        "sessionId": SESSION_ID,
        "sourceApp": "claude-code",
        "eventType": event_type,
        "action": task_description,
        "status": task_status,
        "duration": int(task_duration) if task_duration.isdigit() else 0,
        "agentName": "claude-code-agent",
        "metadata": {
            "hook": "post-task",
            "cwd": os.getcwd(),
        },
    }

    # Send event
    send_event(event)

    # Exit successfully (don't block Claude Code)
    sys.exit(0)

if __name__ == "__main__":
    main()
