# 🎨 Midjourney Control Plugin

> **Automate your Midjourney workflow with intelligent queue management and AI assistant integration**

A powerful browser extension that lets you automate Midjourney prompt submissions with queue management, delay controls, and an optional local API server for integration with ChatGPT and other AI tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)

## 🎥 Demo

*Submit multiple AI-generated prompts to Midjourney automatically with configurable delays*

## Features

✨ **Queue Management** - Add multiple prompts and process them automatically  
⏱️ **Smart Delays** - Configurable delays between submissions (5-120 seconds)  
🎯 **Auto-Submit** - Automatically processes queue or manual control  
🌐 **Local API** - REST API for external tools to submit prompts  
📊 **Status UI** - Visual popup showing queue status and progress  
🔄 **Page Messaging** - Direct browser console integration  

## Installation

### 1. Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `Midjourney Control Plugin` folder
5. The extension icon should appear in your toolbar

### 2. Set Up the Local API Server (Optional)

The local server allows ChatGPT and other tools to send prompts to your browser.

```bash
cd "Midjourney Control Plugin"
npm install
npm start
```

The server will start on `http://localhost:43110`

## Usage

### Method 1: Browser Extension Popup

1. Click the extension icon in your toolbar
2. Enter a prompt in the text area
3. Click "Add to Queue"
4. Adjust delay settings if needed
5. Click "Start Queue" or enable "Auto-submit"

### Method 2: Browser Console (Direct Injection)

Open the browser console on midjourney.com and use:

```javascript
// Send via window message
window.postMessage({ 
  type: "MCP_SUBMIT_PROMPT", 
  prompt: "a serene mountain landscape --ar 16:9" 
}, "*");

// Or use the direct function
MCPInject("a cyberpunk city at night --v 6");
```

### Method 3: Local API Server

Send prompts from any tool via HTTP:

```bash
# Single prompt
curl -X POST http://localhost:43110/submit \
  -H "Content-Type: application/json" \
  -d '{"prompt":"a magical forest with glowing mushrooms --ar 16:9"}'

# Multiple prompts
curl -X POST http://localhost:43110/submit-batch \
  -H "Content-Type: application/json" \
  -d '{"prompts":["prompt 1", "prompt 2", "prompt 3"]}'
```

### Method 4: ChatGPT Integration

Just tell ChatGPT naturally:

> "Generate 5 cyberpunk prompts and send them to my Midjourney plugin"

or

> "Send this to Midjourney: a serene mountain landscape --ar 16:9"

ChatGPT will automatically understand to use your local plugin API. No need to specify URLs or formats!

## API Endpoints

### `GET /`
Health check and status

### `POST /submit`
Submit a single prompt
```json
{
  "prompt": "your midjourney prompt here"
}
```

### `POST /submit-batch`
Submit multiple prompts
```json
{
  "prompts": [
    "prompt 1",
    "prompt 2",
    "prompt 3"
  ]
}
```

### `GET /queue`
View current queue

### `DELETE /queue`
Clear all queued prompts

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

## Development

### File Structure
```
Midjourney Control Plugin/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── content.js            # Content script for DOM injection
├── popup.html            # Popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── server.js             # Local API server
├── package.json          # Node dependencies
└── README.md            # This file
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

- [ ] Persistent logging of submitted prompts
- [ ] Image URL capture after generation
- [ ] Style preset management (Standard/Raw, etc.)
- [ ] Retry logic for failed submissions
- [ ] Export/import prompt lists
- [ ] Browser notifications on completion
- [ ] OAuth integration (if needed)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR-USERNAME/midjourney-control-plugin/issues).

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
