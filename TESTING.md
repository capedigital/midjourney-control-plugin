# 🧪 Testing Guide

## Before Publishing - Test Everything!

### 1. Load the Extension in Chrome

#### Method 1: Load Unpacked (Development Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **"Developer mode"** ON (top right corner)
3. Click **"Load unpacked"**
4. Select the folder: `/Users/jdemott/Applications/Midjourney Control Plugin`
5. The extension should now appear in your toolbar

#### Method 2: Load from ZIP (Production-like)

```bash
# Package the extension first
chmod +x package-extension.sh
./package-extension.sh
```

Then drag the created `.zip` file from the `dist/` folder onto `chrome://extensions/`

### 2. Test the Extension Popup

1. Click the extension icon in your Chrome toolbar
2. Verify the popup opens correctly
3. Check that all UI elements display properly:
   - Queue count shows "0"
   - Status shows "Idle"
   - Delay input defaults to "20"
   - Auto-submit is checked
   - All buttons are visible

### 3. Test Manual Prompt Addition

1. In the popup, enter a test prompt: `a simple test prompt`
2. Click "Add to Queue"
3. Verify:
   - Prompt appears in the queue list
   - Queue count increments to "1"
   - Status changes from "Idle" to "Ready"

### 4. Test on Midjourney.com

**IMPORTANT**: You need to be logged into Midjourney for this to work!

1. Open https://www.midjourney.com in a new tab
2. Log in if you haven't already
3. Navigate to the page with the prompt input (usually the main interface)

#### Test Console Injection

1. Open Developer Console (F12 or Cmd+Option+I)
2. Type: `MCPInject("test prompt from console")`
3. Check if the prompt appears in the Midjourney input field

#### Test Window Messaging

1. In the console, type:
   ```javascript
   window.postMessage({ 
     type: "MCP_SUBMIT_PROMPT", 
     prompt: "test prompt via message" 
   }, "*");
   ```
2. Open the extension popup and verify the prompt was added to the queue

### 5. Test Queue Processing

1. Add 3-5 test prompts to the queue
2. Set delay to minimum (5 seconds) for faster testing
3. Click "Start Queue"
4. Verify:
   - Status changes to "Processing"
   - First prompt changes to "Processing..." status
   - Prompt is injected into Midjourney
   - After delay, next prompt is processed
   - Watch the Midjourney interface to see prompts being submitted

### 6. Test Stop/Clear Functions

1. While queue is processing, click "Stop"
   - Verify processing stops
   - Status returns to "Ready"
2. Click "Clear Queue"
   - Confirm the dialog appears
   - Verify queue empties

### 7. Test Settings Persistence

1. Change delay to "15"
2. Uncheck "Auto-submit"
3. Close the popup
4. Reopen the popup
5. Verify settings are saved

### 8. Test the Local API Server

#### Start the Server

```bash
cd "/Users/jdemott/Applications/Midjourney Control Plugin"
npm install
npm start
```

#### Test Single Prompt

```bash
curl -X POST http://localhost:43110/submit \
  -H "Content-Type: application/json" \
  -d '{"prompt":"API test prompt"}'
```

#### Test Batch Prompts

```bash
curl -X POST http://localhost:43110/submit-batch \
  -H "Content-Type: application/json" \
  -d '{"prompts":["prompt 1","prompt 2","prompt 3"]}'
```

#### Verify in Extension

- Open the popup and check that prompts from API appear in queue
- If auto-submit is enabled, they should start processing

### 9. Test Error Scenarios

1. **No Midjourney Tab**:
   - Close all Midjourney tabs
   - Try to process queue
   - Should see error in popup

2. **Wrong Page**:
   - Navigate to a different page on midjourney.com
   - Try to inject a prompt
   - Check console for errors

3. **Invalid Prompts**:
   - Try empty prompts
   - Try very long prompts (1000+ characters)

### 10. Test Browser Restart

1. Add prompts to queue
2. Close Chrome completely
3. Reopen Chrome
4. Open the extension popup
5. Verify queue is still there (persistence test)

## 🐛 Common Issues to Watch For

### Extension doesn't load
- Check manifest.json is valid
- Look for errors in chrome://extensions/
- Check browser console for errors

### Prompts don't inject
- Verify you're on the correct Midjourney page
- Check that Midjourney's UI hasn't changed
- Look in the page console for errors
- Try running `MCPInject("test")` manually

### API server doesn't work
- Make sure you ran `npm install`
- Check port 43110 isn't already in use
- Verify server is running: `curl http://localhost:43110`

### Queue doesn't persist
- Check browser storage permissions
- Look for errors in background script console
- Try chrome://extensions/ → Details → View service worker logs

## ✅ Testing Checklist

Before publishing, verify:

- [ ] Extension loads without errors
- [ ] Popup displays correctly
- [ ] Can add prompts manually
- [ ] Can add prompts via console
- [ ] Can add prompts via window messages
- [ ] Queue processes prompts in order
- [ ] Delays work correctly
- [ ] Can stop processing
- [ ] Can clear queue
- [ ] Settings persist after restart
- [ ] Queue persists after browser restart
- [ ] API server starts and accepts requests
- [ ] Prompts from API appear in extension
- [ ] Icons display correctly (if added)
- [ ] No console errors during normal operation
- [ ] Works on actual Midjourney.com interface

## 🔍 Debugging Tips

### View Background Script Console

1. Go to `chrome://extensions/`
2. Find "Midjourney Control Plugin"
3. Click "Inspect views: service worker"
4. Check console for errors

### View Content Script Console

1. Open Midjourney.com
2. Press F12 to open DevTools
3. Look for messages from the content script
4. Should see "Midjourney Control Plugin content script loaded"

### Check Storage

```javascript
// In background script console
chrome.storage.local.get(null, (data) => console.log(data));
```

## 📝 Test Results Log

Keep track of what you've tested:

```
Date: ___________
Browser: Chrome Version ___________

✓ Extension loads
✓ Popup works
✓ Manual prompts
✓ Console injection
✓ Queue processing
✓ API server
✓ Settings persist
✓ Queue persists
✗ Issue found: ___________

Notes:
_________________________
_________________________
```

Good luck testing! 🚀
