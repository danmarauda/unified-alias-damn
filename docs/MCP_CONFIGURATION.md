# MCP (Model Context Protocol) Configuration Guide

## Current Configuration

### Root `mcp.json` File
Located at: `/Users/alias/Desktop/unified-alias-damn/mcp.json`

```json
{
  "mcpServers": {
    "morph": {
      "url": "http://localhost:3684/mcp"
    }
  }
}
```

**Status**: ⚠️ **Server not responding** - Port 3684 is not active

**Note**: This file may be for reference or a different tool. Cursor IDE uses its own configuration location.

---

## Cursor IDE MCP Configuration

### Configuration Location

Cursor IDE uses a different configuration location than the root `mcp.json`:

**Primary locations** (check in order):
1. **Project root**: `.cursor_mcp.json` (project-specific)
2. **User config**: `~/.config/cursor/mcp.json` (macOS/Linux)
3. **Alternative**: `~/.cursor/mcp.json` (some installations)
4. **Windows**: `%APPDATA%\Cursor\mcp.json`

**Note**: Cursor IDE settings can also be accessed via:
- Settings → MCP (in Cursor IDE)
- This opens/creates the appropriate config file

### OpenCode MCP Server Setup

Based on OpenCode documentation, the correct configuration format is:

```json
{
  "mcpServers": {
    "opencode": {
      "command": "npx",
      "args": ["-y", "opencode-mcp"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Note**: Replace `"your-api-key-here"` with your actual OpenCode API key.

### Morph MCP Server (Current)

If you want to use the Morph server, it should be configured as:

```json
{
  "mcpServers": {
    "morph": {
      "command": "node",
      "args": ["path/to/morph-server.js"],
      "cwd": "/path/to/morph-server"
    }
  }
}
```

**OR** if it's an HTTP server (current format):

```json
{
  "mcpServers": {
    "morph": {
      "url": "http://localhost:3684/mcp"
    }
  }
}
```

**Issue**: The server at `http://localhost:3684/mcp` is not running.

---

## Verification Steps

### 1. Check if Morph Server is Running

```bash
# Check if port 3684 is in use
lsof -i :3684

# Test server endpoint
curl http://localhost:3684/mcp
```

### 2. Verify Cursor MCP Configuration

1. Open Cursor IDE
2. Go to Settings → MCP
3. Check if servers are listed and enabled
4. Look for any error messages

### 3. Test MCP Server Connection

In Cursor, you can test by:
- Asking: "List all available MCP tools"
- Checking the MCP status in settings
- Looking for MCP-related errors in the console

---

## Recommended Configuration

### For OpenCode Integration

Create or update `~/.config/cursor/mcp.json`:

```json
{
  "mcpServers": {
    "opencode": {
      "command": "npx",
      "args": ["-y", "opencode-mcp"],
      "env": {
        "API_KEY": "your-opencode-api-key"
      }
    },
    "morph": {
      "url": "http://localhost:3684/mcp"
    }
  }
}
```

### For Morph Server (if using HTTP)

1. **Start the Morph server** on port 3684
2. **Verify it's running**: `curl http://localhost:3684/mcp`
3. **Add to Cursor config**: Use the URL format shown above

### For Morph Server (if using command)

```json
{
  "mcpServers": {
    "morph": {
      "command": "node",
      "args": ["/path/to/morph-server.js"],
      "cwd": "/path/to/morph-server"
    }
  }
}
```

---

## Troubleshooting

### Issue: MCP Server Not Loading

**Symptoms**:
- MCP tools don't appear in Cursor
- "Connection failed" errors
- Server not responding

**Solutions**:

1. **Check server is running**:
   ```bash
   lsof -i :3684
   ```

2. **Verify configuration file location**:
   ```bash
   # macOS
   cat ~/.config/cursor/mcp.json
   # or
   cat ~/.cursor/mcp.json
   ```

3. **Check Cursor logs**:
   - macOS: `~/Library/Logs/Cursor/`
   - Linux: `~/.config/cursor/logs/`
   - Windows: `%APPDATA%\Cursor\logs\`

4. **Restart Cursor completely**:
   - Quit Cursor (don't just close window)
   - Reopen Cursor

5. **Verify JSON syntax**:
   ```bash
   cat ~/.config/cursor/mcp.json | python3 -m json.tool
   ```

### Issue: OpenCode MCP Not Working

**Solutions**:

1. **Verify API key is set**:
   ```json
   {
     "env": {
       "API_KEY": "your-actual-api-key"
     }
   }
   ```

2. **Test npx command manually**:
   ```bash
   npx -y opencode-mcp
   ```

3. **Check network connectivity**:
   ```bash
   curl https://api.opencode.dev/health
   ```

### Issue: Morph Server Connection Failed

**Solutions**:

1. **Start the Morph server**:
   ```bash
   # Find the server startup command
   # Usually something like:
   node morph-server.js
   # or
   npm start
   ```

2. **Check firewall settings**:
   - Ensure port 3684 is not blocked
   - Check if localhost connections are allowed

3. **Verify server endpoint**:
   ```bash
   curl http://localhost:3684/mcp
   # Should return valid MCP response
   ```

---

## Next Steps

1. ✅ **Verify Morph server** - Check if server needs to be started
2. ✅ **Configure OpenCode** - Add OpenCode MCP server to Cursor config
3. ✅ **Test connections** - Verify both servers work in Cursor
4. ✅ **Update root mcp.json** - Keep it in sync with Cursor config if needed

---

## References

- [Cursor MCP Documentation](https://docs.cursor.com/context/mcp)
- [OpenCode MCP Server](https://github.com/opencode-dev/opencode-mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)



