// MCP Bridge - Connects Chrome extension to MCP server
// This runs in the background and maintains WebSocket connection

let mcpSocket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const MCP_SERVER_URL = 'ws://127.0.0.1:43111';

// Try to connect to MCP server
function connectToMCP() {
  if (mcpSocket && mcpSocket.readyState === WebSocket.OPEN) {
    return; // Already connected
  }

  console.log('Attempting to connect to MCP server...');
  
  try {
    mcpSocket = new WebSocket(MCP_SERVER_URL);
    
    mcpSocket.onopen = () => {
      console.log('✅ Connected to MCP server');
      reconnectAttempts = 0;
      
      // Send initial status
      sendMCPMessage({
        type: 'status_update',
        status: 'connected'
      });
    };
    
    mcpSocket.onclose = () => {
      console.log('❌ Disconnected from MCP server');
      mcpSocket = null;
      
      // Try to reconnect
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        setTimeout(connectToMCP, 2000 * reconnectAttempts);
      }
    };
    
    mcpSocket.onerror = (error) => {
      console.error('MCP WebSocket error:', error);
    };
    
    mcpSocket.onmessage = (event) => {
      try {
        const command = JSON.parse(event.data);
        handleMCPCommand(command);
      } catch (error) {
        console.error('Error handling MCP message:', error);
      }
    };
  } catch (error) {
    console.error('Error connecting to MCP server:', error);
  }
}

// Handle commands from MCP server
async function handleMCPCommand(command) {
  console.log('Received MCP command:', command.type);
  
  try {
    let response = { success: true };
    
    switch (command.type) {
      case 'add_prompt':
        addPromptToQueue(command.prompt);
        response.queueLength = promptQueue.length;
        break;
        
      case 'add_prompts':
        if (Array.isArray(command.prompts)) {
          command.prompts.forEach(p => addPromptToQueue(p));
        }
        response.queueLength = promptQueue.length;
        break;
        
      case 'get_queue':
        response.queue = promptQueue;
        response.isProcessing = isProcessing;
        break;
        
      case 'clear_queue':
        promptQueue = [];
        saveQueue();
        break;
        
      case 'update_settings':
        settings = { ...settings, ...command.settings };
        chrome.storage.local.set({ settings });
        break;
        
      case 'read_content':
        // This would need a content script implementation
        response.content = await readPageContent(command.selector);
        break;
        
      default:
        throw new Error(`Unknown command: ${command.type}`);
    }
    
    sendMCPMessage(response);
  } catch (error) {
    sendMCPMessage({
      success: false,
      error: error.message
    });
  }
}

// Send message to MCP server
function sendMCPMessage(data) {
  if (mcpSocket && mcpSocket.readyState === WebSocket.OPEN) {
    mcpSocket.send(JSON.stringify(data));
  }
}

// Read content from page
async function readPageContent(selector) {
  return new Promise((resolve) => {
    chrome.tabs.query({ url: 'https://www.midjourney.com/*' }, (tabs) => {
      if (tabs.length === 0) {
        resolve('No Midjourney tab open');
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'read_content',
        selector: selector
      }, (response) => {
        resolve(response?.content || 'Could not read content');
      });
    });
  });
}

// Notify MCP server of queue updates
function notifyMCPQueueUpdate() {
  sendMCPMessage({
    type: 'queue_update',
    queue: promptQueue,
    isProcessing: isProcessing
  });
}

// Try to connect when extension loads
connectToMCP();

// Try to reconnect when tab becomes active (user might have started MCP server)
chrome.tabs.onActivated.addListener(() => {
  if (!mcpSocket || mcpSocket.readyState !== WebSocket.OPEN) {
    connectToMCP();
  }
});

// Export for use in main background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    connectToMCP,
    sendMCPMessage,
    notifyMCPQueueUpdate
  };
}
