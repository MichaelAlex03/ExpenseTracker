import { useState } from 'react';
import { X } from 'lucide-react';
import type { ExpenseResponseObject } from '../../../types/types';

interface RecentExpensesProps {
  expenses: ExpenseResponseObject[];
  selectedMonth: Date;
}

const RecentExpenses = ({ expenses, selectedMonth }: RecentExpensesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter expenses for the selected month
  const filterExpensesByMonth = (expenses: ExpenseResponseObject[]) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.dateOfExpense);
      return expenseDate.getMonth() === selectedMonth.getMonth() &&
             expenseDate.getFullYear() === selectedMonth.getFullYear();
    });
  };

  const filteredExpenses = filterExpensesByMonth(expenses);

  const ExpenseTable = ({ data, showAll = false }: { data: ExpenseResponseObject[], showAll?: boolean }) => (
    <table className="w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Payment Method
          </th>
          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {(showAll ? data : data?.slice(0, 5))?.map((expense: ExpenseResponseObject) => (
          <tr 
            key={expense.id} 
            className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-gray-600`}>
              {formatDate(expense.dateOfExpense)}
            </td>
            <td className={`px-6 py-4 ${showAll ? 'text-base' : 'text-sm'} text-gray-900`}>
              {expense.expenseDescription}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'}`}>
              <span className={`px-3 py-1 rounded-full ${showAll ? 'text-sm' : 'text-xs'} font-medium bg-gray-100 text-gray-800 capitalize`}>
                {expense.expenseCategory}
              </span>
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-gray-600`}>
              {expense.expensePaymentMethod}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-right font-medium text-red-600`}>
              -${expense.expenseAmount}
            </td>
          </tr>
        ))}
        {!data?.length && (
          <tr>
            <td 
              colSpan={5} 
              className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50"
            >
              No expenses found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Recent Expenses</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <ExpenseTable data={filteredExpenses || []} />
        </div>
      </div>

      {/* Modal for all expenses */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Expenses</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <ExpenseTable data={filteredExpenses || []} showAll />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentExpenses