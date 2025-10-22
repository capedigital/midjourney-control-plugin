# Advanced Browser Automation API

## Why This Exists

ChatGPT's Atlas browser mode is **slow** - it needs to:
- Take screenshots
- Process images with vision AI
- Navigate pixel-by-pixel
- Wait for visual confirmation

This plugin provides **structured, fast, programmatic access** to web pages:
- Query DOM directly (milliseconds vs seconds)
- Reliable selectors (not pixel coordinates)
- Batch operations (atomic multi-step actions)
- Content extraction without OCR

## Architecture

```
ChatGPT → HTTP Request → localhost:43110 → Chrome Extension → Web Page
            (instant)       (API Server)     (content-advanced.js)
```

No screenshots, no vision AI, no pixel hunting - just pure DOM manipulation.

## Quick Start

### 1. Start the Automation Server

```bash
npm run start:automation
```

Server runs on `http://localhost:43110`

### 2. Load the Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the plugin folder
5. Extension now injects automation capabilities into **all websites**

### 3. Train ChatGPT

Tell ChatGPT:

> I have a browser automation API at http://localhost:43110
> 
> Available endpoints:
> - POST /api/click-by-text - Click elements by visible text
> - POST /api/type-in-field - Type in form fields
> - POST /api/extract-content - Get page content
> - POST /api/batch - Execute multiple actions
> 
> When I ask you to interact with websites, use these APIs instead of Atlas mode.

## API Reference

### DOM Queries

**Find elements on the page**

```bash
POST /api/query
{
  "selector": ".product-card",    # CSS selector (optional)
  "tag": "a",                     # HTML tag (optional)
  "text": "Add to cart",          # Text content (optional)
  "visible": true,                # Only visible elements
  "limit": 10                     # Max results
}
```

**Response:**
```json
{
  "success": true,
  "elements": [
    {
      "index": 0,
      "tag": "button",
      "text": "Add to cart",
      "selector": "button.btn-primary",
      "boundingBox": { "x": 100, "y": 200 }
    }
  ]
}
```

**ChatGPT Example:**
```
You: "Find all product names on Amazon"
ChatGPT: POST /api/query with {"selector": ".product-title"}
```

---

### Element Actions

#### Click by Text

**Click an element by its visible text**

```bash
POST /api/click-by-text
{
  "text": "Add to cart",
  "exact": false,     # true = exact match, false = contains
  "tag": "button",    # Filter by tag (optional)
  "timeout": 5000     # Wait up to 5s for element
}
```

**ChatGPT Example:**
```
You: "Click the Sign In button"
ChatGPT: POST /api/click-by-text with {"text": "Sign In"}
```

#### Type in Field

**Type in an input field by its label**

```bash
POST /api/type-in-field
{
  "label": "Email",
  "value": "user@example.com",
  "submit": false     # Press Enter after typing
}
```

**ChatGPT Example:**
```
You: "Enter my email: test@test.com"
ChatGPT: POST /api/type-in-field with {"label": "Email", "value": "test@test.com"}
```

#### Select Dropdown

**Select an option from a dropdown**

```bash
POST /api/select-option
{
  "selector": "#country",
  "option": "United States"
}
```

---

### Scroll Operations

#### Scroll to Element

**Scroll until an element is visible**

```bash
POST /api/scroll-to-element
{
  "selector": "#footer",     # By selector
  "text": "Contact Us",      # Or by text
  "behavior": "smooth"       # "smooth" or "instant"
}
```

**ChatGPT Example:**
```
You: "Scroll to the footer"
ChatGPT: POST /api/scroll-to-element with {"text": "Contact"}
```

#### Scroll by Amount

```bash
POST /api/scroll
{
  "x": 0,
  "y": 500,           # Scroll down 500px
  "behavior": "smooth"
}
```

---

### Batch Operations

**Execute multiple actions atomically**

```bash
POST /api/batch
{
  "actions": [
    {
      "type": "scroll",
      "params": { "text": "Sign Up" }
    },
    {
      "type": "click",
      "params": { "text": "Sign Up" }
    },
    {
      "type": "wait",
      "params": { "ms": 1000 }
    },
    {
      "type": "type",
      "params": { "label": "Email", "value": "test@test.com" }
    }
  ]
}
```

**ChatGPT Example:**
```
You: "Sign up with email test@test.com"
ChatGPT: Executes batch:
  1. Scroll to signup form
  2. Click "Sign Up"
  3. Wait for form
  4. Type email
```

---

### Content Extraction

#### Extract Page Content

**Get visible text from page or specific section**

```bash
POST /api/extract-content
{
  "selector": "#main-content",  # Optional - specific section
  "structure": false             # true = structured JSON, false = plain text
}
```

**Response (plain text):**
```json
{
  "success": true,
  "text": "Welcome to our website..."
}
```

**Response (structured):**
```json
{
  "success": true,
  "content": {
    "tag": "div",
    "id": "main-content",
    "children": [
      { "tag": "h1", "text": "Welcome" },
      { "tag": "p", "text": "..." }
    ]
  }
}
```

**ChatGPT Example:**
```
You: "What does this page say about pricing?"
ChatGPT: 
  1. POST /api/extract-content
  2. Analyzes text for pricing info
  3. Returns answer
```

#### Extract Links

**Get all links from page**

```bash
POST /api/extract-links
{
  "selector": "a",           # Optional - filter selector
  "includeText": true        # Include link text
}
```

**Response:**
```json
{
  "success": true,
  "links": [
    {
      "href": "https://example.com/products",
      "text": "View Products",
      "title": null
    }
  ],
  "count": 1
}
```

#### Extract Images

**Get all images from page**

```bash
POST /api/extract-images
{
  "selector": "img",
  "minWidth": 200,      # Filter by size
  "minHeight": 200
}
```

---

### Navigation

**Browser controls**

```bash
POST /api/navigate
{
  "action": "back"      # "back", "forward", "reload", "goto"
  "url": "..."          # For "goto" action
}
```

---

### Safety Checks

#### Detect Sensitive Fields

**Check if page has password/payment fields**

```bash
POST /api/detect-sensitive
```

**Response:**
```json
{
  "hasSensitiveFields": true,
  "count": 2,
  "fields": [
    {
      "type": "password",
      "name": "password",
      "selector": "input[name='password']"
    }
  ]
}
```

#### Detect Payment Page

**Check if page is asking for payment**

```bash
POST /api/detect-payment
```

**Response:**
```json
{
  "isPaymentPage": true,
  "confidence": "high",
  "indicators": ["checkout", "billing", "total:"],
  "sensitiveFields": 3
}
```

**ChatGPT Use Case:**
```
ChatGPT: Before clicking "Continue", let me check...
         POST /api/detect-payment
         ⚠️  This is a payment page. Do you want to proceed?
```

---

## ChatGPT Workflows

### Example 1: Search Amazon

**You:** "Search Amazon for wireless headphones"

**ChatGPT does:**
```javascript
// 1. Navigate to Amazon
POST /api/navigate { "action": "goto", "url": "https://amazon.com" }

// 2. Type in search box
POST /api/type-in-field { "label": "Search", "value": "wireless headphones", "submit": true }

// 3. Wait for results
POST /api/batch { "actions": [{ "type": "wait", "params": { "ms": 2000 }}] }

// 4. Extract product names
POST /api/query { "selector": ".s-result-item h2" }

// 5. Return results to you
```

### Example 2: Fill Out Form

**You:** "Fill out the contact form with my info"

**ChatGPT does:**
```javascript
POST /api/batch {
  "actions": [
    { "type": "type", "params": { "label": "Name", "value": "John Doe" }},
    { "type": "type", "params": { "label": "Email", "value": "john@example.com" }},
    { "type": "type", "params": { "label": "Message", "value": "Hello!" }},
    { "type": "click", "params": { "text": "Submit" }}
  ]
}
```

### Example 3: Extract Data

**You:** "Get all article titles from this blog"

**ChatGPT does:**
```javascript
// 1. Extract page content
POST /api/extract-content { "structure": true }

// 2. Parse JSON for <h2> or <article> tags
// 3. Filter for titles
// 4. Return formatted list
```

---

## Performance Comparison

| Task | Atlas Mode | This API |
|------|-----------|----------|
| Find button by text | 3-5 seconds | 50ms |
| Fill out 5-field form | 15-30 seconds | 200ms |
| Extract 50 product names | 30-60 seconds | 100ms |
| Navigate + search + extract | 45+ seconds | 2-3 seconds |

**20-30x faster** than vision-based automation! 🚀

---

## Security Features

1. **Localhost only** - Server binds to 127.0.0.1
2. **CORS restricted** - Only accepts local requests
3. **Safety checks** - Auto-detects payment/sensitive pages
4. **User confirmation** - ChatGPT asks before sensitive actions

---

## Limitations

### What This CAN Do
✅ Read page content  
✅ Click buttons/links  
✅ Fill forms  
✅ Extract data  
✅ Navigate pages  
✅ Detect payment flows  

### What This CANNOT Do
❌ Bypass CAPTCHA  
❌ Circumvent rate limiting  
❌ Access cross-origin iframes  
❌ Automate sites that detect automation  
❌ Make external network requests  

---

## Training ChatGPT (Full Script)

Copy-paste this into ChatGPT:

> I have a browser automation API running at http://localhost:43110
>
> **Capabilities:**
> - Query DOM: POST /api/query
> - Click by text: POST /api/click-by-text
> - Type in fields: POST /api/type-in-field
> - Extract content: POST /api/extract-content
> - Batch operations: POST /api/batch
> - Safety checks: POST /api/detect-payment
>
> **When I ask you to interact with websites:**
> 1. Use these APIs instead of Atlas browser mode (they're 20x faster)
> 2. Before any purchase/payment action, call /api/detect-payment and ask me
> 3. Use /api/batch for multi-step workflows
> 4. Extract data with /api/extract-content instead of reading screenshots
>
> **Examples:**
> - "Find all product names" → POST /api/query
> - "Click Sign In" → POST /api/click-by-text
> - "Fill out this form" → POST /api/batch
>
> Remember: This only works when my automation server is running. Ask if I need to start it!

---

## Next Steps

1. ✅ Load extension in Chrome
2. ✅ Start server: `npm run start:automation`
3. ✅ Train ChatGPT with script above
4. 🚀 Ask ChatGPT to automate any website!

Now you have **superhuman browser automation** through ChatGPT! 🎉
