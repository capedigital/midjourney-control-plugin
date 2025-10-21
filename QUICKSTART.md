# 🚀 Quick Start - Load Extension in Chrome

## Option 1: Load Unpacked (Recommended for Testing)

This is the fastest way to test your extension:

1. **Open Chrome Extensions Page**
   - Type in address bar: `chrome://extensions/`
   - OR Menu → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Look for the toggle in the **top right corner**
   - Click to turn it ON

3. **Load the Extension**
   - Click the **"Load unpacked"** button (top left)
   - Navigate to and select: `/Users/jdemott/Applications/Midjourney Control Plugin`
   - Click "Select"

4. **Verify It Loaded**
   - You should see "Midjourney Control Plugin" in your extensions list
   - The extension icon should appear in your Chrome toolbar
   - If you don't see the icon, click the puzzle piece 🧩 and pin it

5. **Test It**
   - Click the extension icon
   - The purple popup should appear
   - See TESTING.md for full test instructions

## Option 2: Create and Share a ZIP Package

If you want to share with others or install on another machine:

```bash
cd "/Users/jdemott/Applications/Midjourney Control Plugin"
./package-extension.sh
```

This creates `dist/midjourney-control-plugin-v0.1.0.zip`

**To install the ZIP:**
1. Go to `chrome://extensions/`
2. Enable Developer Mode
3. Drag the `.zip` file onto the page
4. OR click "Load unpacked" and select the extracted folder

## 🧪 First Test

Once loaded:

1. **Click the extension icon** → Popup should open
2. **Go to https://www.midjourney.com** and log in
3. **Open browser console** (F12) on Midjourney
4. **Type**: `MCPInject("testing 123")`
5. **Check** if the text appears in Midjourney's prompt input

If that works, you're good to go! 🎉

## 🔄 Making Changes

When you edit the code:

1. **For popup/content changes**: 
   - Go to `chrome://extensions/`
   - Click the refresh icon ↻ on the extension card

2. **For background script changes**:
   - Go to `chrome://extensions/`
   - Click "Remove" then "Load unpacked" again
   - OR click the refresh icon

## 🌐 Starting the API Server

For ChatGPT integration:

```bash
cd "/Users/jdemott/Applications/Midjourney Control Plugin"
npm install    # First time only
npm start      # Starts server on http://localhost:43110
```

Keep this running in a terminal while using the extension.

## ❓ Troubleshooting

**Extension won't load?**
- Check for errors on chrome://extensions/
- Make sure all files are in the folder
- manifest.json must be valid JSON

**Icon not showing?**
- The extension works without icons
- Click the puzzle piece 🧩 to find it
- Add icons later (see icons/README.md)

**Popup won't open?**
- Check browser console for errors
- Try clicking "Inspect views: popup.html" on chrome://extensions/

**Need help?**
- See TESTING.md for detailed testing
- Check browser console and service worker logs
- Open an issue on GitHub

---

Ready to test? Load it up and try it out! 🚀
