# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-21

### Added
- Initial release 🎉
- Browser extension for Chrome with Manifest V3
- Queue management system with persistent storage
- Configurable delays between prompt submissions (5-120 seconds)
- Auto-submit toggle for automatic queue processing
- Visual popup UI with real-time queue status
- Multiple prompt injection methods:
  - Manual entry via popup
  - Browser console commands
  - Window messaging API
  - Local REST API server
- Local API server (Express.js) on port 43110
- Endpoints for single and batch prompt submission
- Smart DOM injection with multiple selector fallbacks
- React/Vue framework compatibility
- Error handling and retry logic
- AI assistant integration (ChatGPT, Claude)
- Comprehensive documentation

### Features
- ⏱️ Smart delay management
- 🔄 Automatic queue processing
- 💾 Persistent queue storage
- 📊 Visual status monitoring
- 🎯 Multiple input methods
- 🌐 REST API for external integrations
- ✨ Clean, modern UI
- 🛡️ Error recovery

[0.1.0]: https://github.com/capedigital/midjourney-control-plugin/releases/tag/v0.1.0
