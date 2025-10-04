import { useState } from 'react';
import type { IncomeResponseObject, ExpenseResponseObject } from '../../../types/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopCategoriesProps {
  incomeData: IncomeResponseObject[];
  expenseData: ExpenseResponseObject[];
  selectedMonth: Date;
}

interface CategoryTotal {
  category: string;
  total: number;
  type: 'income' | 'expense';
  percentage: number;
}

const TopCategories = ({ incomeData, expenseData, selectedMonth }: TopCategoriesProps) => {
  const [showType, setShowType] = useState<'income' | 'expense'>('expense');

  const calculateCategoryTotals = () => {
    const categoryTotals = new Map<string, number>();
    let totalAmount = 0;

    if (showType === 'income') {
      // Calculate income categories
      incomeData
        .filter(income => {
          const date = new Date(income.dateOfIncome);
          return date.getMonth() === selectedMonth.getMonth() &&
                 date.getFullYear() === selectedMonth.getFullYear();
        })
        .forEach(income => {
          const amount = parseFloat(income.incomeAmount);
          categoryTotals.set(
            income.incomeCategory,
            (categoryTotals.get(income.incomeCategory) || 0) + amount
          );
          totalAmount += amount;
        });
    } else {
      // Calculate expense categories
      expenseData
        .filter(expense => {
          const date = new Date(expense.dateOfExpense);
          return date.getMonth() === selectedMonth.getMonth() &&
                 date.getFullYear() === selectedMonth.getFullYear();
        })
        .forEach(expense => {
          const amount = parseFloat(expense.expenseAmount);
          categoryTotals.set(
            expense.expenseCategory,
            (categoryTotals.get(expense.expenseCategory) || 0) + amount
          );
          totalAmount += amount;
        });
    }

    // Convert to array and calculate percentages
    const categoriesArray: CategoryTotal[] = Array.from(categoryTotals.entries())
      .map(([category, total]) => ({
        category,
        total,
        type: showType,
        percentage: totalAmount > 0 ? (total / totalAmount) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);

    return categoriesArray;
  };

  const categories = calculateCategoryTotals();

  return (
    <div className="flex flex-col border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-52">
      <div className="w-full mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-[#09090B] font-semibold">Top Categories</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowType('expense')}
              className={`px-3 py-1 rounded-lg text-sm ${
                showType === 'expense' ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setShowType('income')}
              className={`px-3 py-1 rounded-lg text-sm ${
                showType === 'income' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
              }`}
            >
              Income
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  category.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {category.type === 'income' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium capitalize">{category.category}</p>
                <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}% of total</p>
              </div>
            </div>
            <p className={`font-medium ${
              category.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              ${category.total.toFixed(2)}
            </p>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No {showType} categories found for this period
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCategories;
