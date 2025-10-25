// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainScreen = document.getElementById('mainScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const noTransaction = document.getElementById('noTransaction');
const transactionForm = document.getElementById('transactionForm');
const expenseForm = document.getElementById('expenseForm');
const formError = document.getElementById('formError');
const successMessage = document.getElementById('successMessage');
const manualAddBtn = document.getElementById('manualAddBtn');
const cancelBtn = document.getElementById('cancelBtn');
const viewDashboardBtn = document.getElementById('viewDashboardBtn');

// Initialize popup
async function init() {
  const token = await getAuthToken();
  
  if (token) {
    showMainScreen();
    checkForPendingTransaction();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  loginScreen.classList.remove('hidden');
  mainScreen.classList.add('hidden');
}

function showMainScreen() {
  loginScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
}

async function getAuthToken() {
  const result = await chrome.storage.local.get('authToken');
  return result.authToken;
}

// Check for pending transaction from content script
async function checkForPendingTransaction() {
  chrome.runtime.sendMessage({ type: 'GET_PENDING_TRANSACTION' }, (response) => {
    if (response.success && response.data) {
      showTransactionForm(response.data);
    } else {
      showNoTransaction();
    }
  });
}

function showNoTransaction() {
  noTransaction.classList.remove('hidden');
  transactionForm.classList.add('hidden');
  successMessage.classList.add('hidden');
}

function showTransactionForm(data = {}) {
  noTransaction.classList.add('hidden');
  transactionForm.classList.remove('hidden');
  successMessage.classList.add('hidden');
  
  // Pre-fill form with detected data
  document.getElementById('merchant').value = data.merchant || '';
  document.getElementById('amount').value = data.amount || '';
  
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  
  // Add order number to notes if available
  if (data.orderNumber) {
    document.getElementById('notes').value = `Order #${data.orderNumber}`;
  }
}

function showSuccessMessage() {
  noTransaction.classList.add('hidden');
  transactionForm.classList.add('hidden');
  successMessage.classList.remove('hidden');
  
  // Clear pending transaction
  chrome.storage.local.remove('pendingTransaction');
  
  // Clear badge
  chrome.action.setBadgeText({ text: '' });
}

// Login Form Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  chrome.runtime.sendMessage(
    { type: 'LOGIN', email, password },
    (response) => {
      if (response.success) {
        showMainScreen();
        checkForPendingTransaction();
      } else {
        loginError.textContent = response.error || 'Login failed';
      }
    }
  );
});

// Expense Form Handler
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';
  
  const expenseData = {
    merchant: document.getElementById('merchant').value,
    amount: parseFloat(document.getElementById('amount').value),
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    notes: document.getElementById('notes').value
  };
  
  chrome.runtime.sendMessage(
    { type: 'SAVE_EXPENSE', data: expenseData },
    (response) => {
      if (response.success) {
        showSuccessMessage();
      } else {
        formError.textContent = response.error || 'Failed to save expense';
      }
    }
  );
});

// Manual Add Button
manualAddBtn.addEventListener('click', () => {
  showTransactionForm();
});

// Cancel Button
cancelBtn.addEventListener('click', () => {
  showNoTransaction();
});

// View Dashboard Button
viewDashboardBtn.addEventListener('click', () => {
  // UPDATE THIS URL TO YOUR WEB APP
  chrome.tabs.create({ url: 'https://your-app.com/dashboard' });
});

// Initialize on load
init();