# ChatGPT Memory Training Guide

## Teaching ChatGPT About Your Midjourney Plugin

ChatGPT has a memory feature that lets it remember your preferences across conversations. Here's how to train it to automatically recognize when you want to use your Midjourney plugin.

## Initial Training Conversation

Copy and paste this into ChatGPT:

---

**You**: 

> I want to teach you about my Midjourney automation setup. Please remember these details:
>
> 1. I have a local Midjourney control plugin running at http://localhost:43110
> 2. When I say "send to Midjourney" or "submit to Midjourney", I want you to POST the prompts to http://localhost:43110/submit-batch
> 3. The API expects JSON format: `{"prompts": ["prompt1", "prompt2", ...]}`
> 4. For a single prompt, POST to http://localhost:43110/submit instead with `{"prompt": "text"}`
> 5. I also have Ideogram support at http://localhost:43111 (coming soon)
>
> When I ask you to generate image prompts and "send them", please:
> - Ask which service: Midjourney or Ideogram (if not specified)
> - Generate the prompts
> - Automatically POST them to the correct endpoint
> - Confirm submission
>
> Natural language triggers you should recognize:
> - "send to Midjourney" → POST to localhost:43110
> - "submit these" (after generating Midjourney prompts) → POST to localhost:43110
> - "send to Ideogram" → POST to localhost:43111
> - "queue these up" → POST to the last-mentioned service
> - "send them all" → POST all generated prompts
>
> Please confirm you've saved this to memory.

---

**ChatGPT will respond**: "I've saved these details to my memory. I'll automatically POST your prompts to the correct endpoint when you ask me to send them to Midjourney or Ideogram."

## Testing the Memory

After training, test with:

**You**: "Generate 3 cyberpunk city prompts and send to Midjourney"

**ChatGPT should**:
1. Generate 3 prompts
2. Automatically POST to localhost:43110/submit-batch
3. Confirm: "✅ Sent 3 prompts to your Midjourney queue"

## Natural Language Examples

Once trained, you can use any of these phrases:

### Midjourney
- "Create 5 fantasy prompts and send to Midjourney"
- "Generate prompts for landscapes and submit them"
- "Make 10 sci-fi prompts and queue them up"
- "Send these to Midjourney" (after ChatGPT generates prompts)

### Ideogram (when implemented)
- "Generate 5 logo design prompts for Ideogram"
- "Create text-based designs and send to Ideogram"
- "Make poster prompts and submit to Ideogram"

### Automatic Detection
- "Generate 20 diverse prompts and send them" → ChatGPT will ask: "Midjourney or Ideogram?"
- "Create prompts and queue" → ChatGPT will use the last service mentioned

## Advanced Memory Training

For more sophisticated behavior:

**You**:

> Additional preferences for my image generation workflow:
>
> - Default to Midjourney unless I mention Ideogram
> - When generating prompts, always include aspect ratio (--ar 16:9 for landscapes, --ar 9:16 for portraits)
> - For Midjourney, prefer --v 6 unless I specify otherwise
> - Batch size: default to 5 prompts unless I specify
> - After submitting, automatically tell me the queue will take (number × 20) seconds
> - If I say "check queue", GET http://localhost:43110/queue

---

## Checking ChatGPT's Memory

At any time, ask:

> "What do you remember about my Midjourney setup?"

ChatGPT will recall all the details you've trained it on.

## Updating Memory

To change behavior:

> "Update my Midjourney memory: default to 10 prompts instead of 5"

Or:

> "Forget my Midjourney preferences" (to reset)

## Multi-Service Workflow

Train ChatGPT to handle both services intelligently:

**You**:

> When I'm working on a project, remember which service I'm using:
> 
> - Midjourney: Better for artistic, photorealistic, and detailed images
> - Ideogram: Better for text-in-images, logos, posters, graphics
>
> If I ask for "logo prompts" → suggest Ideogram
> If I ask for "landscape prompts" → suggest Midjourney
> If I ask for "prompts with text" → suggest Ideogram
>
> Always let me override by explicitly saying the service name.

---

## Example Trained Conversation

**You**: "I need prompts for a fantasy game"

**ChatGPT**: "I'll create Midjourney prompts for fantasy game scenes. How many would you like?"

**You**: "10"

**ChatGPT**: 
```
I'll generate 10 fantasy game prompts for Midjourney.

[Generates 10 prompts]

Submitting to your Midjourney queue...
[POST to localhost:43110/submit-batch]

✅ Successfully submitted 10 prompts!
Queue will take approximately 3.5 minutes to process.
```

## Troubleshooting Memory

### Memory Not Working?

1. **Check if memory is enabled**:
   - ChatGPT Settings → Personalization → Memory → ON

2. **Explicitly save**:
   - Add "and save this to memory" to your training messages

3. **Re-train**:
   - Sometimes you need to repeat the training conversation

### ChatGPT Forgets?

- Memory can occasionally reset
- Keep the training text saved somewhere
- Re-paste when needed

## Sample Training Script (Copy-Paste Ready)

```
I have a local image generation automation setup:

MIDJOURNEY:
- Endpoint: http://localhost:43110
- Single prompt: POST /submit with {"prompt": "text"}
- Batch: POST /submit-batch with {"prompts": ["p1", "p2"]}
- Check queue: GET /queue
- Default delay: 20 seconds between prompts

IDEOGRAM (coming soon):
- Endpoint: http://localhost:43111
- Same API structure as Midjourney

MY PREFERENCES:
- When I say "send to Midjourney" → automatically POST to localhost:43110
- When I say "send to Ideogram" → automatically POST to localhost:43111
- Default service: Midjourney (unless I mention Ideogram)
- Default batch size: 5 prompts
- Always include --ar and --v flags for Midjourney
- After submission, tell me queue processing time

TRIGGERS:
- "send", "submit", "queue" → POST to appropriate endpoint
- "check queue" → GET /queue
- "clear queue" → DELETE /queue

Remember: localhost endpoints only work when server is running.
Please confirm you've saved this.
```

## Pro Tips

1. **Be specific in training** - The more details, the better
2. **Use consistent language** - Train with the same phrases you'll use
3. **Test immediately** - Verify memory works right after training
4. **Update as needed** - Add new preferences over time
5. **Share context** - Mention when server isn't running

## Future: Ideogram Integration

When we add Ideogram support, just update ChatGPT's memory:

> "Update: My Ideogram endpoint at localhost:43111 is now active. Same API structure as Midjourney."

ChatGPT will automatically start routing Ideogram requests there!

---

## Quick Reference Card

Once trained, your workflow becomes:

```
You → "Generate 10 cyberpunk prompts"
ChatGPT → [generates prompts]

You → "Send them"
ChatGPT → [POSTs to localhost:43110]
         → "✅ Submitted 10 prompts!"
```

No need to specify endpoints, JSON format, or HTTP methods. ChatGPT handles it all!
