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

interface ExpenseObjectProps {
    amount: string
    description: string
    category: string
    paymentMethod: string
    dateOfExpense: Date
    additionalNotes: string
}

interface AddExpenseProps {
    toggleAddExpense: boolean;
    setToggleAddExpense: React.Dispatch<React.SetStateAction<boolean>>;
}

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
    "other"
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

const AddExpense = () => {

    const [expenseObject, setExpenseObject] = useState<ExpenseObjectProps>({
        amount: "",
        description: "",
        category: "",
        paymentMethod: "",
        dateOfExpense: new Date(),
        additionalNotes: ""
    });

    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue: string | Date = value;

        if (name === "dateOfExpense") {
            newValue = new Date(value)
        }

        setExpenseObject(prev => ({
            ...prev,
            [name]: newValue
        }))
    }

    const handleAddExpense = () => {
        
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='bg-white rounded-xl p-6 w-[525px] h-[700px]'>
                <div className='flex flex-col gap-1'>
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
                    <div className='flex flex-col gap-1'>
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

                    <div className='flex flex-col gap-1'>
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

                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-row items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            <label htmlFor='category' className='font-semibold text-lg'>Category *</label>
                        </div>
                        <select
                            id="category"
                            name="category"
                            value={expenseObject.category}
                            onChange={handleExpenseChange}
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
                                <label htmlFor='category' className='font-semibold text-lg'>Payment Method *</label>
                            </div>
                            <select
                                id="category"
                                name="category"
                                value={expenseObject.category}
                                onChange={handleExpenseChange}
                                className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                            >
                                <option value="" disabled>How did you pay?</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
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
                                name="dateOfExpense"
                                value={expenseObject.dateOfExpense.toISOString().split('T')[0]}
                                onChange={handleExpenseChange}
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
                            value={expenseObject.additionalNotes}
                            onChange={handleExpenseChange}
                            placeholder="Add any additional notes here..."
                            className="border border-gray-300 p-2 rounded-lg text-sm w-full h-18"
                        />
                    </div>
                </div>

                <div
                    className='flex flex-row w-full justify-end gap-4 mt-5'
                >
                    <button className='flex flex-row items-center px-4 py-2 border border-gray-300 rounded-lg gap-2 cursor-pointer'>
                        <X className='h-4 w-4' />
                        <p className='text-sm'>Cancel</p>
                    </button>
                    <button className='flex flex-row items-center px-4 py-2 bg-red-500/90 rounded-lg gap-2 cursor-pointer'>
                        <Save className='h-4 w-4' color='white' />
                        <p className='text-white text-sm'>Save Expenses</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddExpense