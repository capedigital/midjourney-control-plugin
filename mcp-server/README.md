# Midjourney MCP Server

**Model Context Protocol server for controlling Midjourney through your browser.**

This turns your browser into a controllable tool that AI assistants can use directly!

**Note**: For ChatGPT users, see the REST API option in the main README instead. This MCP server is designed for desktop AI tools like Claude Desktop, Cline, Cursor, etc.

## What is MCP?

[Model Context Protocol](https://modelcontextprotocol.io) is a standard for connecting AI assistants to external tools. Instead of just chatting, the AI can actually **do things** - like submitting prompts to Midjourney for you.

## Installation

```bash
cd mcp-server
npm install
```

## Usage

### For Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

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

Restart Claude Desktop, and you'll see the 🔌 icon showing Midjourney tools are available!

### For Other MCP Clients

Run the server:

```bash
npm start
```

Then connect your MCP client to stdio.

## Available Tools

Once connected, AI assistants can call these tools:

### `submit_prompt`
Submit a single prompt to Midjourney
```json
{
  "prompt": "a serene mountain landscape --ar 16:9"
}
```

### `submit_prompts_batch`
Submit multiple prompts at once
```json
{
  "prompts": [
    "a cyberpunk city at night",
    "a magical forest with glowing mushrooms",
    "a dragon flying over a castle"
  ]
}
```

### `get_queue_status`
Check current queue status
```json
{}
```

### `clear_queue`
Clear all pending prompts
```json
{}
```

### `set_delay`
Change delay between submissions
```json
{
  "seconds": 15
}
```

### `read_page_content`
Read content from Midjourney page
```json
{
  "selector": ".prompt-result"
}
```

### `check_extension_status`
Verify extension connection
```json
{}
```

## How It Works

```
AI Assistant (Claude) 
    ↓ MCP Protocol
MCP Server (this)
    ↓ WebSocket
Chrome Extension
    ↓ DOM Injection
Midjourney.com
```

1. AI calls a tool like `submit_prompt`
2. MCP server sends command via WebSocket
3. Chrome extension receives command
4. Extension injects prompt into Midjourney page
5. Result flows back to AI

## Example Conversation with Claude

**You:** "Generate 5 cyberpunk city prompts and submit them to Midjourney"

**Claude:** 
```
I'll create 5 cyberpunk city prompts and submit them to Midjourney for you.

[Uses submit_prompts_batch tool]

✅ Submitted 5 prompts to your queue:
1. Neon-lit megacity with flying vehicles, rain-slicked streets...
2. Dystopian urban sprawl with holographic advertisements...
[etc.]

All prompts are queued and will be submitted automatically!
```

**That's the power of MCP!** Claude can directly control your browser.

## Security

- WebSocket only accepts connections from `127.0.0.1` (localhost)
- No internet exposure - completely local
- Extension must be manually installed (not remotely)
- You control what tools are available

## Troubleshooting

### "Extension not connected"
1. Make sure the Chrome extension is installed
2. Open https://www.midjourney.com in a tab
3. Extension should auto-connect to MCP server

### "MCP server not showing in Claude"
1. Check your config file path is correct
2. Restart Claude Desktop completely
3. Look for errors in Claude's developer console

### WebSocket connection fails
1. Make sure no firewall is blocking port 43111
2. Check another process isn't using the port
3. Try restarting the MCP server

## Development

Watch mode (auto-restart on changes):
```bash
npm run dev
```

## License

MIT
