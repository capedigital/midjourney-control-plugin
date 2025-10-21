# Frequently Asked Questions

## General Questions

### Do I need to install Node.js or run any server?

**No!** The extension works completely standalone. You can use it just by installing it in Chrome - no terminal, no server, no npm required.

The local API server is **100% optional** and only needed if you want advanced features like ChatGPT integration.

### Is this safe to use?

Yes! The extension:
- Is 100% open source (you can review all code)
- Runs entirely locally on your machine
- Doesn't send data anywhere
- Doesn't collect any information
- Only interacts with Midjourney.com

### Does this violate Midjourney's terms of service?

This extension simply automates typing prompts - the same thing you'd do manually. It doesn't bypass any limits or access any APIs. However, you should:
- Use reasonable delays between prompts (default is 20 seconds)
- Not abuse the queue system to spam prompts
- Follow Midjourney's community guidelines

**Use responsibly!**

### Do I need to keep the extension folder after installing?

**Yes!** Chrome loads unpacked extensions from their folder. If you delete the folder, the extension will stop working. Keep it somewhere permanent like:
- `~/Applications/Midjourney Control Plugin`
- `~/Documents/Chrome Extensions/Midjourney Control`

## Usage Questions

### How do I add prompts?

Three easy ways:
1. **Popup**: Click the extension icon and type prompts manually
2. **Console**: On Midjourney.com, open console and type `MCPInject("your prompt")`
3. **API** (optional): Use the local server if you set it up

### How do I know if prompts are being submitted?

- Watch the extension popup - it shows queue status in real-time
- Check Midjourney - you'll see prompts appearing in the input field
- Look for the "Processing" status in the queue list

### Can I stop the queue?

Yes! Click the "Stop" button in the popup. The current prompt will finish, then processing stops.

### What happens if I close my browser?

The queue is saved! When you reopen Chrome, your unprocessed prompts will still be there.

### Why isn't it working on Midjourney?

Make sure:
1. You're on the actual Midjourney.com website (logged in)
2. You're on the page with the prompt input field
3. The page has fully loaded
4. The extension is enabled in `chrome://extensions/`

## API Server Questions (Optional Feature)

### Why would I want the API server?

Great for:
- **ChatGPT integration** - ChatGPT can POST prompts directly to the API
- **Custom scripts** - Automate prompt submission from your own tools
- **Browser-based AI** - Tools like ChatGPT with Atlas browser can control Midjourney
- **Advanced workflows** - Build your own automation

**Most users don't need this!** The extension works perfectly standalone.

### Is the server secure?

**Yes!** The server is designed to be secure:

- Only listens on `127.0.0.1` (localhost) - not `0.0.0.0`
- This means **only programs on YOUR computer** can connect
- Your router/firewall won't even see it
- **Not accessible from your network** - other devices can't connect
- **Not accessible from the internet** - impossible to reach externally

Think of it like a note you leave for yourself on your desk - only you can read it. The server works the same way - only your computer can talk to it.

**Why no authentication then?** Because it's localhost-only. It's like asking "why don't I need a password to access my own hard drive?" - because only you have physical access to your computer.

### Can I use the extension without the server?

**Absolutely!** The extension works perfectly standalone. The server is purely optional.

### Do I need to keep the terminal open?

If you're using the API server, yes - keep the terminal running. When you close it, the server stops.

To use without terminal: just don't run the server! Use the extension popup instead.

## Technical Questions

### What permissions does the extension need?

- `scripting` - To inject prompts into Midjourney pages
- `activeTab` - To access the current Midjourney tab
- `storage` - To save your queue and settings
- Host permission for `midjourney.com` - To run on Midjourney

That's it! No broad permissions, no access to other sites.

### Can I modify the extension?

Yes! It's open source. Feel free to fork it and customize to your needs.

### Will this work on Firefox/Safari/Edge?

Currently Chrome only (and Chromium-based browsers like Brave, Edge, Arc). Firefox support could be added with minor manifest changes.

### How do I update the extension?

1. Download the new version
2. Extract it to the same folder (replacing files)
3. Go to `chrome://extensions/`
4. Click the refresh icon on the extension card

## Troubleshooting

### Extension won't load

- Check `chrome://extensions/` for error messages
- Make sure all files are in the folder
- Try removing and re-adding the extension

### Prompts aren't injecting

- Verify you're on the correct Midjourney page
- Check browser console (F12) for errors
- Try manually: `MCPInject("test")`

### Queue isn't processing

- Make sure auto-submit is enabled
- Try clicking "Start Queue" manually
- Check that a Midjourney tab is open

### Server won't start (if using optional server)

- Make sure Node.js is installed
- Run `npm install` first
- Check that port 43110 isn't already in use
- Check for error messages in the terminal

## Still Have Questions?

Open an issue on [GitHub](https://github.com/capedigital/midjourney-control-plugin/issues) and we'll help you out!
