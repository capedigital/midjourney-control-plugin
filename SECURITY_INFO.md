# Security Information

## Is This Safe?

**Yes!** This extension is designed with security in mind:

### Extension Security

- ✅ **100% Open Source** - All code is visible and auditable
- ✅ **Local Only** - Everything runs on your computer
- ✅ **No Data Collection** - We don't collect, store, or transmit any data
- ✅ **Minimal Permissions** - Only requests what's needed for functionality
- ✅ **No Tracking** - No analytics, telemetry, or phone-home behavior
- ✅ **Single Site Access** - Only works on midjourney.com

### What Permissions Does It Need?

1. **`scripting`** - To inject your prompts into the Midjourney page
2. **`activeTab`** - To know which tab has Midjourney open
3. **`storage`** - To save your queue and settings locally
4. **`host_permissions` for midjourney.com** - To run scripts on Midjourney

That's it! No access to:
- ❌ Your browsing history
- ❌ Other websites
- ❌ Your files
- ❌ Your camera/microphone
- ❌ Your personal data

## Optional API Server Security

**The local API server is completely optional** and only needed for ChatGPT integration.

### How It's Secured

The server is designed to be localhost-only:

```javascript
// Server ONLY listens on 127.0.0.1 (localhost)
app.listen(PORT, '127.0.0.1', () => {
  // This means ONLY your computer can connect
});
```

**What this means:**

- 🔒 **Bound to localhost** - Impossible for external connections
- 🔒 **Not on your network** - Other devices can't see it
- 🔒 **Not on the internet** - No one outside can reach it
- 🔒 **Firewall-friendly** - Your router won't even route to it

### Why No Authentication?

Because it's **localhost-only**. Think about it:

- Your computer's hard drive has no password (from apps)
- Your clipboard has no password
- Your local database has no password (by default)

Why? Because they're only accessible from your computer. Same principle here.

### Network Diagram

```
❌ Internet → [Router] → Your Computer → ✅ Server
❌ Phone on WiFi → [Router] → Your Computer → ✅ Server  
❌ Other Computer → [Router] → Your Computer → ✅ Server

✅ ChatGPT (on your computer) → ✅ Server
✅ Browser (on your computer) → ✅ Server
✅ Your scripts (on your computer) → ✅ Server
```

Only programs running **on your computer** can talk to the server.

## Common Security Questions

### "Can someone hack my computer through this?"

No. The server:
- Only accepts simple JSON payloads
- Doesn't execute arbitrary code
- Doesn't access your file system
- Doesn't run shell commands
- Just queues text prompts

### "What if someone gets on my WiFi?"

They still can't access the server. It's bound to `127.0.0.1`, not your network interface.

### "Could malware on my computer use this?"

If you have malware on your computer, you have bigger problems than this extension. Malware can:
- Read your clipboard
- Log your keystrokes
- Access your files
- Screenshot your screen

A localhost-only prompt queue is the least of your concerns.

### "Should I use a firewall?"

Your OS firewall won't even see the server because it's localhost-only. But yes, always use a firewall anyway (for everything else).

### "Can this steal my Midjourney account?"

No. The extension:
- Doesn't access cookies
- Doesn't access auth tokens
- Doesn't transmit credentials
- Just types prompts (same as you would manually)

## Best Practices

1. **Download from official sources**
   - GitHub releases: https://github.com/capedigital/midjourney-control-plugin
   - Chrome Web Store (when published)

2. **Review the code** (it's open source!)
   - Check `manifest.json` for permissions
   - Read `background.js` and `content.js`
   - Verify `server.js` binds to `127.0.0.1`

3. **Keep it updated**
   - Check for updates periodically
   - Security fixes will be announced

4. **Don't modify security settings**
   - Don't change `127.0.0.1` to `0.0.0.0`
   - Don't port-forward the server
   - Don't disable CORS restrictions

5. **Use HTTPS for Midjourney**
   - Always use `https://midjourney.com`
   - Never disable HTTPS

## Reporting Security Issues

Found a security issue? Please:

1. **Don't** open a public GitHub issue
2. **Do** email the maintainers directly
3. **Do** give us time to fix it before public disclosure
4. **Do** get credit in the acknowledgments (if you want)

See [SECURITY.md](SECURITY.md) for our security policy.

## Third-Party Audits

This project is small enough that you can audit it yourself:
- ~500 lines of JavaScript total
- No compiled code
- No obfuscation
- No external dependencies for core functionality

**Read it yourself!** If you know basic JavaScript, you can verify everything we've said here.

## Comparison to Alternatives

| Feature | This Extension | Browser Automation Tools | API Scrapers |
|---------|---------------|------------------------|--------------|
| Runs Locally | ✅ | ✅ | ❌ (cloud-based) |
| Open Source | ✅ | Sometimes | Rarely |
| Needs Auth Tokens | ❌ | ❌ | ✅ (risky!) |
| Network Exposure | ❌ | Varies | ✅ |
| Data Collection | ❌ | Varies | Usually ✅ |

## Summary

**The extension is safe because:**
- It's open source (auditable)
- It's local-only (no cloud)
- It has minimal permissions
- It doesn't collect data

**The optional server is safe because:**
- It's localhost-only (not networked)
- It's simple (just queues text)
- It doesn't need auth (because localhost)
- It can't be exploited remotely (not accessible)

Questions? See [FAQ.md](FAQ.md) or open an issue!
