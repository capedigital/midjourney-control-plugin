#!/usr/bin/env node

/**
 * Midjourney Control MCP Server
 * 
 * Exposes Midjourney browser control as MCP tools that AI assistants can call.
 * Acts as a bridge between AI (like Claude) and the Chrome extension.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { WebSocketServer } from 'ws';

// Queue management
let promptQueue = [];
let extensionConnection = null;

// Create HTTP server for extension to connect to
const app = express();
const HTTP_PORT = 43110;

app.use(express.json());

// WebSocket server for real-time communication with extension
const wss = new WebSocketServer({ port: 43111 });

wss.on('connection', (ws) => {
  console.error('✅ Chrome extension connected');
  extensionConnection = ws;
  
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    handleExtensionMessage(data);
  });
  
  ws.on('close', () => {
    console.error('❌ Chrome extension disconnected');
    extensionConnection = null;
  });
});

// Handle messages from extension
function handleExtensionMessage(data) {
  if (data.type === 'queue_update') {
    promptQueue = data.queue || [];
  } else if (data.type === 'status_update') {
    // Could forward status to AI if needed
    console.error(`📊 Status: ${data.status}`);
  }
}

// Send command to extension
async function sendToExtension(command) {
  if (!extensionConnection) {
    throw new Error('Chrome extension not connected. Make sure the extension is installed and Midjourney.com is open.');
  }
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Extension did not respond in time'));
    }, 10000);
    
    extensionConnection.once('message', (message) => {
      clearTimeout(timeout);
      const response = JSON.parse(message.toString());
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error || 'Extension command failed'));
      }
    });
    
    extensionConnection.send(JSON.stringify(command));
  });
}

// Create MCP server
const server = new Server(
  {
    name: 'midjourney-control',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'submit_prompt',
        description: 'Submit a single prompt to Midjourney. The prompt will be queued and submitted automatically with appropriate delays.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The Midjourney prompt to submit (e.g., "a serene mountain landscape --ar 16:9")',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'submit_prompts_batch',
        description: 'Submit multiple prompts to Midjourney at once. They will be queued and processed sequentially with delays.',
        inputSchema: {
          type: 'object',
          properties: {
            prompts: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of Midjourney prompts to submit',
            },
          },
          required: ['prompts'],
        },
      },
      {
        name: 'get_queue_status',
        description: 'Get the current status of the prompt queue, including pending prompts and processing state.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'clear_queue',
        description: 'Clear all pending prompts from the queue.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'set_delay',
        description: 'Set the delay between prompt submissions (in seconds).',
        inputSchema: {
          type: 'object',
          properties: {
            seconds: {
              type: 'number',
              description: 'Delay in seconds (5-120)',
              minimum: 5,
              maximum: 120,
            },
          },
          required: ['seconds'],
        },
      },
      {
        name: 'read_page_content',
        description: 'Read visible text content from the current Midjourney page. Useful for checking status or results.',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'Optional CSS selector to read specific content',
            },
          },
        },
      },
      {
        name: 'check_extension_status',
        description: 'Check if the Chrome extension is connected and ready to receive commands.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'submit_prompt': {
        const result = await sendToExtension({
          type: 'add_prompt',
          prompt: args.prompt,
        });
        return {
          content: [
            {
              type: 'text',
              text: `✅ Prompt queued successfully. Queue length: ${result.queueLength}`,
            },
          ],
        };
      }

      case 'submit_prompts_batch': {
        const result = await sendToExtension({
          type: 'add_prompts',
          prompts: args.prompts,
        });
        return {
          content: [
            {
              type: 'text',
              text: `✅ ${args.prompts.length} prompts queued. Total queue length: ${result.queueLength}`,
            },
          ],
        };
      }

      case 'get_queue_status': {
        const result = await sendToExtension({
          type: 'get_queue',
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                queue: result.queue,
                isProcessing: result.isProcessing,
                queueLength: result.queue?.length || 0,
              }, null, 2),
            },
          ],
        };
      }

      case 'clear_queue': {
        await sendToExtension({
          type: 'clear_queue',
        });
        return {
          content: [
            {
              type: 'text',
              text: '✅ Queue cleared successfully',
            },
          ],
        };
      }

      case 'set_delay': {
        await sendToExtension({
          type: 'update_settings',
          settings: { delay: args.seconds * 1000 },
        });
        return {
          content: [
            {
              type: 'text',
              text: `✅ Delay set to ${args.seconds} seconds`,
            },
          ],
        };
      }

      case 'read_page_content': {
        const result = await sendToExtension({
          type: 'read_content',
          selector: args.selector,
        });
        return {
          content: [
            {
              type: 'text',
              text: result.content || 'No content found',
            },
          ],
        };
      }

      case 'check_extension_status': {
        return {
          content: [
            {
              type: 'text',
              text: extensionConnection
                ? '✅ Extension connected and ready'
                : '❌ Extension not connected. Please install the extension and open Midjourney.com',
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start HTTP server (for health checks)
app.get('/health', (req, res) => {
  res.json({
    status: 'running',
    extensionConnected: !!extensionConnection,
    queueLength: promptQueue.length,
  });
});

app.listen(HTTP_PORT, '127.0.0.1', () => {
  console.error(`🌐 HTTP server listening on http://127.0.0.1:${HTTP_PORT}`);
  console.error(`🔌 WebSocket server listening on ws://127.0.0.1:43111`);
  console.error(`📡 Waiting for Chrome extension to connect...`);
});

// Start MCP server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🎨 Midjourney MCP Server running');
  console.error('Ready to receive commands from AI assistants!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
