import React, { useState } from 'react'
import {
    Calendar as CalendarIcon,
    DollarSign,
    Tag,
    CreditCard,
    FileText,
    Save,
    X,
} from "lucide-react";

interface ExpenseObjectProps{
    amount: string
    description: string
    category: string
    paymentMethod: string
    dateOfExpense: Date
    additionalNotes: string
}

const AddExpense = () => {

    const [expenseObject, setExpenseObject] = useState<ExpenseObjectProps>({
        amount: "",
        description: "",
        category: "",
        paymentMethod: "",
        dateOfExpense: new Date(),
        additionalNotes: ""
    });

    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue: string | Date  = value;

        if (name === "dateOfExpense"){
            newValue = new Date(value)
        } 

        setExpenseObject(prev => ({
            ...prev,
            [name]: newValue
        }))
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 w-[525px] h-[700px]'>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2'>
                        <div className='bg-red-500/10 rounded-lg flex items-center justify-center h-8 w-8'>
                            <DollarSign color='red' className='h-4 w-4' />
                        </div>
                        <h1 className='font-semibold text-lg'>Add New Expense</h1>
                    </div>
                    <div>
                        <p className='text-[#71717A] text-sm'>Record a new expense and track your spending</p>
                    </div>
                </div>

                <div className='flex flex-col gap-6 mt-10'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-row items-center gap-2'>
                            <DollarSign className='h-4 w-4' />
                            <label htmlFor='amount' className='font-semibold text-lg'>Amount *</label>
                        </div>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            placeholder="0.00"
                            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-row items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            <label htmlFor='description' className='font-semibold text-lg'>Description *</label>
                        </div>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="What did you spend your money on?"
                            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddExpense