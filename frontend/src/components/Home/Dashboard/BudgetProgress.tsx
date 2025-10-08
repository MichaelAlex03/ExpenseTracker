import { useEffect, useState } from "react"

//Budget object returned from server (cache objects layout) and used for updating budget
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

//Expense object returned from POST api call
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

interface BudgetProgressProps {
  budgets: BudgetResponseObject[]
  expenses: ExpenseResponseObject[]
  selectedMonth: Date
}

const BudgetProgress = ({ budgets, expenses, selectedMonth }: BudgetProgressProps) => {

  const [spentPerCategory, setSpentPerCategory] = useState<Map<string, number>>(new Map());

  const filterBudgetsByMonth = (listOfBudgets: BudgetResponseObject[]) => {
    const monthlyBudgets = listOfBudgets?.filter(budget => {
      const budgetDate = new Date(budget.budgetDate);
      return (budgetDate.getMonth() === selectedMonth.getMonth() && budgetDate.getFullYear() === selectedMonth.getFullYear())
        || (budget.recurring === "yes")
    })

    return monthlyBudgets;
  }

  const calculateSpentByCategory = (listOfExpenses: ExpenseResponseObject[]) => {
    const categoryMap = new Map<string, number>();

    listOfExpenses?.filter(expense => {
      const expenseDate = new Date(expense.dateOfExpense)
      return expenseDate.getMonth() === selectedMonth.getMonth() &&
        expenseDate.getFullYear() === selectedMonth.getFullYear()
    })
      .forEach(expense => {
        const amount = parseFloat(expense.expenseAmount);
        categoryMap.set(
          expense.expenseCategory,
          (categoryMap.get(expense.expenseCategory) || 0) + amount
        );
      })

    setSpentPerCategory(categoryMap);
  }

  const renderProgressBar = (budget: BudgetResponseObject) => {
    const spent = parseFloat((spentPerCategory.get(budget.budgetCategory) || 0).toFixed(2));
    const limit = parseFloat(parseFloat(budget.budgetLimit).toFixed(2));
    const percentage = Math.min((spent / limit) * 100, 100);

    const formattedCategory = (category: string) => {
      if (!category) return '';
      return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }

    return (
      <>
        <div className="flex flex-row justify-between items-center mt-2">
          <p className="text-base">{formattedCategory(budget.budgetCategory)}</p>
          <p className="text-base">${spent} / ${limit}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${percentage > 90 ? 'bg-red-600' :
              percentage > 75 ? 'bg-yellow-400' :
                'bg-green-600'
              }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </>
    );
  }

  useEffect(() => {
    calculateSpentByCategory(expenses)
  }, [selectedMonth, expenses, budgets]);

  const filteredBudgets = filterBudgetsByMonth(budgets)


  return (
    <div className="flex flex-row justify-center border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-52">
      <div className="w-full">
        <h1 className="text-2xl text-[#09090B] font-semibold">
          Budget Progress
          <div className="flex flex-col mt-4">
            {filteredBudgets?.slice(0, 5).map((budget, i) => (
              <div key={i}>
                {renderProgressBar(budget)}
              </div>
            ))}
          </div>
        </h1>
      </div>
    </div>
  );
};

export default BudgetProgress;
