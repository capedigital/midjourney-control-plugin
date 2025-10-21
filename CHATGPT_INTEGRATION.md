# ChatGPT Integration Guide

## Quick Start

Just tell ChatGPT:

> "Send these prompts to Midjourney using my plugin"

or

> "Generate 5 prompts and send them to my Midjourney plugin"

ChatGPT will automatically use the local API at `http://localhost:43110/submit-batch`

## How It Works

The Midjourney Control Plugin runs a local API server that accepts prompts via HTTP POST requests.

**Endpoint**: `http://localhost:43110/submit-batch`

**Format**:
```json
{
  "prompts": [
    "prompt 1 here",
    "prompt 2 here"
  ]
}
```

## What ChatGPT Needs to Know

- The server runs locally on your machine at port 43110
- Send POST requests to `/submit-batch` for multiple prompts
- Send POST requests to `/submit` for a single prompt
- The plugin will automatically queue and submit them to Midjourney with proper delays

## Example Conversation

**You**: "Generate 5 cyberpunk city prompts and send them to my Midjourney plugin"

**ChatGPT**: Will generate prompts and POST them to `http://localhost:43110/submit-batch`

That's it! No need to remember complex commands.
