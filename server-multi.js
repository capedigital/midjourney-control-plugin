#!/usr/bin/env node

/**
 * Multi-Service Image Generation API Server
 * 
 * Supports:
 * - Midjourney (port 43110)
 * - Ideogram (port 43111)
 * 
 * Both use the same API structure for consistency
 */

const express = require('express');

// Configuration
const SERVICES = {
  midjourney: {
    port: 43110,
    name: 'Midjourney',
    extensionPort: null, // Uses Chrome extension directly
  },
  ideogram: {
    port: 43111,
    name: 'Ideogram',
    extensionPort: null, // Future: different extension
  }
};

function createServer(serviceName, config) {
  const app = express();
  const PORT = config.port;
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

  // In-memory queue (would be shared with browser extension in production)
  let promptQueue = [];

  // Health check
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      service: config.name,
      version: '0.2.0',
      queueLength: promptQueue.length
    });
  });

  // Submit single prompt
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
      timestamp: new Date().toISOString(),
      service: serviceName
    });

    console.log(`📝 [${config.name}] Prompt received:`, prompt.substring(0, 50) + '...');
    
    res.json({
      success: true,
      message: 'Prompt queued',
      service: serviceName,
      queueLength: promptQueue.length
    });
  });

  // Submit batch of prompts
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
      timestamp: new Date().toISOString(),
      service: serviceName
    }));

    promptQueue.push(...addedPrompts);
    
    console.log(`📝 [${config.name}] ${prompts.length} prompts received`);
    
    res.json({
      success: true,
      message: `${prompts.length} prompts queued`,
      service: serviceName,
      queueLength: promptQueue.length
    });
  });

  // Get queue
  app.get('/queue', (req, res) => {
    res.json({
      service: serviceName,
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
      message: `Cleared ${cleared} prompts`,
      service: serviceName
    });
  });

  // Start server
  app.listen(PORT, HOST, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║  🎨 ${config.name} API Server                           
║                                                       ║
║  Status: ✓ Running                                   ║
║  Host:   ${HOST} (localhost only - SECURE)           ║
║  Port:   ${PORT}                                         ║
║  URL:    http://localhost:${PORT}                       ║
╚═══════════════════════════════════════════════════════╝

🔒 Security: Server only accepts connections from THIS computer.

Available endpoints:
  GET  /              - Health check
  POST /submit        - Submit single prompt
  POST /submit-batch  - Submit multiple prompts
  GET  /queue         - View current queue
  DELETE /queue       - Clear queue

Ready to receive ${config.name} prompts! 🚀
    `);
  });

  return app;
}

// Determine which services to start
const args = process.argv.slice(2);
const servicesToStart = args.length > 0 ? args : ['midjourney'];

// Start requested services
servicesToStart.forEach(serviceName => {
  const config = SERVICES[serviceName];
  if (!config) {
    console.error(`❌ Unknown service: ${serviceName}`);
    console.error(`Available services: ${Object.keys(SERVICES).join(', ')}`);
    process.exit(1);
  }
  
  createServer(serviceName, config);
});

console.log(`
┌─────────────────────────────────────────────────────┐
│  Multi-Service Image Generation API                │
│  Running: ${servicesToStart.join(', ').toUpperCase()}${' '.repeat(Math.max(0, 38 - servicesToStart.join(', ').length))}│
└─────────────────────────────────────────────────────┘

Train ChatGPT with these endpoints:
${servicesToStart.map(s => `  - ${SERVICES[s].name}: http://localhost:${SERVICES[s].port}`).join('\n')}

See CHATGPT_MEMORY.md for training instructions!
`);
