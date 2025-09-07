import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Briefcase,
  Repeat,
  FileText,
  Save,
  X,
} from "lucide-react";
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

interface IncomeObjectProps {
  amount: string
  incomeSource: string
  category: string
  frequency: string
  dateOfIncome: Date
  additionalNotes: string
}

interface AddIncomeProps {
  setToggleAddIncome: React.Dispatch<React.SetStateAction<boolean>>;
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

const frequencies = [
  "monthly",
  "weekly",
  "bi-weekly",
  "quarterly",
  "annually",
  "one-time",
];

const INCOME_URL = '/api/transaction/income'


const AddIncome = ({ setToggleAddIncome }: AddIncomeProps) => {

  const [incomeObject, setIncomeObject] = useState<IncomeObjectProps>({
    amount: "",
    incomeSource: "",
    category: "",
    frequency: "",
    dateOfIncome: new Date(),
    additionalNotes: ""
  });

  const axiosPrivate = useAxiosPrivate();

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | Date = value;

    if (name === "dateOfIncome") {
      newValue = new Date(value)
    }

    setIncomeObject(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleAddIncome = async () => {


    try {
      await axiosPrivate.post(INCOME_URL,
        incomeObject
      )
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='bg-white rounded-xl p-6 w-[525px] h-[700px]'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-row gap-2'>
            <div className='bg-green-500/10 rounded-lg flex items-center justify-center h-8 w-8'>
              <TrendingUp color='green' className='h-4 w-4' />
            </div>
            <h1 className='font-semibold text-lg'>Add New Income</h1>
          </div>
          <div>
            <p className='text-[#71717A] text-sm'>Record a new income source and track your earnings</p>
          </div>
        </div>

        <div className='flex flex-col gap-6 mt-10'>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <TrendingUp className='h-4 w-4' />
              <label htmlFor='amount' className='font-semibold text-lg'>Amount *</label>
            </div>
            <input
              type="number"
              step={"0.01"}
              value={incomeObject.amount}
              onChange={handleIncomeChange}
              id="amount"
              name="amount"
              placeholder="0.00"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <Briefcase className='h-4 w-4' />
              <label htmlFor='source' className='font-semibold text-lg'>Income Source *</label>
            </div>
            <input
              type="text"
              id="source"
              name="incomeSource"
              value={incomeObject.incomeSource}
              onChange={handleIncomeChange}
              placeholder="e.g., Salary, Freelance Project, Dividend Payment"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <Briefcase className='h-4 w-4' />
              <label htmlFor='category' className='font-semibold text-lg'>Category *</label>
            </div>
            <select
              id="category"
              name="category"
              value={incomeObject.category}
              onChange={handleIncomeChange}
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
                value={incomeObject.frequency}
                onChange={handleIncomeChange}
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
                <label htmlFor='date' className='font-semibold text-lg'>Date *</label>
              </div>
              <input
                type="date"
                id="date"
                name="dateOfIncome"
                value={incomeObject.dateOfIncome.toISOString().split('T')[0]}
                onChange={handleIncomeChange}
                className="border border-gray-300 p-2 rounded-lg text-sm w-full"
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
              name="additionalNotes"
              value={incomeObject.additionalNotes}
              onChange={handleIncomeChange}
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
            onClick={() => setToggleAddIncome(false)}
          >
            <X className='h-4 w-4' />
            <p className='text-sm'>Cancel</p>
          </button>
          <button className='flex flex-row items-center px-4 py-2 bg-green-500/90 rounded-lg gap-2 cursor-pointer'>
            <Save className='h-4 w-4' color='white' />
            <p className='text-white text-sm'>Save Income</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddIncome