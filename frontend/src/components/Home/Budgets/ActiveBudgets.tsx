import React, { useEffect, useState } from 'react'
import type { BudgetResponseObject, ExpenseResponseObject } from '@/types/types'
import { X, Pencil, Trash2 } from 'lucide-react';
import type { UseMutationResult } from '@tanstack/react-query';
import UpdateBudget from './UpdateBudget';

/**
 * * For useMutationResult generic parameters:
 * @template TData - Return type from mutation
 * @template TError - Error: The error type that can be thrown  
 * @template TVariables - The input data type for the mutation
 * @template TContext - unknown: Context type (not used)
 */
interface ActiveBudgetProps {
  budgets: BudgetResponseObject[]
  expenses: ExpenseResponseObject[]
  selectedMonth: Date
  mutation: UseMutationResult<number, Error, number, unknown>;
  updateBudgetMutation: UseMutationResult<BudgetResponseObject, Error, BudgetResponseObject, unknown>;
}

const ActiveBudgets = ({ budgets, selectedMonth, expenses, mutation, updateBudgetMutation }: ActiveBudgetProps) => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [spentPerCategory, setSpentPerCategory] = useState<Map<string, number>>(new Map());
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editTooltip, setEditTooltip] = useState<string | null>(null);
  const [modalEditTooltip, setModalEditTooltip] = useState<string | null>(null)
  const [modalDeleteTooltip, setModaDeleteTooltip] = useState<string | null>(null)
  const [deleteTooltip, setDeleteTooltip] = useState<string | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<number>(0);
  const [budgetToEdit, setBudgetToEdit] = useState<number>(0);

  const filterBudgetsByMonth = (listOfBudgets: BudgetResponseObject[]) => {
    const monthlyBudgets = listOfBudgets?.filter(budget => {
      const budgetDate = new Date(budget.budgetDate);
      return (budgetDate.getMonth() === selectedMonth.getMonth() && budgetDate.getFullYear() === selectedMonth.getFullYear())
        || (budget.recurring === "yes")
    })

    return monthlyBudgets;
  }

  const calculateSpentByCategory = (listOfExpenses: ExpenseResponseObject[]) => {
    const categoryMap = new Map<string, number>();

    listOfExpenses.filter(expense => {
      const expenseDate = new Date(expense.dateOfExpense)
      return expenseDate.getMonth() === selectedMonth.getMonth() &&
        expenseDate.getFullYear() === selectedMonth.getFullYear()
    })
      .forEach(expense => {
        const amount = parseFloat(expense.expenseAmount);
        categoryMap.set(
          expense.expenseCategory,
          (categoryMap.get(expense.expenseCategory) || 0) + amount
        );
      })

    setSpentPerCategory(categoryMap);
  }

  const renderProgressBar = (budget: BudgetResponseObject) => {
    const spent = parseFloat((spentPerCategory.get(budget.budgetCategory) || 0).toFixed(2));
    const limit = parseFloat(parseFloat(budget.budgetLimit).toFixed(2));
    const percentage = Math.min((spent / limit) * 100, 100);

    return (
      <>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${percentage > 90 ? 'bg-red-600' :
              percentage > 75 ? 'bg-yellow-400' :
                'bg-green-600'
              }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${percentage > 90 ? 'text-red-600' :
          percentage > 75 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
          ${spent} / ${limit}
        </span>
      </>
    );
  }


  useEffect(() => {
    calculateSpentByCategory(expenses);
  }, [budgets, expenses])

  const filteredBudgets = filterBudgetsByMonth(budgets);

  const BudgetTable = ({ data, showAll = false, onEditTooltip, onDeleteTooltip }:
    {
      data: BudgetResponseObject[],
      showAll?: boolean
      onEditTooltip: (id: string | null) => void,
      onDeleteTooltip: (id: string | null) => void
    }) => (
    <table className="w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Limit
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Spent
          </th>
          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Progress
          </th>
          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {(showAll ? data : data?.slice(0, 5))?.map((budget: BudgetResponseObject) => (
          <tr
            key={budget.id}
            className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'}`}>
              <span className={`px-3 py-1 rounded-full ${showAll ? 'text-sm' : 'text-xs'} font-medium bg-gray-100 text-gray-800 capitalize`}>
                {budget.budgetCategory}
              </span>
            </td>
            <td className={`px-6 py-4 ${showAll ? 'text-base' : 'text-sm'} text-gray-900`}>
              {`$${budget.budgetLimit}`}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'} text-red-500`}>
              {`$${spentPerCategory.get(budget.budgetCategory)?.toFixed(2) ?? "0.00"}`}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'}`}>
              {renderProgressBar(budget)}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap ${showAll ? 'text-base' : 'text-sm'}`}>
              <div className='flex flex-row items-center justify-end gap-8 relative pr-8'>
                <div className="relative">
                  <button
                    className='cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out px-3 py-3 rounded-lg'
                    onClick={() => {
                      setIsEditModalOpen(true)
                      setBudgetToEdit(budget.id)
                    }}
                    onMouseEnter={() => onEditTooltip(String(budget.id))}
                    onMouseLeave={() => onEditTooltip(null)}
                  >
                    <Pencil width={20} height={20} />
                  </button>
                  {(showAll ? modalEditTooltip : editTooltip) === String(budget.id) && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                      Edit Budget
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    className='cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out px-3 py-3 rounded-lg'
                    onClick={() => {
                      setDeleteModalOpen(true)
                      setBudgetToDelete(budget.id)
                    }}
                    onMouseEnter={() => onDeleteTooltip(String(budget.id))}
                    onMouseLeave={() => onDeleteTooltip(null)}
                  >
                    <Trash2 width={20} height={20} />
                  </button>
                  {(showAll ? modalDeleteTooltip : deleteTooltip) === String(budget.id) && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                      Delete Budget
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
              No income found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="flex flex-col justify-start border-1 border-gray-300 shadow-lg rounded-xl min-h-102 w-full">
        <div className="p-6 border-b border-gray-200 w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Active Budgets</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <BudgetTable data={filteredBudgets || []} onEditTooltip={setEditTooltip} onDeleteTooltip={setDeleteTooltip} />
        </div>
      </div>

      {
        isModalOpen && (
          <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Active Budgets</h1>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <BudgetTable
                  data={filteredBudgets || []}
                  showAll={true}
                  onEditTooltip={setModalEditTooltip}
                  onDeleteTooltip={setDeleteTooltip}
                />
              </div>
            </div>
          </div>
        )
      }
      {
        isEditModalOpen && (
          <div className='fixed inset-0 bg-black/40 z-50'>
            <UpdateBudget
              setToggleUpdateBudget={setIsEditModalOpen}
              mutation={updateBudgetMutation}
              budgetId={budgetToEdit}
            />
          </div>
        )
      }
      {
        deleteModalOpen && (
          <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
            <div className='bg-white flex-col items-center justify-center rounded-xl p-6 w-2/5'>
              <div className='flex flex-col items-start gap-4'>
                <h1 className='font-bold text-xl'>Delete Budget?</h1>
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
                    mutation.mutate(budgetToDelete)
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
  )
}

export default ActiveBudgets