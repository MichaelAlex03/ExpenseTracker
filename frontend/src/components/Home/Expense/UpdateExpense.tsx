import React, { useEffect, useState } from 'react'
import {
    Calendar as CalendarIcon,
    DollarSign,
    Tag,
    CreditCard,
    FileText,
    Save,
    X,
} from "lucide-react";
import type { UseMutationResult } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';

interface ExpenseResponseObject {
    id: number
    userId: number
    expenseAmount: string
    expenseDescription: string
    expenseCategory: string
    expensePaymentMethod: string
    dateOfExpense: Date
    additionalNotes: string
}

interface UpdateExpenseProps {
    setToggleUpdateExpense: React.Dispatch<React.SetStateAction<boolean>>;
    mutation: UseMutationResult<ExpenseResponseObject, Error, ExpenseResponseObject, unknown>;
    expenseId: number;
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

const UpdateExpense = ({ setToggleUpdateExpense, mutation, expenseId }: UpdateExpenseProps) => {
    const { auth } = useAuth();

    const [expenseObject, setExpenseObject] = useState<ExpenseResponseObject>({
        id: 0,
        userId: auth.userId,
        expenseAmount: "",
        expenseDescription: "",
        expenseCategory: "",
        expensePaymentMethod: "",
        dateOfExpense: new Date(),
        additionalNotes: ""
    });

    const fetchExpense = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/api/transaction/singleExpense?expenseId=${expenseId}`
            );
            setExpenseObject(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchExpense();
    }, []);

    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue: string | Date = value;

        if (name === "dateOfExpense") {
            newValue = new Date(value);
        }

        setExpenseObject({ ...expenseObject, [name]: newValue });
    };

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='bg-white rounded-xl p-6 w-[525px] h-[700px]'>
                <div className='flex flex-col gap-1'>
                    <div className='flex flex-row gap-2'>
                        <div className='bg-red-500/10 rounded-lg flex items-center justify-center h-8 w-8'>
                            <DollarSign color='red' className='h-4 w-4' />
                        </div>
                        <h1 className='font-semibold text-lg'>Update Expense</h1>
                    </div>
                    <div>
                        <p className='text-[#71717A] text-sm'>Update your expense details</p>
                    </div>
                </div>

                <div className='flex flex-col gap-6 mt-10'>
                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-row items-center gap-2'>
                            <DollarSign className='h-4 w-4' />
                            <label htmlFor='expenseAmount' className='font-semibold text-lg'>Amount *</label>
                        </div>
                        <input
                            type="number"
                            id="expenseAmount"
                            name="expenseAmount"
                            value={expenseObject.expenseAmount}
                            onChange={handleExpenseChange}
                            placeholder="0.00"
                            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                            step="0.01"
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-row items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            <label htmlFor='expenseDescription' className='font-semibold text-lg'>Description *</label>
                        </div>
                        <input
                            type="text"
                            id="expenseDescription"
                            name="expenseDescription"
                            value={expenseObject.expenseDescription}
                            onChange={handleExpenseChange}
                            placeholder="What did you spend your money on?"
                            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-row items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            <label htmlFor='expenseCategory' className='font-semibold text-lg'>Category *</label>
                        </div>
                        <select
                            id="expenseCategory"
                            name="expenseCategory"
                            value={expenseObject.expenseCategory}
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
                                <label htmlFor='expensePaymentMethod' className='font-semibold text-lg'>Payment Method *</label>
                            </div>
                            <select
                                id="expensePaymentMethod"
                                name="expensePaymentMethod"
                                value={expenseObject.expensePaymentMethod}
                                onChange={handleExpenseChange}
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
                                <label htmlFor='dateOfExpense' className='font-semibold text-lg'>Date *</label>
                            </div>
                            <input
                                type="date"
                                id="dateOfExpense"
                                name="dateOfExpense"
                                value={new Date(expenseObject.dateOfExpense).toISOString().split('T')[0]}
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

                <div className='flex flex-row w-full justify-end gap-4 mt-5'>
                    <button
                        className='flex flex-row items-center px-4 py-2 border border-gray-300 rounded-lg gap-2 cursor-pointer'
                        onClick={() => setToggleUpdateExpense(false)}
                    >
                        <X className='h-4 w-4' />
                        <p className='text-sm'>Cancel</p>
                    </button>
                    <button
                        className='flex flex-row items-center px-4 py-2 bg-red-500/90 rounded-lg gap-2 cursor-pointer'
                        onClick={() => {
                            mutation.mutate(expenseObject);
                            setToggleUpdateExpense(false);
                        }}
                    >
                        <Save className='h-4 w-4' color='white' />
                        <p className='text-white text-sm'>Update Expense</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateExpense;