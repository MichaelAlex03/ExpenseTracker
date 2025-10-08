import React, { useEffect, useState } from 'react'
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Briefcase,
  Repeat,
  FileText,
  Save,
  X,
} from "lucide-react";
import type { UseMutationResult } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';

interface IncomeResponseObject {
  id: number
  incomeAmount: string
  incomeDescription: string
  incomeCategory: string
  incomeFrequency: string
  dateOfIncome: Date
  additionalNotes: string
  userId: number
}

interface UpdateIncomeProps {
  setToggleUpdateIncome: React.Dispatch<React.SetStateAction<boolean>>;
  mutation: UseMutationResult<IncomeResponseObject, Error, IncomeResponseObject, unknown>;
  incomeId: number;
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

const UpdateIncome = ({ setToggleUpdateIncome, mutation, incomeId }: UpdateIncomeProps) => {
  const { auth } = useAuth();

  const [incomeObject, setIncomeObject] = useState<IncomeResponseObject>({
    id: 0,
    incomeAmount: "",
    incomeDescription: "",
    incomeCategory: "",
    incomeFrequency: "",
    dateOfIncome: new Date(),
    additionalNotes: "",
    userId: auth.userId
  });

  const fetchIncome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/transaction/singleIncome?incomeId=${incomeId}`
      );
      setIncomeObject(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | Date = value;

    if (name === "dateOfIncome") {
      newValue = new Date(value);
    }

    setIncomeObject({ ...incomeObject, [name]: newValue });
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='bg-white rounded-xl p-6 w-[525px] h-[700px]'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-row gap-2'>
            <div className='bg-green-500/10 rounded-lg flex items-center justify-center h-8 w-8'>
              <TrendingUp color='green' className='h-4 w-4' />
            </div>
            <h1 className='font-semibold text-lg'>Update Income</h1>
          </div>
          <div>
            <p className='text-[#71717A] text-sm'>Update your income source details</p>
          </div>
        </div>

        <div className='flex flex-col gap-6 mt-10'>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <TrendingUp className='h-4 w-4' />
              <label htmlFor='incomeAmount' className='font-semibold text-lg'>Amount *</label>
            </div>
            <input
              type="number"
              step="0.01"
              value={incomeObject.incomeAmount}
              onChange={handleIncomeChange}
              id="incomeAmount"
              name="incomeAmount"
              placeholder="0.00"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <Briefcase className='h-4 w-4' />
              <label htmlFor='incomeDescription' className='font-semibold text-lg'>Income Description *</label>
            </div>
            <input
              type="text"
              id="incomeDescription"
              name="incomeDescription"
              value={incomeObject.incomeDescription}
              onChange={handleIncomeChange}
              placeholder="Where did this money come from?"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>

          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <Briefcase className='h-4 w-4' />
              <label htmlFor='incomeCategory' className='font-semibold text-lg'>Category *</label>
            </div>
            <select
              id="incomeCategory"
              name="incomeCategory"
              value={incomeObject.incomeCategory}
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
                <label htmlFor='incomeFrequency' className='font-semibold text-lg'>Frequency *</label>
              </div>
              <select
                id="incomeFrequency"
                name="incomeFrequency"
                value={incomeObject.incomeFrequency}
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
                <label htmlFor='dateOfIncome' className='font-semibold text-lg'>Date *</label>
              </div>
              <input
                type="date"
                id="dateOfIncome"
                name="dateOfIncome"
                value={new Date(incomeObject.dateOfIncome).toISOString().split('T')[0]}
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

        <div className='flex flex-row w-full justify-end gap-4 mt-5'>
          <button
            className='flex flex-row items-center px-4 py-2 border border-gray-300 rounded-lg gap-2 cursor-pointer'
            onClick={() => setToggleUpdateIncome(false)}
          >
            <X className='h-4 w-4' />
            <p className='text-sm'>Cancel</p>
          </button>
          <button
            className='flex flex-row items-center px-4 py-2 bg-green-500/90 rounded-lg gap-2 cursor-pointer'
            onClick={() => {
              mutation.mutate(incomeObject);
              setToggleUpdateIncome(false);
            }}
          >
            <Save className='h-4 w-4' color='white' />
            <p className='text-white text-sm'>Update Income</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateIncome;