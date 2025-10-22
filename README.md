# 🎨 Universal Browser Automation Plugin

> **AI-driven browser automation at superhuman speeds**

Originally built for Midjourney, now a **general-purpose automation platform** that's 20-30x faster than vision-based approaches like ChatGPT's Atlas mode. **Works completely standalone** or integrate with any AI assistant via REST API.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)
[![No Server Required](https://img.shields.io/badge/Server-Optional-green.svg)](https://github.com/capedigital/midjourney-control-plugin)

## 🚀 Why This Exists

ChatGPT's Atlas browser mode is **slow** because it:
- Takes screenshots → processes with vision AI → clicks pixels → waits for visual confirmation

This plugin provides **direct DOM access**:
- **50ms per action** vs 3-5 seconds with Atlas
- **Reliable selectors** instead of pixel coordinates  
- **Batch operations** for multi-step workflows
- **Pure JSON extraction** instead of OCR

## 🎯 Two Modes

### Mode 1: Midjourney Automation (Original)
- Queue management for prompt batches
- Auto-submit with configurable delays
- Persistent storage across browser restarts

### Mode 2: Universal Browser Automation (NEW!)
- Click elements by text
- Fill forms intelligently
- Extract structured data from any page
- Safety checks for payment/sensitive pages
- Works on **any website**

## Features

✨ **High-Level Automation** - DOM queries, element actions, content extraction  
⚡ **Blazing Fast** - 20-30x faster than vision-based automation  
🎯 **Smart Actions** - `clickByText()`, `typeInFieldByLabel()`, batch operations  
� **Safety Checks** - Auto-detect payment pages and sensitive fields  
� **Structured Data** - Extract JSON instead of parsing screenshots  
💾 **Persistent Queue** - Midjourney queue survives browser restarts  
🎨 **Zero Setup** - Works immediately, no server required  
🤖 **AI-Ready** - REST API for ChatGPT, MCP for Claude Desktop  
🌐 **Universal** - Works on any website, not just Midjourney    

## Installation

### Simple Installation (No Command Line Required!)

1. **Download the Extension**
   - Download the latest release ZIP from [Releases](https://github.com/capedigital/midjourney-control-plugin/releases)
   - OR download this repository as ZIP

2. **Extract the ZIP** to a folder on your computer

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extracted folder
   - Done! The extension icon appears in your toolbar

**That's it!** The extension works completely standalone. No server, no terminal, no npm needed.

### Advanced: AI Assistant Integration

Want AI assistants to control Midjourney directly? We have two integration methods:

## AI Integration (Optional)

### 🎯 Recommended: Advanced Automation API

**Universal browser automation for any AI assistant**

```bash
npm run start:automation
```

Provides high-level primitives at `http://localhost:43110`:
- `/api/click-by-text` - Click elements by visible text
- `/api/type-in-field` - Type in form fields by label
- `/api/extract-content` - Get page content as JSON
- `/api/batch` - Execute multiple actions atomically
- `/api/detect-payment` - Safety check for sensitive pages

**See [AUTOMATION_API.md](AUTOMATION_API.md) for complete documentation**

**Why use this?** 20-30x faster than ChatGPT Atlas mode for web automation!

---

### Option A: REST API (Midjourney-specific)

**For ChatGPT, browser-based AI, custom scripts**

```bash
npm start                    # Midjourney only
npm run start:multi          # Midjourney + Ideogram
```

- ChatGPT can POST to `http://localhost:43110` (Midjourney) or `http://localhost:43111` (Ideogram)
- See [CHATGPT_MEMORY.md](CHATGPT_MEMORY.md) to train ChatGPT to auto-submit prompts
- See [CHATGPT_ATLAS.md](CHATGPT_ATLAS.md) for detailed examples

**Option B: MCP Server** (For Claude Desktop, Cline, Cursor)
- **Not for ChatGPT** - ChatGPT doesn't support the Model Context Protocol
- Best for: Claude Desktop and MCP-compatible tools
- Install: `cd mcp-server && npm install`
- See [mcp-server/QUICKSTART.md](mcp-server/QUICKSTART.md)

**💡 ChatGPT Users**: Use Option A (REST API). Just tell ChatGPT to POST to localhost:43110!

## Usage

### Basic Usage (No Setup Required)

#### Method 1: Extension Popup

1. Click the extension icon in your toolbar
2. Enter a prompt in the text area
3. Click "Add to Queue"
4. Prompts submit automatically with your configured delay

#### Method 2: Browser Console

Open the browser console on midjourney.com and use:

```javascript
// Quick inject
MCPInject("a serene mountain landscape --ar 16:9");

// Add to queue via window message
window.postMessage({ 
  type: "MCP_SUBMIT_PROMPT", 
  prompt: "a cyberpunk city at night --v 6" 
}, "*");
```

### Method 3: AI Assistant Integration

#### Option A: REST API (For ChatGPT, browser-based AI tools)

**Perfect for ChatGPT with Atlas browser or custom scripts!**

1. Start the API server: `npm start` (from project root)
2. Tell ChatGPT naturally:

> "Generate 5 cyberpunk prompts and POST them to http://localhost:43110/submit-batch"

or just:

> "Send these to my Midjourney plugin at localhost:43110"

ChatGPT can directly call the API to submit prompts for you!

#### Option B: MCP Server (For Claude Desktop, Cline, etc.)

The extension auto-connects to an MCP server if running. See [mcp-server/QUICKSTART.md](mcp-server/QUICKSTART.md).

Once set up:
> "Generate 5 prompts for fantasy landscapes and submit them to Midjourney"

Your AI assistant will use MCP tools to control your browser directly!

## Advanced: API Server Setup (Optional)

**You don't need this for basic use!** The extension works perfectly without any server.

### For ChatGPT Integration (Recommended!)

ChatGPT with browser access (like Atlas) can directly interact with local APIs!

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Open Terminal (or Command Prompt on Windows)
3. Navigate to the extension folder
4. Run: `npm install` (first time only)
5. Run: `npm start`

The server will start on `http://localhost:43110` (localhost-only for security)

Now just tell ChatGPT:
> "Generate 10 sci-fi prompts and POST them to http://localhost:43110/submit-batch as JSON"

ChatGPT will automatically format and submit them!

**🔒 Security Note**: The server only accepts connections from your own computer (localhost). It's not accessible from your network or the internet, making it safe to run.

### API Endpoints

- `POST /submit` - Submit a single prompt
  ```json
  {"prompt": "your prompt here"}
  ```
- `POST /submit-batch` - Submit multiple prompts
  ```json
  {"prompts": ["prompt1", "prompt2", "prompt3"]}
  ```
- `GET /queue` - View current queue
- `DELETE /queue` - Clear queue
- `GET /` - Health check

## Configuration

### Delay Settings
- **Minimum**: 5 seconds
- **Maximum**: 120 seconds
- **Default**: 20 seconds

Adjust via the popup UI or by updating settings in the background script.

### Auto-Submit
When enabled, the queue automatically processes as soon as prompts are added.

## How It Works

1. **Content Script** (`content.js`) - Runs on midjourney.com and handles DOM injection
2. **Background Script** (`background.js`) - Manages queue, timing, and coordination
3. **Popup UI** (`popup.html/js/css`) - User interface for queue management
4. **Local Server** (`server.js`) - Optional REST API for external integrations

## DOM Selectors

The extension tries multiple selectors to find the Midjourney prompt input:
- `textarea[placeholder*="imagine"]`
- `textarea[placeholder*="Imagine"]`
- Generic `textarea`
- `input[type="text"]`

It also handles React/Vue framework value setting for compatibility.

## Troubleshooting

### "Could not find prompt input field"
- Make sure you're on the correct Midjourney page
- The page must be fully loaded
- Try refreshing the page and reloading the extension

### "No Midjourney tab found"
- Open https://www.midjourney.com in a tab
- Make sure the extension has permissions for that site

### Extension not loading
- Check Chrome extensions page for errors
- Reload the extension
- Check browser console for error messages

### API server not responding
- Make sure you ran `npm install`
- Check that port 43110 is not in use
- Verify the server is running with `curl http://localhost:43110`

## Documentation

### 🚀 Getting Started
- [Quick Start Guide](QUICKSTART.md) - Up and running in 5 minutes
- [Automation API](AUTOMATION_API.md) - **Universal browser automation (RECOMMENDED)**
- [FAQ](FAQ.md) - Common questions and troubleshooting

### 🤖 AI Integration
- [ChatGPT Memory Training](CHATGPT_MEMORY.md) - Train ChatGPT to auto-recognize commands
- [ChatGPT Atlas Guide](CHATGPT_ATLAS.md) - Midjourney-specific examples
- [Multi-Service Support](MULTI_SERVICE.md) - Midjourney, Ideogram, and beyond

### 🔒 Security & Development
- [Security Information](SECURITY.md) - How localhost binding works
- [Testing Guide](TESTING.md) - Extension testing procedures
- [Contributing](CONTRIBUTING.md) - Contribution guidelines

## File Structure
```
Midjourney Control Plugin/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── content.js            # Midjourney-specific DOM injection
├── content-advanced.js   # Universal automation primitives
├── popup.html            # Popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── server.js             # Midjourney API server
├── server-automation.js  # Universal automation API
├── server-multi.js       # Multi-service support
├── package.json          # Node dependencies
└── docs/                 # Documentation files
```

### Testing

1. **Test Content Script**:
   ```javascript
   // In browser console on midjourney.com
   MCPInject("test prompt");
   ```

2. **Test Background Queue**:
   Open extension popup and add prompts manually

3. **Test API Server**:
   ```bash
   curl http://localhost:43110
   ```

## Future Enhancements

### Automation Platform
- [ ] Visual workflow builder
- [ ] Recording mode (record actions, replay later)
- [ ] More safety checks (detect CAPTCHA, rate limiting)
- [ ] Chrome Web Store publication

### Midjourney-Specific
- [ ] Persistent logging of submitted prompts
- [ ] Image URL capture after generation
- [ ] Style preset management
- [ ] Retry logic for failed submissions
- [ ] Export/import prompt lists

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/capedigital/midjourney-control-plugin/issues).

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

This project is [MIT](LICENSE) licensed.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

## 👤 Author

Built with ❤️ for the AI art community

## 🙏 Acknowledgments

- Inspired by the need to bridge AI assistants with creative tools
- Built for seamless Midjourney automation
- Thanks to all contributors and users!

---

**Note**: This is an unofficial tool and is not affiliated with Midjourney. Use responsibly and in accordance with Midjourney's terms of service.
