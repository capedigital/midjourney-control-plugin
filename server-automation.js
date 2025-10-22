#!/usr/bin/env node

/**
 * Advanced Browser Automation API Server
 * 
 * Provides high-level automation primitives for AI agents
 * Exposes content-advanced.js capabilities via REST API
 */

const express = require('express');

const app = express();
const PORT = 43110;
const HOST = '127.0.0.1';

// Middleware
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory connection tracking
const connections = new Map();

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Browser Automation API',
    version: '0.3.0',
    capabilities: [
      'DOM queries',
      'Element actions',
      'Content extraction',
      'Batch operations',
      'Safety checks',
      'Navigation'
    ]
  });
});

/**
 * DOM QUERIES
 */

app.post('/api/query', async (req, res) => {
  const { selector, tag, text, visible = true, limit } = req.body;
  
  res.json({
    endpoint: '/api/query',
    description: 'Query DOM elements by selector, tag, or text',
    params: { selector, tag, text, visible, limit },
    note: 'This endpoint requires browser extension integration'
  });
});

/**
 * ELEMENT ACTIONS
 */

app.post('/api/click-by-text', async (req, res) => {
  const { text, exact = false, tag, timeout = 5000 } = req.body;
  
  if (!text) {
    return res.status(400).json({ success: false, error: 'Missing text parameter' });
  }

  console.log(`🖱️  Click by text: "${text}"`);
  
  res.json({
    success: true,
    action: 'clickByText',
    params: { text, exact, tag, timeout },
    note: 'This will be executed by browser extension'
  });
});

app.post('/api/type-in-field', async (req, res) => {
  const { label, value, submit = false } = req.body;
  
  if (!label || value === undefined) {
    return res.status(400).json({ success: false, error: 'Missing label or value' });
  }

  console.log(`⌨️  Type in field: ${label} = ${value}`);
  
  res.json({
    success: true,
    action: 'typeInField',
    params: { label, value, submit }
  });
});

app.post('/api/select-option', async (req, res) => {
  const { selector, option } = req.body;
  
  if (!selector || !option) {
    return res.status(400).json({ success: false, error: 'Missing selector or option' });
  }

  console.log(`📋 Select option: ${selector} → ${option}`);
  
  res.json({
    success: true,
    action: 'select',
    params: { selector, option }
  });
});

/**
 * SCROLL OPERATIONS
 */

app.post('/api/scroll-to-element', async (req, res) => {
  const { selector, text, behavior = 'smooth' } = req.body;
  
  if (!selector && !text) {
    return res.status(400).json({ success: false, error: 'Missing selector or text' });
  }

  console.log(`📜 Scroll to: ${selector || text}`);
  
  res.json({
    success: true,
    action: 'scrollToElement',
    params: { selector, text, behavior }
  });
});

app.post('/api/scroll', async (req, res) => {
  const { x = 0, y = 0, behavior = 'smooth' } = req.body;
  
  console.log(`📜 Scroll by: x=${x}, y=${y}`);
  
  res.json({
    success: true,
    action: 'scroll',
    params: { x, y, behavior }
  });
});

/**
 * BATCH OPERATIONS
 */

app.post('/api/batch', async (req, res) => {
  const { actions } = req.body;
  
  if (!Array.isArray(actions)) {
    return res.status(400).json({ success: false, error: 'Actions must be an array' });
  }

  console.log(`🔄 Batch operation: ${actions.length} actions`);
  
  res.json({
    success: true,
    action: 'batch',
    count: actions.length,
    actions
  });
});

/**
 * CONTENT EXTRACTION
 */

app.post('/api/extract-content', async (req, res) => {
  const { selector, structure = false } = req.body;
  
  console.log(`📄 Extract content: ${selector || 'full page'}`);
  
  res.json({
    success: true,
    action: 'extractContent',
    params: { selector, structure }
  });
});

app.post('/api/extract-links', async (req, res) => {
  const { selector = 'a', includeText = true } = req.body;
  
  console.log(`🔗 Extract links`);
  
  res.json({
    success: true,
    action: 'extractLinks',
    params: { selector, includeText }
  });
});

app.post('/api/extract-images', async (req, res) => {
  const { selector = 'img', minWidth = 0, minHeight = 0 } = req.body;
  
  console.log(`🖼️  Extract images`);
  
  res.json({
    success: true,
    action: 'extractImages',
    params: { selector, minWidth, minHeight }
  });
});

/**
 * NAVIGATION
 */

app.post('/api/navigate', async (req, res) => {
  const { action, url } = req.body;
  
  if (!action) {
    return res.status(400).json({ success: false, error: 'Missing action' });
  }

  console.log(`🧭 Navigate: ${action} ${url || ''}`);
  
  res.json({
    success: true,
    action: 'navigate',
    params: { action, url }
  });
});

/**
 * SAFETY CHECKS
 */

app.post('/api/detect-sensitive', async (req, res) => {
  console.log(`🔒 Detect sensitive fields`);
  
  res.json({
    success: true,
    action: 'detectSensitive'
  });
});

app.post('/api/detect-payment', async (req, res) => {
  console.log(`💳 Detect payment page`);
  
  res.json({
    success: true,
    action: 'detectPayment'
  });
});

/**
 * MIDJOURNEY-SPECIFIC ENDPOINTS (legacy)
 */

app.post('/submit', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Missing prompt' });
  }

  console.log(`📝 Submit prompt: ${prompt.substring(0, 50)}...`);
  
  res.json({
    success: true,
    message: 'Prompt queued',
    prompt
  });
});

app.post('/submit-batch', async (req, res) => {
  const { prompts } = req.body;
  
  if (!Array.isArray(prompts)) {
    return res.status(400).json({ success: false, error: 'Prompts must be an array' });
  }

  console.log(`📝 Submit batch: ${prompts.length} prompts`);
  
  res.json({
    success: true,
    message: `${prompts.length} prompts queued`,
    count: prompts.length
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🤖 Advanced Browser Automation API                  ║
║                                                       ║
║  Status: ✓ Running                                   ║
║  Host:   ${HOST} (localhost only - SECURE)           ║
║  Port:   ${PORT}                                         ║
║  URL:    http://localhost:${PORT}                       ║
╚═══════════════════════════════════════════════════════╝

🔒 Security: Server only accepts connections from THIS computer.

High-level Automation Endpoints:
  
  🔍 DOM Queries
  POST /api/query              - Find elements by selector/text/tag
  
  🖱️  Element Actions
  POST /api/click-by-text      - Click element by visible text
  POST /api/type-in-field      - Type in field by label
  POST /api/select-option      - Select dropdown option
  
  📜 Scroll Operations
  POST /api/scroll-to-element  - Scroll element into view
  POST /api/scroll             - Scroll by x/y amount
  
  🔄 Batch Operations
  POST /api/batch              - Execute multiple actions atomically
  
  📄 Content Extraction
  POST /api/extract-content    - Get visible text/structure
  POST /api/extract-links      - Get all links from page
  POST /api/extract-images     - Get all images from page
  
  🧭 Navigation
  POST /api/navigate           - Back/forward/reload/goto
  
  🔒 Safety Checks
  POST /api/detect-sensitive   - Find sensitive form fields
  POST /api/detect-payment     - Detect payment pages

  📝 Legacy Midjourney
  POST /submit                 - Submit single prompt
  POST /submit-batch           - Submit multiple prompts

Ready for AI-driven automation! 🚀
  `);
});
