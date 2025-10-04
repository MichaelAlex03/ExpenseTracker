import { useState, useEffect } from "react";
import { type ExpenseResponseObject } from "../../../types/types";
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface ExpenseCategoriesProps {
  selectedMonth: Date;
  expenses: ExpenseResponseObject[];
}

interface CategoryTotal {
  name: string;
  value: number;
  percentage: number;
  [key: string]: string | number; // Index signature for chart data
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9E9E9E', '#58508D', '#BC5090', '#FF6361'];

const ExpenseCategories = ({ selectedMonth, expenses }: ExpenseCategoriesProps) => {
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    const calculateCategoryTotals = () => {
      const categoryMap = new Map<string, number>();
      let totalAmount = 0;

      expenses
        .filter(expense => {
          const expenseDate = new Date(expense.dateOfExpense);
          return expenseDate.getMonth() === selectedMonth.getMonth() &&
                 expenseDate.getFullYear() === selectedMonth.getFullYear();
        })
        .forEach(expense => {
          const amount = parseFloat(expense.expenseAmount);
          categoryMap.set(
            expense.expenseCategory,
            (categoryMap.get(expense.expenseCategory) || 0) + amount
          );
          totalAmount += amount;
        });

      const sortedCategories = Array.from(categoryMap.entries())
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          percentage: totalAmount > 0 ? (value / totalAmount) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value);

      setCategoryTotals(sortedCategories);
    };

    calculateCategoryTotals();
  }, [selectedMonth, expenses]);

  return (
    <div className="flex flex-col border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-80">
      <div className="w-full">
        <h1 className="text-2xl text-[#09090B] font-semibold mb-4">
          Expense Categories
        </h1>
        {categoryTotals.length > 0 ? (
          <div className="w-full flex flex-col">
            <div className="h-[300px]">
              <PieChart width={300} height={300}>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryTotals.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </div>
            <div className="mt-4 space-y-2">
              {categoryTotals.map((category, index) => (
                <div key={category.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-600">${category.value.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">{category.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No expenses found for this month</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategories;
