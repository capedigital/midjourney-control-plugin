// Background service worker for Midjourney Control Plugin

const DEFAULT_DELAY = 20000; // 20 seconds between submissions
let promptQueue = [];
let isProcessing = false;
let settings = {
  delay: DEFAULT_DELAY,
  autoSubmit: true
};

// Load settings from storage on startup
chrome.storage.local.get(['settings', 'promptQueue'], (result) => {
  if (result.settings) {
    settings = { ...settings, ...result.settings };
  }
  if (result.promptQueue) {
    promptQueue = result.promptQueue;
  }
});

// Listen for messages from content script, popup, or external sources
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Background received message:', msg);

  switch (msg.type) {
    case 'add_prompt':
      addPromptToQueue(msg.prompt);
      sendResponse({ status: 'added', queueLength: promptQueue.length });
      break;

    case 'add_prompts':
      if (Array.isArray(msg.prompts)) {
        msg.prompts.forEach(p => addPromptToQueue(p));
      }
      sendResponse({ status: 'added', queueLength: promptQueue.length });
      break;

    case 'get_queue':
      sendResponse({ queue: promptQueue, isProcessing });
      break;

    case 'clear_queue':
      promptQueue = [];
      saveQueue();
      sendResponse({ status: 'cleared' });
      break;

    case 'update_settings':
      settings = { ...settings, ...msg.settings };
      chrome.storage.local.set({ settings });
      sendResponse({ status: 'updated', settings });
      break;

    case 'get_settings':
      sendResponse({ settings });
      break;

    case 'submission_complete':
      handleSubmissionComplete(msg.success, msg.error);
      sendResponse({ status: 'acknowledged' });
      break;

    case 'start_processing':
      processQueue();
      sendResponse({ status: 'processing started' });
      break;

    case 'stop_processing':
      isProcessing = false;
      sendResponse({ status: 'processing stopped' });
      break;

    default:
      sendResponse({ status: 'unknown command' });
  }

  return true; // Keep message channel open for async responses
});

// Add prompt to queue
function addPromptToQueue(prompt) {
  const queueItem = {
    id: Date.now() + Math.random(),
    prompt: prompt,
    addedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  promptQueue.push(queueItem);
  saveQueue();
  
  // Start processing if auto-submit is enabled and not already processing
  if (settings.autoSubmit && !isProcessing) {
    processQueue();
  }
  
  // Notify popup of queue update
  chrome.runtime.sendMessage({ type: 'queue_updated', queue: promptQueue });
}

// Save queue to storage
function saveQueue() {
  chrome.storage.local.set({ promptQueue });
}

// Process the queue
async function processQueue() {
  if (isProcessing || promptQueue.length === 0) {
    return;
  }

  isProcessing = true;
  notifyQueueUpdate();

  while (promptQueue.length > 0 && isProcessing) {
    const item = promptQueue[0];
    item.status = 'processing';
    notifyQueueUpdate();

    try {
      await submitPromptToMidjourney(item.prompt);
      
      // Wait for the configured delay before next submission
      if (promptQueue.length > 1) {
        await sleep(settings.delay);
      }
      
      // Remove completed item
      promptQueue.shift();
      saveQueue();
      notifyQueueUpdate();
      
    } catch (error) {
      console.error('Error submitting prompt:', error);
      item.status = 'error';
      item.error = error.message;
      notifyQueueUpdate();
      
      // Move failed item to end of queue or remove it
      promptQueue.shift();
      saveQueue();
    }
  }

  isProcessing = false;
  notifyQueueUpdate();
}

// Submit a prompt to Midjourney
async function submitPromptToMidjourney(prompt) {
  return new Promise((resolve, reject) => {
    // Find the Midjourney tab
    chrome.tabs.query({ url: 'https://www.midjourney.com/*' }, (tabs) => {
      if (tabs.length === 0) {
        reject(new Error('No Midjourney tab found. Please open https://www.midjourney.com'));
        return;
      }

      const tab = tabs[0];
      
      // Send message to content script to inject prompt
      chrome.tabs.sendMessage(tab.id, {
        type: 'inject_prompt',
        prompt: prompt
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.success) {
          resolve();
        } else {
          reject(new Error(response?.error || 'Failed to inject prompt'));
        }
      });
    });
  });
}

// Handle submission completion from content script
function handleSubmissionComplete(success, error) {
  if (success) {
    console.log('Prompt submitted successfully');
  } else {
    console.error('Prompt submission failed:', error);
  }
}

// Notify popup and other listeners of queue updates
function notifyQueueUpdate() {
  chrome.runtime.sendMessage({
    type: 'queue_updated',
    queue: promptQueue,
    isProcessing
  }).catch(() => {
    // Popup might not be open, ignore errors
  });
}

// Utility sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle external connections (for local API server)
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  console.log('External message received:', msg);
  
  if (msg.type === 'submit_prompt') {
    addPromptToQueue(msg.prompt);
    sendResponse({ status: 'added', queueLength: promptQueue.length });
  } else if (msg.type === 'submit_prompts') {
    if (Array.isArray(msg.prompts)) {
      msg.prompts.forEach(p => addPromptToQueue(p));
    }
    sendResponse({ status: 'added', queueLength: promptQueue.length });
  }
  
  return true;
});

console.log('Midjourney Control Plugin background script loaded');
