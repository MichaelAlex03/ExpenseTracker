import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Repeat,
  FileText,
  Save,
  X,
  DollarSign,
  Tag,
  CreditCard,
} from "lucide-react";
import axios from 'axios';
import useAuth from '../../../../hooks/useAuth';
import type { UseMutationResult } from '@tanstack/react-query';

interface BaseTransaction {
  amount: string;
  dateOfTransaction: Date;
  additionalNotes: string;
}

interface IncomeTransaction extends BaseTransaction {
  transactionType: 'income';
  incomeDescription: string;
  category: string;
  frequency: string;
}

interface ExpenseTransaction extends BaseTransaction {
  transactionType: 'expense';
  description: string;
  category: string;
  paymentMethod: string;
}

type Transaction = IncomeTransaction | ExpenseTransaction;

interface AddTransactionProps {
  setToggleAddTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}

const incomeCategories = [
  "employment",
  "freelance",
  "business",
  "investment",
  "rental",
  "royalties",
  "pension",
  "gifts",
  "bonus",
  "other",
];

const expenseCategories = [
  "food",
  "utilities",
  "transportation",
  "entertainment",
  "health",
  "shopping",
  "bills",
  "education",
  "travel",
  "other"
];

const frequencies = [
  "monthly",
  "weekly",
  "bi-weekly",
  "quarterly",
  "annually",
  "one-time",
];

const paymentMethods = [
  "Credit Card",
  "Debit Card",
  "Cash",
  "Bank Transfer",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Venmo",
  "Check",
];

const AddTransaction = ({ setToggleAddTransaction }: AddTransactionProps) => {

  const { auth } = useAuth();

  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [transaction, setTransaction] = useState<Transaction>({
    transactionType: 'income',
    amount: '',
    incomeDescription: '',
    category: '',
    frequency: '',
    dateOfTransaction: new Date(),
    additionalNotes: ''
  } as IncomeTransaction);

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | Date = value;

    if (name === "dateOfTransaction") {
      newValue = new Date(value)
    }

    setTransaction(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const switchTransactionType = (type: 'income' | 'expense') => {
    setTransactionType(type);

    const baseData = {
      amount: transaction.amount,
      dateOfTransaction: transaction.dateOfTransaction,
      additionalNotes: transaction.additionalNotes
    };

    if (type === 'income') {
      setTransaction({
        ...baseData,
        transactionType: 'income',
        incomeDescription: '',
        category: '',
        frequency: ''
      } as IncomeTransaction);
    } else {
      setTransaction({
        ...baseData,
        transactionType: 'expense',
        description: '',
        category: '',
        paymentMethod: ''
      } as ExpenseTransaction);
    }
  };


  const handleAddExpense = async () => {

    let body = {}

    if (transaction.transactionType === 'expense') {
      // This is the format of the AddExpenseDto in the spring backend
      body = {
        dateOfExpense: transaction.dateOfTransaction,
        expenseDescription: transaction.description,
        expenseAmount: transaction.amount,
        expenseCategory: transaction.category,
        expensePaymentMethod: transaction.paymentMethod,
        additionalNotes: transaction.additionalNotes,
        userId: auth.userId
      }
    }


    try {
      const response = await axios.post("http://localhost:3001/api/transaction/expense", body);
      if (response.status === 201) {
        setToggleAddTransaction(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddIncome = async () => {
    let body = {}

    if (transaction.transactionType === 'income') {
      // This is the format of the AddIncomeDto in the spring backend
      body = {
        dateOfIncome: transaction.dateOfTransaction,
        incomeAmount: transaction.amount,
        incomeCategory: transaction.category,
        incomeFrequency: transaction.frequency,
        additionalNotes: transaction.additionalNotes,
        userId: auth.userId,
        incomeDescription: transaction.incomeDescription
      }
    }


      try {
        const response = await axios.post("http://localhost:3001/api/transaction/income", body);
        if (response.status === 201) {
          setToggleAddTransaction(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <div className='fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-xl p-6 w-[525px] max-h-[90vh] overflow-y-auto'>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row gap-2'>
              <div className={`${transactionType === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-lg flex items-center justify-center h-8 w-8`}>
                {transactionType === 'income' ?
                  <TrendingUp color='green' className='h-4 w-4' /> :
                  <TrendingDown color='red' className='h-4 w-4' />
                }
              </div>
              <h1 className='font-semibold text-lg'>Add New Transaction</h1>
            </div>
            <p className='text-[#71717A] text-sm'>
              Record a new {transactionType} transaction
            </p>
          </div>

          <div className='flex flex-col gap-6 mt-6'>
            <div className='flex flex-col gap-2'>
              <label className='font-semibold text-lg'>Transaction Type *</label>
              <div className='flex gap-2'>
                <button
                  type="button"
                  onClick={() => switchTransactionType('income')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${transactionType === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <TrendingUp className='h-4 w-4' />
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => switchTransactionType('expense')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${transactionType === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <TrendingDown className='h-4 w-4' />
                  Expense
                </button>
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-2'>
                <DollarSign className='h-4 w-4' />
                <label htmlFor='amount' className='font-semibold text-lg'>Amount *</label>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={transaction.amount}
                onChange={handleTransactionChange}
                placeholder="0.00"
                className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                step="0.01"
              />
            </div>

            {transaction.transactionType === 'income' && (
              <>
                <div className='flex flex-col gap-1'>
                  <div className='flex flex-row items-center gap-2'>
                    <Briefcase className='h-4 w-4' />
                    <label htmlFor='incomeDescription' className='font-semibold text-lg'>Income Description *</label>
                  </div>
                  <input
                    type="text"
                    id="incomeDescription"
                    name="incomeDescription"
                    value={transaction.incomeDescription}
                    onChange={handleTransactionChange}
                    placeholder="Where did this money come from?"
                    className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <div className='flex flex-row items-center gap-2'>
                    <Tag className='h-4 w-4' />
                    <label htmlFor='category' className='font-semibold text-lg'>Category *</label>
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={transaction.category}
                    onChange={handleTransactionChange}
                    className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                  >
                    <option value="" disabled>Select Income category</option>
                    {incomeCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-row w-full gap-4'>
                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-row items-center gap-2'>
                      <Repeat className='h-4 w-4' />
                      <label htmlFor='frequency' className='font-semibold text-lg'>Frequency *</label>
                    </div>
                    <select
                      id="frequency"
                      name="frequency"
                      value={transaction.frequency}
                      onChange={handleTransactionChange}
                      className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                    >
                      <option value="" disabled>How Often?</option>
                      {frequencies.map((frequency) => (
                        <option key={frequency} value={frequency}>
                          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-row items-center gap-2'>
                      <CalendarIcon className='h-4 w-4' />
                      <label htmlFor='dateOfTransaction' className='font-semibold text-lg'>Date *</label>
                    </div>
                    <input
                      type="date"
                      id="dateOfTransaction"
                      name="dateOfTransaction"
                      value={transaction.dateOfTransaction.toISOString().split('T')[0]}
                      onChange={handleTransactionChange}
                      className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                    />
                  </div>
                </div>
              </>
            )}

            {transaction.transactionType === 'expense' && (
              <>
                <div className='flex flex-col gap-1'>
                  <div className='flex flex-row items-center gap-2'>
                    <FileText className='h-4 w-4' />
                    <label htmlFor='description' className='font-semibold text-lg'>Description *</label>
                  </div>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={transaction.description}
                    onChange={handleTransactionChange}
                    placeholder="What did you spend your money on?"
                    className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <div className='flex flex-row items-center gap-2'>
                    <Tag className='h-4 w-4' />
                    <label htmlFor='category' className='font-semibold text-lg'>Category *</label>
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={transaction.category}
                    onChange={handleTransactionChange}
                    className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                  >
                    <option value="" disabled>Select a category</option>
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-row w-full gap-4'>
                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-row items-center gap-2'>
                      <CreditCard className='h-4 w-4' />
                      <label htmlFor='paymentMethod' className='font-semibold text-lg'>Payment Method *</label>
                    </div>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={transaction.paymentMethod}
                      onChange={handleTransactionChange}
                      className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                    >
                      <option value="" disabled>How did you pay?</option>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-row items-center gap-2'>
                      <CalendarIcon className='h-4 w-4' />
                      <label htmlFor='dateOfTransaction' className='font-semibold text-lg'>Date *</label>
                    </div>
                    <input
                      type="date"
                      id="dateOfTransaction"
                      name="dateOfTransaction"
                      value={transaction.dateOfTransaction.toISOString().split('T')[0]}
                      onChange={handleTransactionChange}
                      className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                    />
                  </div>
                </div>
              </>
            )}

            <div className='flex flex-col gap-1'>
              <div className='flex flex-row items-center gap-2'>
                <FileText className='h-4 w-4' />
                <label htmlFor='additionalNotes' className='font-semibold text-lg'>Additional Notes (Optional)</label>
              </div>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={transaction.additionalNotes}
                onChange={handleTransactionChange}
                placeholder="Add any additional notes here..."
                className="border border-gray-300 p-2 rounded-lg text-sm w-full h-20 resize-none"
              />
            </div>
          </div>

          <div className='flex flex-row w-full justify-end gap-4 mt-6'>
            <button
              type="button"
              className='flex flex-row items-center px-4 py-2 border border-gray-300 rounded-lg gap-2 cursor-pointer hover:bg-gray-50 transition-colors'
              onClick={() => setToggleAddTransaction(false)}
            >
              <X className='h-4 w-4' />
              <span className='text-sm'>Cancel</span>
            </button>
            <button
              type="button"
              className={`flex flex-row items-center px-4 py-2 rounded-lg gap-2 cursor-pointer transition-colors ${transactionType === 'income'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              onClick={transactionType === 'income' ? handleAddIncome : handleAddExpense}
            >
              <Save className='h-4 w-4' />
              <span className='text-sm'>Save {transactionType === 'income' ? 'Income' : 'Expense'}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  export default AddTransaction