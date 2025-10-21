// Popup script for Midjourney Control Plugin

let currentQueue = [];
let isProcessing = false;
let settings = {
  delay: 20,
  autoSubmit: true
};

// DOM elements
const queueCountEl = document.getElementById('queue-count');
const statusEl = document.getElementById('status');
const delayInput = document.getElementById('delay-input');
const autoSubmitCheckbox = document.getElementById('auto-submit');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const queueListEl = document.getElementById('queue-list');
const promptInput = document.getElementById('prompt-input');
const addPromptBtn = document.getElementById('add-prompt-btn');

// Initialize popup
async function init() {
  // Load current queue and settings
  chrome.runtime.sendMessage({ type: 'get_queue' }, (response) => {
    if (response) {
      currentQueue = response.queue || [];
      isProcessing = response.isProcessing || false;
      updateUI();
    }
  });

  chrome.runtime.sendMessage({ type: 'get_settings' }, (response) => {
    if (response && response.settings) {
      settings = response.settings;
      delayInput.value = settings.delay / 1000; // Convert ms to seconds
      autoSubmitCheckbox.checked = settings.autoSubmit;
    }
  });

  // Listen for queue updates from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'queue_updated') {
      currentQueue = msg.queue || [];
      isProcessing = msg.isProcessing || false;
      updateUI();
    }
  });
}

// Update UI
function updateUI() {
  // Update queue count
  queueCountEl.textContent = currentQueue.length;

  // Update status
  if (isProcessing) {
    statusEl.textContent = 'Processing';
    statusEl.style.color = '#f59e0b';
  } else if (currentQueue.length > 0) {
    statusEl.textContent = 'Ready';
    statusEl.style.color = '#667eea';
  } else {
    statusEl.textContent = 'Idle';
    statusEl.style.color = '#666';
  }

  // Update queue list
  renderQueue();
}

// Render queue list
function renderQueue() {
  if (currentQueue.length === 0) {
    queueListEl.innerHTML = '<p class="empty-message">No prompts in queue</p>';
    return;
  }

  queueListEl.innerHTML = currentQueue.map((item, index) => {
    const statusClass = item.status || 'pending';
    const statusText = item.status === 'processing' ? 'Processing...' : 
                       item.status === 'error' ? 'Failed' : 
                       `#${index + 1}`;
    
    return `
      <div class="queue-item ${statusClass}">
        <div class="prompt-text">${escapeHtml(item.prompt)}</div>
        <div class="meta">
          <span class="status-badge ${statusClass}">${statusText}</span>
          ${item.error ? `<span style="color: #ef4444;"> - ${escapeHtml(item.error)}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
delayInput.addEventListener('change', () => {
  const delaySeconds = parseInt(delayInput.value);
  if (delaySeconds >= 5 && delaySeconds <= 120) {
    settings.delay = delaySeconds * 1000; // Convert to ms
    chrome.runtime.sendMessage({
      type: 'update_settings',
      settings: { delay: settings.delay }
    });
  }
});

autoSubmitCheckbox.addEventListener('change', () => {
  settings.autoSubmit = autoSubmitCheckbox.checked;
  chrome.runtime.sendMessage({
    type: 'update_settings',
    settings: { autoSubmit: settings.autoSubmit }
  });
});

startBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'start_processing' }, () => {
    console.log('Started processing queue');
  });
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'stop_processing' }, () => {
    console.log('Stopped processing queue');
  });
});

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the queue?')) {
    chrome.runtime.sendMessage({ type: 'clear_queue' }, () => {
      console.log('Queue cleared');
    });
  }
});

addPromptBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if (prompt) {
    chrome.runtime.sendMessage({
      type: 'add_prompt',
      prompt: prompt
    }, (response) => {
      console.log('Prompt added:', response);
      promptInput.value = '';
    });
  }
});

// Allow Enter to add prompt (Ctrl+Enter for newline)
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    addPromptBtn.click();
  }
});

// Initialize on load
init();
