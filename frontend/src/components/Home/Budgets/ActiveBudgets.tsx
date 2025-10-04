import React from 'react'
import type { BudgetResponseObject } from '@/types/types'

interface ActiveBudgetProps {
  budgets: BudgetResponseObject
  selectedMonth: Date
}

const ActiveBudgets = ({ budgets, selectedMonth }: ActiveBudgetProps) => {
  return (
    <div className="flex flex-row justify-center border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-102">
      <div className="w-full">
        <h1 className="text-2xl text-[#09090B] font-semibold">Active Budgets</h1>
      </div>
    </div>
  )
}

export default ActiveBudgets