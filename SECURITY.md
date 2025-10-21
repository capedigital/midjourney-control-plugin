# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to the maintainers instead of using the issue tracker.

**Please do not publicly disclose the vulnerability until it has been addressed.**

We'll respond as quickly as possible and work with you to:

1. Confirm the vulnerability
2. Determine the severity
3. Develop and test a fix
4. Release a patched version
5. Publicly disclose the vulnerability (with credit to you if desired)

## Security Considerations

### Extension Security

This extension:

- ✅ Runs entirely locally (no external data transmission)
- ✅ Does not collect or store personal information
- ✅ Requires only necessary browser permissions
- ✅ Only accesses midjourney.com (nothing else)
- ✅ Open source - you can review all code
- ✅ No tracking, analytics, or telemetry

### API Server Security (Optional Feature)

**The optional API server is designed to be secure by default:**

- 🔒 **Localhost-only binding** - Only accepts connections from `127.0.0.1`
- 🔒 **Not exposed to network** - Your router/firewall blocks external access
- 🔒 **Not accessible from internet** - Only your computer can connect
- 🔒 **CORS restricted** - Only localhost origins allowed
- 🔒 **No authentication needed** - Because it's localhost-only

**What this means:**
- ✅ Safe to run on your computer
- ✅ Other apps on your computer can use it (intentional - for ChatGPT integration)
- ✅ No one on your network can access it
- ✅ No one on the internet can access it
- ❌ Don't try to expose it externally (not designed for that!)

### Safe Usage

- Only load the extension from trusted sources (GitHub releases or official Chrome Web Store)
- Review the code before installing (it's open source!)
- Keep the extension updated
- **Never** port-forward the API server or expose it to the internet
- **Never** modify the server to listen on `0.0.0.0` unless you add authentication
- Use HTTPS when accessing Midjourney

## Known Limitations

- The local API server has no authentication (not needed since it's localhost-only)
- DOM injection relies on Midjourney's current page structure (may break if they update)
- No built-in rate limiting (relies on user-configured delays)
- Server doesn't validate prompt content (it just passes through what you send)

Thank you for helping keep this project secure!
