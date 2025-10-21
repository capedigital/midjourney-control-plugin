#!/usr/bin/env node

/**
 * Local API Server for Midjourney Control Plugin
 * 
 * This server exposes a simple REST API that ChatGPT or other tools can call
 * to submit prompts to the browser extension.
 * 
 * Usage:
 *   node server.js
 * 
 * Then POST to: http://localhost:43110/submit
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 43110;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory queue (shared with browser extension via messaging)
let promptQueue = [];

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Midjourney Control Plugin API',
    version: '0.1.0',
    queueLength: promptQueue.length
  });
});

// Submit a single prompt
app.post('/submit', (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: 'Missing prompt field'
    });
  }

  promptQueue.push({
    prompt,
    timestamp: new Date().toISOString()
  });

  // In a real implementation, this would send to the browser extension
  // For now, we'll just log it
  console.log('📝 Prompt received:', prompt);
  
  res.json({
    success: true,
    message: 'Prompt queued',
    queueLength: promptQueue.length
  });
});

// Submit multiple prompts
app.post('/submit-batch', (req, res) => {
  const { prompts } = req.body;
  
  if (!Array.isArray(prompts) || prompts.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid prompts array'
    });
  }

  const addedPrompts = prompts.map(prompt => ({
    prompt,
    timestamp: new Date().toISOString()
  }));

  promptQueue.push(...addedPrompts);
  
  console.log(`📝 ${prompts.length} prompts received`);
  
  res.json({
    success: true,
    message: `${prompts.length} prompts queued`,
    queueLength: promptQueue.length
  });
});

// Get current queue
app.get('/queue', (req, res) => {
  res.json({
    queue: promptQueue,
    length: promptQueue.length
  });
});

// Clear queue
app.delete('/queue', (req, res) => {
  const cleared = promptQueue.length;
  promptQueue = [];
  
  res.json({
    success: true,
    message: `Cleared ${cleared} prompts`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🎨 Midjourney Control Plugin API Server             ║
║                                                       ║
║  Status: ✓ Running                                   ║
║  Port:   ${PORT}                                         ║
║  URL:    http://localhost:${PORT}                       ║
╚═══════════════════════════════════════════════════════╝

Available endpoints:
  GET  /              - Health check
  POST /submit        - Submit single prompt
  POST /submit-batch  - Submit multiple prompts
  GET  /queue         - View current queue
  DELETE /queue       - Clear queue

Example usage:
  curl -X POST http://localhost:${PORT}/submit \\
    -H "Content-Type: application/json" \\
    -d '{"prompt":"a cyberpunk city at sunset --ar 16:9"}'

Ready to receive prompts! 🚀
  `);
});
