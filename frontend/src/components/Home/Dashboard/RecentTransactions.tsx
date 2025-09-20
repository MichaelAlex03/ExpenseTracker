import { useState } from 'react';
import type { IncomeResponseObject, ExpenseResponseObject } from '../../../types/transactions';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RecentTransactionsProps {
  incomeData: IncomeResponseObject[];
  expenseData: ExpenseResponseObject[];
  selectedMonth: Date;
}

const RecentTransactions = ({ incomeData, expenseData, selectedMonth }: RecentTransactionsProps) => {
  const [showAll, setShowAll] = useState(true);
  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllTransactions = () => {
    const income = incomeData
      .filter(income => {
        const date = new Date(income.dateOfIncome);
        return date.getMonth() === selectedMonth.getMonth() &&
               date.getFullYear() === selectedMonth.getFullYear();
      })
      .map(income => ({
        type: 'income',
        description: income.incomeDescription,
        amount: income.incomeAmount,
        date: new Date(income.dateOfIncome),
        category: income.incomeCategory
      }));

    const expenses = expenseData
      .filter(expense => {
        const date = new Date(expense.dateOfExpense);
        return date.getMonth() === selectedMonth.getMonth() &&
               date.getFullYear() === selectedMonth.getFullYear();
      })
      .map(expense => ({
        type: 'expense',
        description: expense.expenseDescription,
        amount: expense.expenseAmount,
        date: new Date(expense.dateOfExpense),
        category: expense.expenseCategory
      }));

    return [...income, ...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const filterTransactionsByMonth = () => {
    const allTransactions = getAllTransactions();
    
    if (showIncome) return allTransactions.filter(t => t.type === 'income');
    if (showExpenses) return allTransactions.filter(t => t.type === 'expense');
    return allTransactions;
  };

  const transactions = filterTransactionsByMonth();
  const recentTransactions = getAllTransactions().slice(0, 5);

  const handleFilterClick = (filter: 'all' | 'income' | 'expenses') => {
    setShowAll(filter === 'all');
    setShowIncome(filter === 'income');
    setShowExpenses(filter === 'expenses');
  };

  const TransactionsList = ({ transactions }: { transactions: any[] }) => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {transactions.map((transaction, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                transaction.type === 'income'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              {transaction.type === 'income' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-medium ${
                transaction.type === 'income'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </p>
            <p className="text-sm text-gray-500">
              {transaction.date.toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
      {transactions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No transactions found for this period
        </div>
      )}
    </div>
  );

  return (
    <div className="border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-102">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-[#09090B] font-semibold">Recent Transactions</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
          >
            View All
          </button>
        </div>
      </div>

      {/* Show only 5 most recent transactions in main view */}
      <TransactionsList transactions={recentTransactions} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Transactions</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterClick('all')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    showAll ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterClick('income')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    showIncome ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => handleFilterClick('expenses')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    showExpenses ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>

            {/* Show filtered transactions in modal */}
            <TransactionsList transactions={transactions} />

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
