# Multi-Service Support

## Currently Supported

### Midjourney
- Port: `43110`
- Status: ✅ **Fully Working**
- Extension: Chrome extension included
- API: REST API available

### Ideogram
- Port: `43111`
- Status: 🚧 **Coming Soon**
- Extension: Not yet implemented
- API: Server ready, needs extension

## Running Multiple Services

### Start Both Services
```bash
npm run start:multi
```
This starts servers for both Midjourney (43110) and Ideogram (43111).

### Start Individual Services
```bash
npm run start:midjourney  # Port 43110
npm run start:ideogram    # Port 43111
```

## API Endpoints (Both Services)

Both services use identical API structure:

```bash
# Midjourney
POST http://localhost:43110/submit
POST http://localhost:43110/submit-batch
GET  http://localhost:43110/queue
DELETE http://localhost:43110/queue

# Ideogram (when ready)
POST http://localhost:43111/submit
POST http://localhost:43111/submit-batch
GET  http://localhost:43111/queue
DELETE http://localhost:43111/queue
```

## ChatGPT Integration

Train ChatGPT to use both services (see [CHATGPT_MEMORY.md](CHATGPT_MEMORY.md)):

```
My image generation setup:
- Midjourney: http://localhost:43110
- Ideogram: http://localhost:43111

When I say "send to Midjourney" → POST to 43110
When I say "send to Ideogram" → POST to 43111
```

Then just tell ChatGPT:
- "Generate 5 landscape prompts and send to Midjourney"
- "Create 3 logo prompts and send to Ideogram"

## Ideogram Extension (Coming Soon)

To add Ideogram support:

1. **Create Ideogram Extension** (similar to Midjourney)
   - DOM selectors for ideogram.ai
   - Prompt injection logic
   - Queue management

2. **Connect to API**
   - Extension connects to port 43111
   - Same protocol as Midjourney

3. **Use Both**
   - Run `npm run start:multi`
   - ChatGPT can route to either service

## Future Services

The architecture supports adding more services:

```javascript
// In server-multi.js
const SERVICES = {
  midjourney: { port: 43110 },
  ideogram: { port: 43111 },
  dalle: { port: 43112 },      // Future
  stablediffusion: { port: 43113 }, // Future
};
```

Each service gets:
- Dedicated port
- Own queue
- Same API structure
- ChatGPT can use all of them

## Why This Architecture?

**Consistency**: Same API for all services  
**Flexibility**: Run only what you need  
**Scalability**: Easy to add new services  
**ChatGPT-Friendly**: Simple mental model for AI  

Train ChatGPT once, use everywhere!
