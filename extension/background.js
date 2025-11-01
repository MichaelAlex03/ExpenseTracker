chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PURCHASE_DETECTED') {
        handlePurchaseDetection(message.data, sender.tab);
    }
});

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});


// Handle notification clicks - Open side panel
chrome.notifications.onClicked.addListener(async (notificationId) => {
    if (notificationId === 'purchase-detected') {
        // Clear the notification
        chrome.notifications.clear(notificationId);
        // Get the current window
        const windows = await chrome.windows.getCurrent();
        // Open the side panel
        chrome.sidePanel.open({ windowId: windows.id }).catch(() => {
            console.log('Could not open side panel');
        });
    }
});

// Handle notification button clicks - Open side panel
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
    if (notificationId === 'purchase-detected' && buttonIndex === 0) {
        // Clear the notification
        chrome.notifications.clear(notificationId);
        // Get the current window
        const windows = await chrome.windows.getCurrent();
        // Open the side panel
        chrome.sidePanel.open({ windowId: windows.id }).catch(() => {
            console.log('Could not open side panel');
        });
    }
});

async function handlePurchaseDetection(transactionData, tab) {
    await chrome.storage.local.set({
        pendingTransaction: transactionData,
        detectedAt: Date.now()
    });

    chrome.action.setBadgeText({ text: '1', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId: tab.id });

    // Show notification when purchase is detected
    chrome.notifications.create('purchase-detected', {
        type: 'basic',
        title: 'Purchase Detected!',
        message: `${transactionData.merchant || 'A purchase'} - $${transactionData.amount || '0.00'}`,
        buttons: [{ title: 'Add to Expenses' }],
        priority: 2
    });

    // Automatically open the side panel
    try {
        await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
        console.log('Could not auto-open side panel:', error.message);
    }
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

async function handleOAuthLogin(provider) {
    return new Promise((resolve, reject) => {
        const authUrls = {
            google: 'http://localhost:8080/oauth2/authorization/google',
            github: 'http://localhost:8080/oauth2/authorization/github'
        };

        const authUrl = authUrls[provider];
        if (!authUrl) {
            reject(new Error('Invalid OAuth provider'));
            return;
        }

        // Open OAuth page in a new tab
        chrome.tabs.create({ url: authUrl, active: true }, (tab) => {
            const tabId = tab.id;

            // Listen for tab updates to capture the redirect with the token
            const updateListener = (updatedTabId, changeInfo, updatedTab) => {
                if (updatedTabId === tabId && changeInfo.url) {
                    const url = changeInfo.url;

                    // Check if this is the success callback URL with a token
                    // Adjust this pattern based on your backend's redirect URL
                    if (url.includes('/oauth2/callback') || url.includes('token=') || url.includes('access_token=')) {
                        // Extract token from URL
                        const urlObj = new URL(url);
                        const token = urlObj.searchParams.get('token') ||
                                      urlObj.searchParams.get('access_token') ||
                                      urlObj.hash.match(/access_token=([^&]*)/)?.[1];

                        if (token) {
                            // Store the token
                            chrome.storage.local.set({ authToken: token }).then(() => {
                                // Close the OAuth tab
                                chrome.tabs.remove(tabId);
                                // Clean up listener
                                chrome.tabs.onUpdated.removeListener(updateListener);
                                chrome.tabs.onRemoved.removeListener(removeListener);
                                resolve({ success: true, token });
                            });
                        }
                    }

                    // Check for error in URL
                    if (url.includes('error=')) {
                        chrome.tabs.remove(tabId);
                        chrome.tabs.onUpdated.removeListener(updateListener);
                        chrome.tabs.onRemoved.removeListener(removeListener);
                        reject(new Error('OAuth authentication failed'));
                    }
                }
            };

            // Listen for tab being closed by user
            const removeListener = (removedTabId) => {
                if (removedTabId === tabId) {
                    chrome.tabs.onUpdated.removeListener(updateListener);
                    chrome.tabs.onRemoved.removeListener(removeListener);
                    reject(new Error('OAuth flow was cancelled'));
                }
            };

            chrome.tabs.onUpdated.addListener(updateListener);
            chrome.tabs.onRemoved.addListener(removeListener);
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SAVE_EXPENSE') {
        saveExpense(message.data)
            .then(result => {
                // Clear badge on content script after successful save
                if (sender.tab) {
                    chrome.tabs.sendMessage(sender.tab.id, { type: 'CLEAR_BADGE' });
                }
                sendResponse({ success: true, data: result });
            })
            .catch(error => sendResponse({ success: false, error: error.message }))
        return true;
    }

    if (message.type === 'LOGIN') {
        loginUser(message.email, message.password)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (message.type === 'OAUTH_LOGIN') {
        handleOAuthLogin(message.provider)
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

    if (message.type === 'OPEN_SIDE_PANEL') {
        // Get the sender's tab and open side panel
        chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            if (tabs[0]) {
                chrome.sidePanel.open({ windowId: tabs[0].windowId });
            }
        });
        return true;
    }
})