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

This extension:

- Runs entirely locally (no external data transmission)
- Does not collect or store personal information
- Requires only necessary browser permissions
- API server is localhost-only by default

### Safe Usage

- Only load the extension from trusted sources
- Review the code before installing (it's open source!)
- Keep the extension updated
- Don't expose the API server to external networks without proper security
- Use HTTPS when accessing Midjourney

## Known Limitations

- The local API server has no authentication by default (it's localhost-only)
- DOM injection relies on Midjourney's current page structure
- No built-in rate limiting (relies on user-configured delays)

Thank you for helping keep this project secure!
