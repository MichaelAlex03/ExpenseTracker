chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PURCHASE_DETECTED') {
        handlePurchaseDetection(message.data, sender.tab);
    }
});

async function handlePurchaseDetection(transactionData, tab) {
    await chrome.storage.local.set({
        pendingTransaction: transactionData,
        detectedAt: Date.now()
    });

    chrome.action.setBadgeText({ text: '1', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId: tab.id });
}

async function getAuthToken() {
    const result = await chrome.storage.local.get('authToken');
    return result.authToken;
}

async function saveExpense(expenseData) {
    const token = await getAuthToken();

    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch('http://localhost:3001/api/transaction/expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
    })

    if (!response.ok) {
        throw new Error("Failed to add expense")
    }

    return response.json();
}

async function loginUser(email, password) {
    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        throw new Error('Login failed')
    }

    const data = await response.json();
    await chrome.storage.local.set({ authToken: data.accessToken });
    return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SAVE_EXPENSE') {
        saveExpense(message.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }))
        return true;
    }

    if (message.type === 'LOGIN') {
        loginUser(message.email, message.password)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'GET_PENDING_TRANSACTION') {
        chrome.storage.local.get('pendingTransaction')
            .then(result => sendResponse({ success: true, data: result.pendingTransaction }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
})