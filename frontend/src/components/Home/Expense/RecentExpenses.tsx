import { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import type { ExpenseResponseObject } from '../../../types/types';
import type { UseMutationResult } from '@tanstack/react-query';
import UpdateExpense from './UpdateExpense';

/**
 * * For useMutationResult generic parameters:
 * @template TData - Return type from mutation
 * @template TError - Error: The error type that can be thrown  
 * @template TVariables - The input data type for the mutation
 * @template TContext - unknown: Context type (not used)
 */
interface RecentExpensesProps {
  expenses: ExpenseResponseObject[];
  selectedMonth: Date;
  mutation: UseMutationResult<number, Error, number, unknown>;
  updateExpenseMutation: UseMutationResult<ExpenseResponseObject, Error, ExpenseResponseObject, unknown>;
}

const RecentExpenses = ({ expenses, selectedMonth, mutation, updateExpenseMutation }: RecentExpensesProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [modalEditTooltip, setModalEditTooltip] = useState<string | null>(null);
  const [modalDeleteTooltip, setModalDeleteTooltip] = useState<string | null>(null);
  const [deleteTooltip, setDeleteTooltip] = useState<string | null>(null);
  const [editTooltip, setEditTooltip] = useState<string | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<number>(0);
  const [expenseToEdit, setExpenseToEdit] = useState<number>(0);

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

  const ExpenseTable = ({ data, showAll = false, onEditTooltip, onDeleteTooltip }: { 
    data: ExpenseResponseObject[], 
    showAll?: boolean,
    onEditTooltip: (id: string | null) => void,
    onDeleteTooltip: (id: string | null) => void
  }) => (
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
          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
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
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-right font-medium text-gray-600`}>
              <div className='flex flex-row items-center justify-end gap-8 relative pr-8'>
                <div className="relative">
                  <button
                    className='cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out px-3 py-3 rounded-lg'
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setExpenseToEdit(expense.id);
                    }}
                    onMouseEnter={() => onEditTooltip(String(expense.id))}
                    onMouseLeave={() => onEditTooltip(null)}
                  >
                    <Pencil width={20} height={20} />
                  </button>
                  {(showAll ? modalEditTooltip : editTooltip) === String(expense.id) && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                      Edit Expense
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    className='cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out px-3 py-3 rounded-lg'
                    onClick={() => {
                      setDeleteModalOpen(true)
                      setExpenseToDelete(expense.id)
                    }}
                    onMouseEnter={() => onDeleteTooltip(String(expense.id))}
                    onMouseLeave={() => onDeleteTooltip(null)}
                  >
                    <Trash2 width={20} height={20} />
                  </button>
                  {(showAll ? modalDeleteTooltip : deleteTooltip) === String(expense.id) && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                      Delete Expense
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
              </div>
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
          <ExpenseTable 
            data={filteredExpenses || []} 
            onEditTooltip={setEditTooltip}
            onDeleteTooltip={setDeleteTooltip}
          />
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
              <ExpenseTable 
                data={filteredExpenses || []} 
                showAll 
                onEditTooltip={setEditTooltip}
                onDeleteTooltip={setDeleteTooltip}
              />
            </div>
          </div>
        </div>
      )}
      {
        isEditModalOpen && (
          <div className="fixed inset-0 bg-black/40 z-50">
            <UpdateExpense 
              setToggleUpdateExpense={setIsEditModalOpen}
              mutation={updateExpenseMutation}
              expenseId={expenseToEdit}
            />
          </div>
        )
      }
      {
        deleteModalOpen && (
          <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
            <div className='bg-white flex-col items-center justify-center rounded-xl p-6 w-2/5'>
              <div className='flex flex-col items-start gap-4'>
                <h1 className='font-bold text-xl'>Delete Expense?</h1>
                <p className='text-base text-gray-500'>This action cannot be undone</p>
              </div>
              <div className='w-full gap-6 flex items-center justify-end'>
                <button
                  className='border-1 border-gray-500/40 px-4 py-2 rounded-lg hover:bg-gray-400/20 transition-colors duration-150 cursor-pointer'
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className='bg-black px-4 py-2 rounded-lg cursor-pointer text-white'
                  onClick={() => {
                    mutation.mutate(expenseToDelete)
                    setDeleteModalOpen(false)
                  }
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default RecentExpenses;