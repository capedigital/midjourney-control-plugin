/**
 * Advanced Content Script - High-level Browser Automation Primitives
 * 
 * Provides structured DOM queries, element actions, and content extraction
 * for AI-driven browser automation.
 */

(function() {
  'use strict';

  // Namespace for advanced automation functions
  window.MJControl = window.MJControl || {};

  /**
   * STRUCTURED DOM QUERIES
   */

  // Find elements by various criteria
  window.MJControl.queryElements = function(options = {}) {
    const {
      selector = null,
      tag = null,
      text = null,
      visible = true,
      limit = null
    } = options;

    let elements = [];

    // Query by selector
    if (selector) {
      elements = Array.from(document.querySelectorAll(selector));
    }
    // Query by tag
    else if (tag) {
      elements = Array.from(document.getElementsByTagName(tag));
    }
    // Query all if no criteria
    else {
      elements = Array.from(document.querySelectorAll('*'));
    }

    // Filter by text content
    if (text) {
      const searchText = text.toLowerCase();
      elements = elements.filter(el => {
        const elText = el.textContent?.toLowerCase() || '';
        return elText.includes(searchText);
      });
    }

    // Filter by visibility
    if (visible) {
      elements = elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               el.offsetParent !== null;
      });
    }

    // Apply limit
    if (limit && limit > 0) {
      elements = elements.slice(0, limit);
    }

    // Return structured data
    return elements.map((el, index) => ({
      index,
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim() || '',
      value: el.value || null,
      href: el.href || null,
      src: el.src || null,
      className: el.className || '',
      id: el.id || '',
      attributes: Array.from(el.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
      boundingBox: el.getBoundingClientRect(),
      selector: generateSelector(el)
    }));
  };

  // Generate a unique selector for an element
  function generateSelector(el) {
    if (el.id) return `#${el.id}`;
    
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      if (el.className) {
        selector += '.' + el.className.split(' ').filter(c => c).join('.');
      }
      path.unshift(selector);
      el = el.parentNode;
      if (path.length > 3) break; // Keep it reasonable
    }
    return path.join(' > ');
  }

  /**
   * ELEMENT ACTIONS
   */

  // Click element by text content
  window.MJControl.clickByText = function(text, options = {}) {
    const { exact = false, tag = null, timeout = 5000 } = options;
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      function attemptClick() {
        const elements = window.MJControl.queryElements({ text, tag, visible: true });
        
        let matchedElement = null;
        if (exact) {
          matchedElement = elements.find(el => el.text.trim().toLowerCase() === text.toLowerCase());
        } else {
          matchedElement = elements[0]; // First match
        }

        if (matchedElement) {
          const element = document.querySelector(matchedElement.selector);
          if (element) {
            element.click();
            resolve({ success: true, clicked: matchedElement });
            return;
          }
        }

        // Retry if within timeout
        if (Date.now() - startTime < timeout) {
          setTimeout(attemptClick, 100);
        } else {
          reject({ success: false, error: 'Element not found', searchText: text });
        }
      }

      attemptClick();
    });
  };

  // Type in field by label
  window.MJControl.typeInFieldByLabel = function(label, value, options = {}) {
    const { submit = false } = options;

    // Find label element
    const labels = Array.from(document.querySelectorAll('label')).filter(l => 
      l.textContent.toLowerCase().includes(label.toLowerCase())
    );

    if (labels.length === 0) {
      return { success: false, error: 'Label not found' };
    }

    // Get associated input
    const labelEl = labels[0];
    let input = null;

    if (labelEl.htmlFor) {
      input = document.getElementById(labelEl.htmlFor);
    } else {
      input = labelEl.querySelector('input, textarea');
    }

    if (!input) {
      return { success: false, error: 'Input field not found' };
    }

    // Type value
    input.focus();
    input.value = value;
    
    // Trigger events for React/Vue compatibility
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    if (submit) {
      const form = input.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      } else {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      }
    }

    return { success: true, input: generateSelector(input), value };
  };

  // Select from dropdown
  window.MJControl.selectFromDropdown = function(selector, option) {
    const selectEl = document.querySelector(selector);
    
    if (!selectEl) {
      return { success: false, error: 'Dropdown not found' };
    }

    // Find option by text or value
    const options = Array.from(selectEl.options);
    const matchedOption = options.find(opt => 
      opt.text.toLowerCase().includes(option.toLowerCase()) ||
      opt.value.toLowerCase().includes(option.toLowerCase())
    );

    if (!matchedOption) {
      return { success: false, error: 'Option not found', available: options.map(o => o.text) };
    }

    selectEl.value = matchedOption.value;
    selectEl.dispatchEvent(new Event('change', { bubbles: true }));

    return { success: true, selected: matchedOption.text };
  };

  /**
   * SCROLL OPERATIONS
   */

  // Scroll to element
  window.MJControl.scrollToElement = function(options = {}) {
    const { selector = null, text = null, behavior = 'smooth' } = options;

    let element = null;

    if (selector) {
      element = document.querySelector(selector);
    } else if (text) {
      const results = window.MJControl.queryElements({ text, visible: false, limit: 1 });
      if (results.length > 0) {
        element = document.querySelector(results[0].selector);
      }
    }

    if (!element) {
      return { success: false, error: 'Element not found' };
    }

    element.scrollIntoView({ behavior, block: 'center' });
    
    return { 
      success: true, 
      element: generateSelector(element),
      position: element.getBoundingClientRect()
    };
  };

  // Scroll by amount
  window.MJControl.scroll = function(options = {}) {
    const { x = 0, y = 0, behavior = 'smooth' } = options;
    window.scrollBy({ left: x, top: y, behavior });
    
    return { 
      success: true, 
      scrollX: window.scrollX, 
      scrollY: window.scrollY 
    };
  };

  /**
   * BATCH OPERATIONS
   */

  // Execute multiple actions in sequence
  window.MJControl.batch = async function(actions = []) {
    const results = [];
    
    for (const action of actions) {
      try {
        const { type, params } = action;
        let result;

        switch (type) {
          case 'click':
            result = await window.MJControl.clickByText(params.text, params.options);
            break;
          case 'type':
            result = window.MJControl.typeInFieldByLabel(params.label, params.value, params.options);
            break;
          case 'scroll':
            result = window.MJControl.scrollToElement(params);
            break;
          case 'select':
            result = window.MJControl.selectFromDropdown(params.selector, params.option);
            break;
          case 'wait':
            await new Promise(resolve => setTimeout(resolve, params.ms || 1000));
            result = { success: true, waited: params.ms };
            break;
          default:
            result = { success: false, error: 'Unknown action type' };
        }

        results.push({ action: type, result });

        // Stop on first failure if specified
        if (!result.success && action.stopOnError) {
          break;
        }
      } catch (error) {
        results.push({ action: action.type, error: error.message });
        if (action.stopOnError) break;
      }
    }

    return { success: true, results };
  };

  /**
   * CONTENT EXTRACTION
   */

  // Extract visible text from page or selector
  window.MJControl.extractContent = function(options = {}) {
    const { selector = null, structure = false } = options;

    let rootElement = selector ? document.querySelector(selector) : document.body;
    
    if (!rootElement) {
      return { success: false, error: 'Element not found' };
    }

    if (structure) {
      // Return structured content
      return {
        success: true,
        content: extractStructured(rootElement)
      };
    } else {
      // Return plain text
      return {
        success: true,
        text: rootElement.innerText || rootElement.textContent
      };
    }
  };

  function extractStructured(element) {
    const tag = element.tagName.toLowerCase();
    const result = { tag };

    // Extract relevant attributes
    if (element.id) result.id = element.id;
    if (element.className) result.class = element.className;
    if (element.href) result.href = element.href;
    if (element.src) result.src = element.src;

    // Extract text or children
    const textContent = Array.from(element.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent.trim())
      .filter(text => text.length > 0)
      .join(' ');

    if (textContent) {
      result.text = textContent;
    }

    // Recursively process children
    const childElements = Array.from(element.children);
    if (childElements.length > 0) {
      result.children = childElements.map(extractStructured);
    }

    return result;
  }

  // Extract links from page
  window.MJControl.extractLinks = function(options = {}) {
    const { selector = 'a', includeText = true } = options;
    
    const links = Array.from(document.querySelectorAll(selector))
      .filter(el => el.href)
      .map(el => ({
        href: el.href,
        text: includeText ? el.textContent.trim() : null,
        title: el.title || null
      }));

    return { success: true, links, count: links.length };
  };

  // Extract images from page
  window.MJControl.extractImages = function(options = {}) {
    const { selector = 'img', minWidth = 0, minHeight = 0 } = options;
    
    const images = Array.from(document.querySelectorAll(selector))
      .filter(el => el.src)
      .map(el => ({
        src: el.src,
        alt: el.alt || null,
        width: el.naturalWidth || el.width,
        height: el.naturalHeight || el.height
      }))
      .filter(img => img.width >= minWidth && img.height >= minHeight);

    return { success: true, images, count: images.length };
  };

  /**
   * NAVIGATION HELPERS
   */

  window.MJControl.navigate = function(action, options = {}) {
    switch (action) {
      case 'back':
        window.history.back();
        return { success: true, action: 'back' };
      
      case 'forward':
        window.history.forward();
        return { success: true, action: 'forward' };
      
      case 'reload':
        window.location.reload();
        return { success: true, action: 'reload' };
      
      case 'goto':
        if (options.url) {
          window.location.href = options.url;
          return { success: true, action: 'goto', url: options.url };
        }
        return { success: false, error: 'URL required' };
      
      default:
        return { success: false, error: 'Unknown navigation action' };
    }
  };

  /**
   * SAFETY CHECKS
   */

  // Detect sensitive form fields
  window.MJControl.detectSensitiveFields = function() {
    const sensitivePatterns = [
      /password/i,
      /credit[\s-]?card/i,
      /cvv/i,
      /ssn/i,
      /social[\s-]?security/i,
      /card[\s-]?number/i,
      /expir/i,
      /billing/i,
      /payment/i
    ];

    const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
    const sensitiveFields = inputs.filter(input => {
      const label = input.name || input.id || input.placeholder || '';
      return sensitivePatterns.some(pattern => pattern.test(label));
    });

    return {
      hasSensitiveFields: sensitiveFields.length > 0,
      count: sensitiveFields.length,
      fields: sensitiveFields.map(el => ({
        type: el.type,
        name: el.name,
        id: el.id,
        placeholder: el.placeholder,
        selector: generateSelector(el)
      }))
    };
  };

  // Check if page has payment indicators
  window.MJControl.detectPaymentPage = function() {
    const paymentKeywords = ['checkout', 'payment', 'billing', 'purchase', 'buy now', 'total:', 'subtotal:'];
    const pageText = document.body.textContent.toLowerCase();
    
    const foundKeywords = paymentKeywords.filter(keyword => 
      pageText.includes(keyword.toLowerCase())
    );

    const sensitiveFields = window.MJControl.detectSensitiveFields();

    return {
      isPaymentPage: foundKeywords.length > 0 || sensitiveFields.hasSensitiveFields,
      confidence: foundKeywords.length > 2 ? 'high' : foundKeywords.length > 0 ? 'medium' : 'low',
      indicators: foundKeywords,
      sensitiveFields: sensitiveFields.count
    };
  };

  /**
   * MESSAGE LISTENER FOR API CALLS
   */

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request.action || !request.action.startsWith('mjcontrol_')) {
      return;
    }

    const action = request.action.replace('mjcontrol_', '');
    const params = request.params || {};

    try {
      let result;

      switch (action) {
        case 'query':
          result = window.MJControl.queryElements(params);
          break;
        case 'clickByText':
          window.MJControl.clickByText(params.text, params.options).then(sendResponse);
          return true; // Async response
        case 'typeInField':
          result = window.MJControl.typeInFieldByLabel(params.label, params.value, params.options);
          break;
        case 'select':
          result = window.MJControl.selectFromDropdown(params.selector, params.option);
          break;
        case 'scrollToElement':
          result = window.MJControl.scrollToElement(params);
          break;
        case 'scroll':
          result = window.MJControl.scroll(params);
          break;
        case 'batch':
          window.MJControl.batch(params.actions).then(sendResponse);
          return true; // Async response
        case 'extractContent':
          result = window.MJControl.extractContent(params);
          break;
        case 'extractLinks':
          result = window.MJControl.extractLinks(params);
          break;
        case 'extractImages':
          result = window.MJControl.extractImages(params);
          break;
        case 'navigate':
          result = window.MJControl.navigate(params.action, params.options);
          break;
        case 'detectSensitive':
          result = window.MJControl.detectSensitiveFields();
          break;
        case 'detectPayment':
          result = window.MJControl.detectPaymentPage();
          break;
        default:
          result = { success: false, error: 'Unknown action' };
      }

      sendResponse(result);
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  });

  console.log('🎛️ MJControl Advanced Automation Loaded');

})();
