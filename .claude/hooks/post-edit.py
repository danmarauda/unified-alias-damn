#!/usr/bin/env python3
"""
Claude Code Post-Edit Hook - ALIAS Hivemind V3 Observability

Sends file edit events to the observability dashboard after each file modification.
Automatically triggered by Claude Code when a file is edited.

Environment Variables:
- SESSION_ID: Unique session identifier (auto-generated if not set)
- CONVEX_URL: Convex deployment URL (default: http://localhost:3000)
- FILE_PATH: Path to the edited file (provided by Claude Code)
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
            return response.status == 200

    except URLError:
        return False
    except Exception:
        return False

def main():
    """Main hook execution"""
    # Get file information from environment
    file_path = os.getenv("FILE_PATH", "unknown")
    edit_type = os.getenv("EDIT_TYPE", "modify")  # create, modify, delete

    # Determine file type
    file_ext = os.path.splitext(file_path)[1]
    file_category = "code"

    if file_ext in [".ts", ".tsx", ".js", ".jsx"]:
        file_category = "typescript"
    elif file_ext in [".py"]:
        file_category = "python"
    elif file_ext in [".md", ".mdx"]:
        file_category = "documentation"
    elif file_ext in [".json", ".yaml", ".yml"]:
        file_category = "config"

    # Build event payload
    action = f"Edited {os.path.basename(file_path)}"
    if edit_type == "create":
        action = f"Created {os.path.basename(file_path)}"
    elif edit_type == "delete":
        action = f"Deleted {os.path.basename(file_path)}"

    event = {
        "sessionId": SESSION_ID,
        "sourceApp": "claude-code",
        "eventType": "ToolUse",
        "action": action,
        "status": "completed",
        "agentName": "code-editor",
        "squadron": "data",
        "payload": {
            "filePath": file_path,
            "fileType": file_category,
            "editType": edit_type,
        },
        "metadata": {
            "hook": "post-edit",
            "extension": file_ext,
        },
    }

    # Send event (don't block if it fails)
    send_event(event)

    # Exit successfully
    sys.exit(0)

if __name__ == "__main__":
    main()
