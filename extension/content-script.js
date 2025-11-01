const PURCHASE_INDICATORS = [
    // URL patterns
    /checkout.*success/i,
    /order.*confirm/i,
    /thank.*you/i,
    /receipt/i,
    /purchase.*complete/i,

    // Text patterns
    /order\s+confirmed/i,
    /thank\s+you\s+for\s+your\s+(order|purchase|payment)/i,
    /payment\s+successful/i,
    /order\s+#?\d+/i
];

// Inject styles for the floating button
function injectStyles() {
    if (document.getElementById('expense-tracker-styles')) return;

    const style = document.createElement('style');
    style.id = 'expense-tracker-styles';
    style.textContent = `
        #expense-tracker-button {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #expense-tracker-button .expense-tracker-container {
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 12px 0 0 12px;
            box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            height: 56px;
            width: 56px;
        }

        #expense-tracker-button .expense-tracker-container:hover {
            width: 200px;
            box-shadow: -6px 6px 20px rgba(0, 0, 0, 0.25);
            transform: translateX(-4px);
        }

        #expense-tracker-button .expense-tracker-icon {
            min-width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        #expense-tracker-button .expense-tracker-text {
            color: white;
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s ease;
            padding-right: 16px;
        }

        #expense-tracker-button .expense-tracker-container:hover .expense-tracker-text {
            opacity: 1;
            transition-delay: 0.1s;
        }

        #expense-tracker-button .expense-tracker-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #ef4444;
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 10px;
            min-width: 18px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Animation for new transaction */
        @keyframes pulse-green {
            0%, 100% {
                box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.15);
            }
            50% {
                box-shadow: -4px 4px 20px rgba(16, 185, 129, 0.6);
            }
        }

        #expense-tracker-button .expense-tracker-container.has-transaction {
            animation: pulse-green 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Render floating button on the page
function renderButton() {
    if (document.getElementById('expense-tracker-button')) return;

    const button = document.createElement('div');
    button.id = 'expense-tracker-button';
    button.innerHTML = `
        <div class="expense-tracker-container" id="expense-tracker-container">
            <div class="expense-tracker-icon">💰</div>
            <div class="expense-tracker-text">Track Expense</div>
        </div>
    `;

    // Click handler to open side panel
    button.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
    });

    document.body.appendChild(button);
}

// Show badge when transaction is detected
function showTransactionBadge() {
    const container = document.getElementById('expense-tracker-container');
    if (container) {
        container.classList.add('has-transaction');

        // Add badge if not exists
        if (!container.querySelector('.expense-tracker-badge')) {
            const badge = document.createElement('div');
            badge.className = 'expense-tracker-badge';
            badge.textContent = '1';
            container.appendChild(badge);
        }
    }
}

// Clear badge
function clearTransactionBadge() {
    const container = document.getElementById('expense-tracker-container');
    if (container) {
        container.classList.remove('has-transaction');
        const badge = container.querySelector('.expense-tracker-badge');
        if (badge) badge.remove();
    }
}

// Initialize button when page loads
function initButton() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            renderButton();
        });
    } else {
        injectStyles();
        renderButton();
    }
}

initButton();

//Checks if current page is a purchase confirmatiom
function isPurchaseConfirmation() {
    const url = window.location.href;
    const bodyText = document.body.innerText;

    // Check URL if it is a confirmation page for purchase
    for (const pattern of PURCHASE_INDICATORS.slice(0, 5)) {
        if (pattern.test(url)) return true;
    }

    // Check page content to see if its a confirmation page for purchase
    for (const pattern of PURCHASE_INDICATORS.slice(5)) {
        if (pattern.test(bodyText)) return true;
    }

    return false;
}

//Extract transaction details from page
function extractTransactionData() {
    const data = {
        merchant: extractMerchant(),
        amount: extractAmount(),
        date: new Date().toISOString(),
        orderNumber: extractOrderNumber(),
        items: extractItems(),
        url: window.location.href
    }
    return data
}

function extractMerchant() {
    // Try meta tags first
    const ogSite = document.querySelector('meta[property="og:site_name"]')
    if (ogSite) return ogSite.getAttribute('content');

    // Try page title
    const title = document.title.split('-')[0].trim();
    if (title) return title;

    return window.location.hostname.replace('www.', '');
}

function extractAmount() {
    // Common selectors for total amount
    const selectors = [
        '[class*="total"]',
        '[class*="amount"]',
        '[id*="total"]',
        '[class*="price"]',
        '.order-total',
        '.grand-total'
    ];

    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            const text = el.innerText;
            const match = text.match(/\$?\s*(\d{1,}[,\d]*\.?\d{0,2})/);
            if (match) {
                return parseFloat(match[1].replace(',', ''));
            }
        }
    }

    return null
}

function extractOrderNumber() {
    const bodyText = document.body.innerText;
    const match = bodyText.match(/order\s*#?\s*:?\s*(\w+)/i);
    return match ? match[1] : null
}

function extractItems() {
    const itemElements = document.querySelectorAll('[class*="item"], [class*="product"]');
    const items = []

    for (const el of itemElements) {
        const text = el.innerText.trim();
        if (text && text.length < 100) {
            items.push(text);
        }
    }

    return items.slice(0, 5);
}

function checkForPurchase() {
    if (isPurchaseConfirmation()) {
        const transactionData = extractTransactionData();

        chrome.runtime.sendMessage({
            type: 'PURCHASE_DETECTED',
            data: transactionData
        });

        // Show badge on floating button
        showTransactionBadge();
    }
}

// Listen for messages from background (to clear badge when expense is saved)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CLEAR_BADGE') {
        clearTransactionBadge();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForPurchase)
} else {
    checkForPurchase()
}

let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(checkForPurchase, 1000)
    }
}).observe(document, { subtree: true, childList: true })