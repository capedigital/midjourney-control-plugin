# 🎨 Midjourney Control Plugin

> **Automate your Midjourney workflow with intelligent queue management**

A Chrome extension that automates Midjourney prompt submissions with queue management and smart delays. **Works completely standalone** - no server, terminal, or command line needed!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)
[![No Server Required](https://img.shields.io/badge/Server-Optional-green.svg)](https://github.com/capedigital/midjourney-control-plugin)

## 🎥 How It Works

1. Install the extension in Chrome (3 clicks, no terminal!)
2. Go to Midjourney.com
3. Add prompts via the popup or browser console
4. Watch them submit automatically with smart delays

**That's it!** Optionally enable API server for ChatGPT integration.

## Features

✨ **Queue Management** - Add multiple prompts and process them automatically  
⏱️ **Smart Delays** - Configurable delays between submissions (5-120 seconds)  
🎯 **Auto-Submit** - Automatically processes queue or manual control  
📊 **Status UI** - Visual popup showing queue status and progress  
🔄 **Browser Console** - Direct integration via developer console  
💾 **Persistent Storage** - Queue survives browser restarts  
🎨 **Zero Setup** - Works immediately, no server or terminal needed  
🌐 **Optional API** - Advanced users can enable ChatGPT integration  

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

### Optional: API Server for Advanced Users

If you want ChatGPT or other tools to send prompts automatically, you can optionally run the local API server:

```bash
cd "Midjourney Control Plugin"
npm install
npm start
```

**But this is 100% optional!** The extension works great without it.

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

### Method 3: ChatGPT Integration (Requires Optional API Server)

**Note**: This feature requires the optional API server to be running (see Advanced Setup below).

Once the server is running, just tell ChatGPT naturally:

> "Generate 5 cyberpunk prompts and send them to my Midjourney plugin"

or

> "Send this to Midjourney: a serene mountain landscape --ar 16:9"

ChatGPT will automatically understand to use your local plugin API.

## Advanced: API Server Setup (Optional)

**You don't need this for basic use!** The extension works perfectly without any server.

If you want to integrate with ChatGPT or other external tools:

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Open Terminal (or Command Prompt on Windows)
3. Navigate to the extension folder
4. Run: `npm install` (first time only)
5. Run: `npm start`

The server will start on `http://localhost:43110` (localhost-only for security)

**🔒 Security Note**: The server only accepts connections from your own computer (localhost). It's not accessible from your network or the internet, making it safe to run.

### API Endpoints

- `POST /submit` - Submit a single prompt
- `POST /submit-batch` - Submit multiple prompts
- `GET /queue` - View current queue
- `DELETE /queue` - Clear queue

See [API Documentation](docs/API.md) for detailed usage.

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
