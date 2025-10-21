// Content script for Midjourney Control Plugin
// Runs on midjourney.com pages

console.log('Midjourney Control Plugin content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Content script received message:', msg);

  if (msg.type === 'inject_prompt') {
    injectAndSubmitPrompt(msg.prompt)
      .then(() => {
        sendResponse({ success: true });
        // Notify background of successful submission
        chrome.runtime.sendMessage({
          type: 'submission_complete',
          success: true
        });
      })
      .catch((error) => {
        console.error('Error injecting prompt:', error);
        sendResponse({ success: false, error: error.message });
        chrome.runtime.sendMessage({
          type: 'submission_complete',
          success: false,
          error: error.message
        });
      });
    
      return true; // Keep message channel open for async response
  } else if (msg.type === 'read_content') {
    const selector = msg.selector || 'body';
    const element = document.querySelector(selector);
    const content = element ? element.textContent.trim() : 'Element not found';
    sendResponse({ success: true, content: content });
    return true;
  }
});// Listen for messages from the page (window.postMessage)
window.addEventListener('message', (event) => {
  // Only accept messages from same origin
  if (event.origin !== window.location.origin) return;
  
  if (event.data && event.data.type === 'MCP_SUBMIT_PROMPT') {
    console.log('Received MCP_SUBMIT_PROMPT message:', event.data);
    chrome.runtime.sendMessage({
      type: 'add_prompt',
      prompt: event.data.prompt
    });
  } else if (event.data && event.data.type === 'MCP_SUBMIT_PROMPTS') {
    console.log('Received MCP_SUBMIT_PROMPTS message:', event.data);
    chrome.runtime.sendMessage({
      type: 'add_prompts',
      prompts: event.data.prompts
    });
  } else if (event.data && event.data.type === 'MCP_READ_CONTENT') {
    // Handle read content requests
    const selector = event.data.selector || 'body';
    const element = document.querySelector(selector);
    const content = element ? element.textContent : 'Element not found';
    window.postMessage({
      type: 'MCP_CONTENT_RESPONSE',
      content: content
    }, '*');
  }
});

// Function to inject and submit a prompt
async function injectAndSubmitPrompt(promptText) {
  return new Promise((resolve, reject) => {
    try {
      // Try multiple selectors to find the prompt input
      const selectors = [
        'textarea[placeholder*="imagine"]',
        'textarea[placeholder*="Imagine"]',
        'textarea',
        'input[type="text"]'
      ];

      let textarea = null;
      for (const selector of selectors) {
        textarea = document.querySelector(selector);
        if (textarea) {
          console.log('Found textarea with selector:', selector);
          break;
        }
      }

      if (!textarea) {
        reject(new Error('Could not find prompt input field on page'));
        return;
      }

      // Set the value and trigger input events
      textarea.value = promptText;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Also try setting via React/Vue if they're using those frameworks
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(textarea, promptText);
      
      const inputEvent = new Event('input', { bubbles: true });
      textarea.dispatchEvent(inputEvent);

      console.log('Prompt text injected:', promptText);

      // Wait a bit for UI to update
      setTimeout(() => {
        // Try to find and click the submit/imagine button
        const buttons = Array.from(document.querySelectorAll('button'));
        const imagineButton = buttons.find(b => {
          const text = b.textContent.trim().toLowerCase();
          return text === 'imagine' || text === 'submit' || text.includes('imagine');
        });

        if (imagineButton) {
          console.log('Found Imagine button, clicking...');
          imagineButton.click();
          resolve();
        } else {
          console.warn('Could not find Imagine button');
          // Still resolve as the text was injected successfully
          resolve();
        }
      }, 500);

    } catch (error) {
      console.error('Error in injectAndSubmitPrompt:', error);
      reject(error);
    }
  });
}

// Expose a global function for manual testing
window.MCPInject = function(prompt) {
  return injectAndSubmitPrompt(prompt);
};

console.log('Content script ready. You can test with: MCPInject("your prompt here")');
