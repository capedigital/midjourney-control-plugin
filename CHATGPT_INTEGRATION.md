# ChatGPT Integration Guide

## ChatGPT with Browser Access (Atlas, etc.)

**Perfect for ChatGPT users!** ChatGPT can directly POST to your local API.

## Quick Start

1. Start the API server: `npm start`
2. Tell ChatGPT:

> "Generate 5 cyberpunk prompts and POST them to http://localhost:43110/submit-batch"

or just:

> "Send these to my Midjourney plugin at localhost:43110"

ChatGPT will automatically format the JSON and submit!

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

## Example Conversations

### Basic Usage

**You**: "Generate 5 cyberpunk city prompts and POST them to localhost:43110/submit-batch"

**ChatGPT**: 
```
I'll generate 5 cyberpunk city prompts and submit them to your Midjourney plugin.

[Makes POST request to http://localhost:43110/submit-batch]

✅ Successfully submitted 5 prompts:
1. Neon-lit megacity with flying vehicles...
2. Dystopian urban sprawl with holographic ads...
[etc.]
```

### Natural Language

**You**: "Create 3 fantasy landscape prompts and send to my Midjourney plugin"

**ChatGPT**: Will understand "my Midjourney plugin" means localhost:43110 and POST the prompts automatically!

### Check Status

**You**: "What's in my Midjourney queue?"

**ChatGPT**: 
```
[Makes GET request to http://localhost:43110/queue]

Your queue has 3 pending prompts:
1. Ethereal fantasy landscape...
2. Mystical forest...
3. Ancient ruins...
```

That's it! ChatGPT handles all the API calls for you.
