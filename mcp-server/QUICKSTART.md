# MCP Server Quick Start

## What You Get

With the MCP server, AI assistants like Claude can **directly control your browser**:

- Submit prompts to Midjourney
- Check queue status  
- Adjust delays
- Read page content
- Fully automated workflow

## Installation (2 minutes)

### 1. Install the Chrome Extension

```bash
# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Load unpacked: /Users/jdemott/Applications/Midjourney Control Plugin
```

### 2. Install MCP Server

```bash
cd "/Users/jdemott/Applications/Midjourney Control Plugin/mcp-server"
npm install
```

### 3. Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "midjourney": {
      "command": "node",
      "args": ["/Users/jdemott/Applications/Midjourney Control Plugin/mcp-server/index.js"]
    }
  }
}
```

### 4. Restart Claude Desktop

The extension will auto-connect when you open Midjourney.com!

## Usage

### In Claude Desktop

**You:** "Generate 5 cyberpunk city prompts and submit them to Midjourney"

**Claude:** Will use the `submit_prompts_batch` tool automatically!

**You:** "Check the queue status"

**Claude:** Will use `get_queue_status` and show you what's pending.

### Manual Testing

```bash
# Terminal 1: Start MCP server
cd mcp-server
npm start

# Terminal 2: Test with MCP inspector
npx @modelcontextprotocol/inspector node index.js
```

## Available Tools

- `submit_prompt` - Add single prompt
- `submit_prompts_batch` - Add multiple prompts
- `get_queue_status` - Check queue
- `clear_queue` - Clear all prompts
- `set_delay` - Change submission delay
- `read_page_content` - Read from Midjourney page
- `check_extension_status` - Verify connection

## How It Works

```
Claude Desktop
    ↓ stdio
MCP Server (Node.js)
    ↓ WebSocket (port 43111)
Chrome Extension
    ↓ DOM
Midjourney.com
```

## Troubleshooting

### "Extension not connected"
1. Open Chrome
2. Go to https://www.midjourney.com
3. Extension auto-connects to MCP server

### "Tool not available in Claude"
1. Check config file path is correct
2. Restart Claude Desktop **completely**
3. Look for the 🔌 icon in Claude

### MCP server won't start
```bash
# Make sure you're in the right directory
cd mcp-server

# Install dependencies
npm install

# Try running directly
node index.js
```

## Example Workflow

**Setup once:**
1. Install extension
2. Install MCP server
3. Add to Claude config
4. Restart Claude

**Every time you want to use it:**
1. Open Midjourney.com in Chrome
2. Chat with Claude
3. Claude can now control Midjourney!

No manual commands needed - just talk to Claude naturally!

## Security

- WebSocket only on localhost (127.0.0.1)
- No internet exposure
- You control what tools exist
- All code is open source

## Next Steps

See [mcp-server/README.md](./README.md) for detailed documentation.
