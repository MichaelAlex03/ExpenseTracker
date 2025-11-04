import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  DollarSign,
  Tag,
  CreditCard,
  FileText,
  Save,
  X,
  Target
} from "lucide-react";
import type { UseMutationResult } from '@tanstack/react-query';
import useAuth from "../../../../hooks/useAuth";



const categories = [
  "food",
  "utilities",
  "transportation",
  "entertainment",
  "health",
  "shopping",
  "bills",
  "education",
  "travel",
];


//Budget object returned from server
interface BudgetResponseObject {
  id: number,
  budgetName: string,
  budgetCategory: string,
  budgetLimit: string,
  budgetNotes: string,
  recurring: string,
  userId: number
  budgetDate: Date
}

//Budget object used for budget object creation
interface BudgetObject {
  budgetName: string,
  budgetCategory: string,
  budgetLimit: string,
  budgetNotes: string,
  recurring: string,
  userId: number
  budgetDate: Date
}

/**
 * * For useMutationResult generic parameters:
 * @template TData - Return type from mutation (ExpenseResponseObject)
 * @template TError - Error: The error type that can be thrown  
 * @template TVariables - ExpenseObjectProps: The input data type for the mutation
 * @template TContext - unknown: Context type (not used)
 */
interface AddBudgetProps {
  setToggleAddBudget: React.Dispatch<React.SetStateAction<boolean>>;
  mutation: UseMutationResult<BudgetResponseObject, Error, BudgetObject, unknown>;
}

const AddBudget = ({ setToggleAddBudget, mutation }: AddBudgetProps) => {

  const { auth } = useAuth();

  const [budgetObject, setBudgetObject] = useState<BudgetObject>({
    budgetName: "",
    budgetCategory: "",
    budgetLimit: "",
    budgetNotes: "",
    recurring: "Yes",
    userId: auth.userId,
    budgetDate: new Date()
  })

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setBudgetObject({ ...budgetObject, [name]: value });
  }



  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='bg-white rounded-xl p-6 w-[525px] h-fit'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-row gap-2'>
            <div className='bg-gray-500/10 rounded-lg flex items-center justify-center h-8 w-8'>
              <Target color='black' className='h-4 w-4' />
            </div>
            <h1 className='font-semibold text-lg'>Add New Budget</h1>
          </div>
          <div>
            <p className='text-[#71717A] text-sm'>Set a spending limit for a category and track progress</p>
          </div>
        </div>

        <div className='flex flex-col gap-6 mt-10'>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <label htmlFor='budgetName' className='font-semibold text-lg'>Budget Name *</label>
            </div>
            <input
              type="text"
              id="budgetName"
              name="budgetName"
              value={budgetObject.budgetName}
              onChange={handleBudgetChange}
              placeholder='e.g Food Budget'
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>


          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <label htmlFor='budgetLimit' className='font-semibold text-lg'>Budget Amount *</label>
            </div>
            <input
              type="number"
              id="budgetLimit"
              name="budgetLimit"
              value={budgetObject.budgetLimit}
              onChange={handleBudgetChange}
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
              name="budgetCategory"
              value={budgetObject.budgetCategory}
              onChange={handleBudgetChange}
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
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
              <label htmlFor='recurring' className='font-semibold text-lg'>Recurring *</label>
            </div>
            <select
              id="recurring"
              name="recurring"
              value={budgetObject.recurring}
              onChange={handleBudgetChange}
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-row items-center gap-2'>
              <CalendarIcon className='h-4 w-4' />
              <label htmlFor='date' className='font-semibold text-lg'>Date *</label>
            </div>
            <input
              type="date"
              id="date"
              name="budgetDate"
              value={budgetObject.budgetDate.toISOString().split('T')[0]}
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
              disabled
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <div className='flex flex-row items-center gap-2'>
            <FileText className='h-4 w-4' />
            <label htmlFor='additionalNotes' className='font-semibold text-lg'>Additional Notes(Optional)</label>
          </div>
          <textarea
            id="additionalNotes"
            name="budgetNotes"
            value={budgetObject.budgetNotes}
            onChange={handleBudgetChange}
            placeholder="Add any additional notes here..."
            className="border border-gray-300 p-2 rounded-lg text-sm w-full h-18"
          />
        </div>
      </div>

      <div
        className='flex flex-row w-full justify-end gap-4 mt-5'
      >
        <button
          className='flex flex-row items-center px-4 py-2 border border-gray-300 rounded-lg gap-2 cursor-pointer'
          onClick={() => setToggleAddBudget(false)}
        >
          <X className='h-4 w-4' />
          <p className='text-sm'>Cancel</p>
        </button>
        <button
          className='flex flex-row items-center px-4 py-2 bg-black rounded-lg gap-2 cursor-pointer'
          onClick={() => mutation.mutate(budgetObject)}
        >
          <Save className='h-4 w-4' color='white' />
          <p className='text-white text-sm'>Save Budget</p>
        </button>
      </div>
    </div>
    </div >

  )
}

export default AddBudget