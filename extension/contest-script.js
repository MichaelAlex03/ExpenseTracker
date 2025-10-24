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

function extractAmunt() {
    // Common selectors for total amount
    const selectors = [
        '[class*="total"]',
        '[class*="amount"]',
        '[id*="total"]',
        '[class*="price"]',
        '.order-total',
        '.grand-total'
    ];

    for (const selector of selectors){
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            const text = el.innerText;
            const match = text.match(/\$?\s*(\d{1,}[,\d]*\.?\d{0,2})/);
            if (match){
                return parseFloat(match[1].replace(',', ''));
            }
        }
    }
}