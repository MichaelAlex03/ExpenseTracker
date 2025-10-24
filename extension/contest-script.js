const PURCHASE_INDICATORS = [
    // URL patterns
    /checkout.*success/i,
    /order.*confirm/i,
    /thank.*you/i,
    /receipt/i,
    /purchase.*complete/i,

    // Text patterns
    /order\s+confirmed/i,
    /thank\s+you\s+for\s+your\s+(order|purchase)/i,
    /payment\s+successful/i,
    /order\s+#?\d+/i
];

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

    }
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
        })
    }
}

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