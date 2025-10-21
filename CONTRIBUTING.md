# Contributing to Midjourney Control Plugin

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (prompts that failed, error messages, etc.)
- **Describe the behavior you observed and what you expected**
- **Include screenshots** if relevant
- **Note your environment**: Browser version, OS, extension version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure your code follows the existing style
4. Update the README.md with details of changes if needed
5. Issue the pull request!

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/midjourney-control-plugin.git
cd midjourney-control-plugin

# Install dependencies
npm install

# Load the extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project directory
```

## Code Style

- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Follow the existing code structure

## Testing

Before submitting a PR:

1. Test the extension with real Midjourney.com usage
2. Test the API server with curl commands
3. Check browser console for errors
4. Test with different queue sizes and delays

## Questions?

Feel free to open an issue with the `question` label!

Thank you! ❤️
