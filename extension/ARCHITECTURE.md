# Expense Tracker Extension - Architecture Documentation

## Overview

This Chrome extension automatically detects online purchases and allows users to quickly save them as expenses to their expense tracking application. The extension consists of three main components that communicate via Chrome's messaging API.

## Architecture Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Chrome Extension                            │
│                                                                     │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐    │
│  │   Content    │      │  Background  │      │    Popup     │    │
│  │   Script     │─────▶│   Script     │◀─────│      UI      │    │
│  │              │      │ (Service     │      │              │    │
│  │ (Detector)   │      │  Worker)     │      │  (Interface) │    │
│  └──────────────┘      └──────────────┘      └──────────────┘    │
│        │                      │                      │             │
└────────┼──────────────────────┼──────────────────────┼─────────────┘
         │                      │                      │
         │                      │                      │
    ┌────▼─────┐          ┌────▼─────┐          ┌────▼─────┐
    │   Web    │          │  Chrome  │          │  Backend │
    │  Pages   │          │ Storage  │          │   API    │
    └──────────┘          └──────────┘          └──────────┘
```

---

## Component Details

### 1. Content Script (contest-script.js)

**Purpose**: Runs on all web pages to detect purchase confirmations and extract transaction data.

**Key Responsibilities**:
- Monitor web pages for purchase confirmation indicators
- Extract transaction details (merchant, amount, order number)
- Send detected transactions to background script
- Watch for URL changes in Single Page Applications (SPAs)

**Lifecycle**:
- Injected into every web page (`<all_urls>`)
- Runs at `document_idle` (after DOM is loaded)
- Persists as long as the tab is open

**Detection Logic**:
```
Purchase Indicators:
├── URL Patterns
│   ├── /checkout.*success/i
│   ├── /order.*confirm/i
│   ├── /thank.*you/i
│   ├── /receipt/i
│   └── /purchase.*complete/i
└── Text Patterns
    ├── /order\s+confirmed/i
    ├── /thank\s+you\s+for\s+your\s+(order|purchase)/i
    ├── /payment\s+successful/i
    └── /order\s+#?\d+/i
```

---

### 2. Background Script (background.js)

**Purpose**: Service worker that acts as the central message hub and API coordinator.

**Key Responsibilities**:
- Receive and store pending transactions from content script
- Handle authentication (login)
- Save expenses to backend API
- Manage chrome.storage for auth tokens and pending transactions
- Set badge notifications on extension icon

**Storage Management**:
```
Chrome Local Storage:
├── authToken: JWT token for API authentication
├── pendingTransaction: Transaction data waiting to be saved
└── detectedAt: Timestamp of when transaction was detected
```

**Message Handlers**:
1. `PURCHASE_DETECTED` - From content script
2. `LOGIN` - From popup
3. `SAVE_EXPENSE` - From popup
4. `GET_PENDING_TRANSACTION` - From popup

---

### 3. Popup UI (popup.js + popup.html)

**Purpose**: User interface for authentication and expense management.

**Key Responsibilities**:
- Display login screen for unauthenticated users
- Show pending transactions with pre-filled data
- Allow manual transaction entry
- Submit expenses to backend via background script
- Clear badges and pending transactions after save

**UI States**:
```
┌─────────────────┐
│  Login Screen   │ (No auth token)
└────────┬────────┘
         │ Login successful
         ▼
┌─────────────────┐
│  Main Screen    │ (Authenticated)
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────────┐
│   No   │  │ Transaction  │
│Transaction│ Form (Pre-   │
│ Message│  │  filled)     │
└────────┘  └──────────────┘
```

---

## Message Flow Diagrams

### Flow 1: Purchase Detection

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Content   │         │ Background  │         │   Chrome    │
│   Script    │         │   Script    │         │   Storage   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                        │
       │ 1. User completes     │                        │
       │    purchase           │                        │
       │                       │                        │
       │ 2. Page detected as   │                        │
       │    confirmation       │                        │
       │                       │                        │
       │ 3. Extract data       │                        │
       │    (merchant, amount, │                        │
       │     order#, etc.)     │                        │
       │                       │                        │
       │ 4. PURCHASE_DETECTED  │                        │
       │───────────────────────▶                        │
       │    { data }           │                        │
       │                       │                        │
       │                       │ 5. Store pending       │
       │                       │    transaction         │
       │                       │───────────────────────▶│
       │                       │                        │
       │                       │ 6. Set badge "1"       │
       │                       │    (green)             │
       │                       │                        │
       ▼                       ▼                        ▼
```

### Flow 2: User Login

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Popup    │         │ Background  │         │  Backend    │
│     UI      │         │   Script    │         │    API      │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                        │
       │ 1. User enters        │                        │
       │    email/password     │                        │
       │                       │                        │
       │ 2. LOGIN message      │                        │
       │───────────────────────▶                        │
       │   { email, password } │                        │
       │                       │                        │
       │                       │ 3. POST /auth/login    │
       │                       │───────────────────────▶│
       │                       │   { email, password }  │
       │                       │                        │
       │                       │ 4. { accessToken }     │
       │                       │◀───────────────────────│
       │                       │                        │
       │                       │ 5. Store token in      │
       │                       │    chrome.storage      │
       │                       │                        │
       │ 6. Response           │                        │
       │◀───────────────────────                        │
       │   { success: true }   │                        │
       │                       │                        │
       │ 7. Show main screen   │                        │
       │                       │                        │
       ▼                       ▼                        ▼
```

### Flow 3: Loading Popup with Pending Transaction

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Popup    │         │ Background  │         │   Chrome    │
│     UI      │         │   Script    │         │   Storage   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                        │
       │ 1. Popup opened       │                        │
       │    (user clicks icon) │                        │
       │                       │                        │
       │ 2. Check auth token   │                        │
       │───────────────────────────────────────────────▶│
       │                       │                        │
       │ 3. Token found        │                        │
       │◀───────────────────────────────────────────────│
       │                       │                        │
       │ 4. GET_PENDING_       │                        │
       │    TRANSACTION        │                        │
       │───────────────────────▶                        │
       │                       │                        │
       │                       │ 5. Retrieve data       │
       │                       │───────────────────────▶│
       │                       │                        │
       │                       │ 6. Transaction data    │
       │                       │◀───────────────────────│
       │                       │                        │
       │ 7. Response with data │                        │
       │◀───────────────────────                        │
       │                       │                        │
       │ 8. Pre-fill form:     │                        │
       │    - Merchant         │                        │
       │    - Amount           │                        │
       │    - Order # (notes)  │                        │
       │    - Today's date     │                        │
       │                       │                        │
       ▼                       ▼                        ▼
```

### Flow 4: Saving Expense

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Popup    │         │ Background  │         │  Backend    │
│     UI      │         │   Script    │         │    API      │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                        │
       │ 1. User reviews/      │                        │
       │    edits form         │                        │
       │                       │                        │
       │ 2. Submit form        │                        │
       │                       │                        │
       │ 3. SAVE_EXPENSE       │                        │
       │───────────────────────▶                        │
       │   { merchant, amount, │                        │
       │     date, category,   │                        │
       │     notes }           │                        │
       │                       │                        │
       │                       │ 4. Get auth token      │
       │                       │                        │
       │                       │ 5. POST /api/          │
       │                       │    transaction/expense │
       │                       │───────────────────────▶│
       │                       │   Bearer token +       │
       │                       │   expense data         │
       │                       │                        │
       │                       │ 6. Success response    │
       │                       │◀───────────────────────│
       │                       │                        │
       │ 7. Response           │                        │
       │◀───────────────────────                        │
       │   { success: true }   │                        │
       │                       │                        │
       │ 8. Show success msg   │                        │
       │                       │                        │
       │ 9. Clear pending      │                        │
       │    transaction        │                        │
       │                       │                        │
       │ 10. Clear badge       │                        │
       │                       │                        │
       ▼                       ▼                        ▼
```

---

## Communication Patterns

### Message Types

| Message Type | Source | Destination | Purpose |
|--------------|--------|-------------|---------|
| `PURCHASE_DETECTED` | Content Script | Background | Notify of detected purchase with extracted data |
| `LOGIN` | Popup | Background | Authenticate user with backend |
| `SAVE_EXPENSE` | Popup | Background | Save expense to backend API |
| `GET_PENDING_TRANSACTION` | Popup | Background | Retrieve stored transaction data |

### Chrome APIs Used

```
chrome.runtime.sendMessage()
├── Used by: Content Script, Popup
└── Purpose: Send messages to background script

chrome.runtime.onMessage.addListener()
├── Used by: Background Script
└── Purpose: Listen for messages from content script and popup

chrome.storage.local
├── Used by: All components
└── Purpose: Store auth token and pending transactions

chrome.action.setBadgeText()
├── Used by: Background Script, Popup
└── Purpose: Show notification badge on extension icon

chrome.action.setBadgeBackgroundColor()
├── Used by: Background Script
└── Purpose: Set badge color (green for new transaction)

chrome.tabs.create()
├── Used by: Popup
└── Purpose: Open dashboard in new tab
```

---

## Data Flow

### Transaction Data Structure

```javascript
{
  merchant: "Amazon",          // Extracted from meta tags or page title
  amount: 49.99,              // Parsed from price elements
  date: "2025-10-29T...",     // ISO timestamp
  orderNumber: "123-456-789", // Extracted from page text
  items: [...],               // List of purchased items (max 5)
  url: "https://..."          // Confirmation page URL
}
```

### Expense Data Structure (Saved to Backend)

```javascript
{
  merchant: "Amazon",
  amount: 49.99,
  date: "2025-10-29",        // Date string
  category: "Shopping",       // User-selected category
  notes: "Order #123-456-789" // User-entered or auto-filled
}
```

---

## Complete User Journey

### Scenario: Automatic Purchase Detection

1. **User makes an online purchase**
   - User completes checkout on any e-commerce site
   - Browser navigates to confirmation page

2. **Content script detects purchase**
   - Checks URL and page content against patterns
   - Extracts transaction details
   - Sends `PURCHASE_DETECTED` to background script

3. **Background script stores transaction**
   - Saves to `chrome.storage.local.pendingTransaction`
   - Sets green badge with "1" on extension icon

4. **User clicks extension icon**
   - Popup opens and checks for auth token
   - If not logged in: shows login screen
   - If logged in: requests pending transaction

5. **Background script returns pending data**
   - Popup receives transaction data
   - Form is pre-filled with merchant, amount, order number

6. **User reviews and submits**
   - User can edit any fields or select category
   - Clicks submit button
   - Popup sends `SAVE_EXPENSE` to background

7. **Background script saves to API**
   - Retrieves auth token from storage
   - Makes authenticated POST request to backend
   - Returns success/error to popup

8. **Popup shows confirmation**
   - Displays success message
   - Clears pending transaction from storage
   - Removes badge from extension icon

### Scenario: Manual Entry

1. **User clicks extension icon**
   - Popup checks for auth token
   - No pending transaction found
   - Shows "No transaction detected" message

2. **User clicks "Add Manually"**
   - Empty form is displayed
   - User fills in all fields manually

3. **User submits**
   - Same save flow as automatic detection (steps 6-8 above)

---

## Error Handling

### Authentication Errors
```
Popup → Background → API
         ↓ (401/403)
       Popup
         ↓
   Show login screen
```

### Network Errors
```
Background → API
    ↓ (Network failure)
  Popup
    ↓
  Show error message
  (Transaction remains pending)
```

### Validation Errors
```
Popup
  ↓ (Client-side validation)
Show form errors
(Don't send to background)
```

---

## Storage Schema

### Chrome Local Storage

```javascript
{
  // Authentication
  authToken: "eyJhbGciOiJIUzI1NiIs...",  // JWT token

  // Pending transaction (cleared after save)
  pendingTransaction: {
    merchant: "Amazon",
    amount: 49.99,
    date: "2025-10-29T12:34:56.789Z",
    orderNumber: "123-456-789",
    items: ["Product 1", "Product 2"],
    url: "https://amazon.com/checkout/success"
  },

  // Detection timestamp
  detectedAt: 1698765432000  // Unix timestamp
}
```

---

## API Endpoints

### Backend Integration

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/auth/login` | POST | User authentication | No |
| `/api/transaction/expense` | POST | Save expense | Yes (Bearer token) |

### Request/Response Examples

**Login Request**:
```http
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

**Save Expense Request**:
```http
POST http://localhost:3001/api/transaction/expense
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "merchant": "Amazon",
  "amount": 49.99,
  "date": "2025-10-29",
  "category": "Shopping",
  "notes": "Order #123-456-789"
}
```

---

## Security Considerations

### Authentication
- JWT token stored in `chrome.storage.local` (extension-only access)
- Token sent as Bearer token in Authorization header
- No token = forced login screen

### Content Script Isolation
- Content script runs in isolated world
- Cannot access page JavaScript variables
- Only DOM access for data extraction

### Permissions
```json
{
  "permissions": [
    "storage",        // Store auth token and pending transactions
    "tabs",           // Access tab information
    "activeTab",      // Interact with active tab
    "notifications"   // Show notifications (future use)
  ],
  "host_permissions": [
    "<all_urls>"      // Run content script on all sites
  ]
}
```

---

## Extension Lifecycle

### Installation
1. Extension installed from Chrome Web Store or developer mode
2. Background service worker registered
3. Content scripts ready to inject

### Runtime
1. **Content scripts**: Injected into each page load
2. **Background script**: Wakes up on messages, goes dormant when idle
3. **Popup**: Only runs when user clicks extension icon

### Updates
1. Badge updates when transaction detected
2. Storage updates on login, detection, and save
3. UI updates based on storage state

---

## Known Issues

### File Naming Bug
The manifest.json references `content-script.js` but the actual file is named `contest-script.js`. This will prevent the extension from loading the content script.

**Fix needed**: Rename `contest-script.js` to `content-script.js`

### Missing Return Statement
In `contest-script.js:34`, the `extractTransactionData()` function doesn't return the `data` object.

**Fix needed**: Add `return data;` at the end of the function

---

## Development Notes

### Testing the Extension

1. **Load unpacked extension**:
   - Navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

2. **Test purchase detection**:
   - Visit a page with "checkout success" or similar in URL
   - Or visit a page with "Order confirmed" text
   - Check for green badge on extension icon

3. **Test login**:
   - Click extension icon
   - Enter credentials
   - Verify token is stored in `chrome.storage.local`

4. **Test expense save**:
   - With pending transaction, click extension icon
   - Review pre-filled data
   - Submit form
   - Verify badge clears and transaction saves

### Debugging

```javascript
// View storage
chrome.storage.local.get(null, (data) => console.log(data));

// View background script logs
chrome://extensions → "service worker" link

// View content script logs
Inspect page → Console → Filter by extension ID

// View popup logs
Right-click extension icon → "Inspect popup"
```

---

## Future Enhancements

Potential improvements to consider:

1. **Multi-currency support**: Detect and convert foreign currencies
2. **Receipt screenshots**: Capture page screenshots for records
3. **Duplicate detection**: Prevent saving the same transaction twice
4. **Offline support**: Queue transactions when backend is unreachable
5. **Custom patterns**: Allow users to add site-specific detection rules
6. **Category auto-detection**: ML-based category suggestions based on merchant
7. **Sync across devices**: Use `chrome.storage.sync` for settings
8. **Notifications**: Alert user when purchases are detected

---

## Summary

The Expense Tracker extension uses a three-component architecture:

- **Content Script**: Passive observer that detects purchases on web pages
- **Background Script**: Central coordinator for API calls and storage
- **Popup UI**: User interface for authentication and expense management

Communication flows through Chrome's messaging API, with the background script acting as the hub. Transaction data flows from content script → background → storage → popup → background → API, creating a seamless experience for automatic expense tracking.
