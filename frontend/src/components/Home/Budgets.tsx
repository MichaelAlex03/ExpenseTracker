import { useEffect, useState } from 'react';
import {
  PanelLeft,
  PlusIcon,
  Wallet,
  TrendingDown,
  DollarSign,
  Calendar,
} from "lucide-react";
import MetricCard from "./MetricCard";
import ActiveBudgets from './Budgets/ActiveBudgets';
import SpendingByCategory from './Budgets/SpendingByCategory';
import AddBudget from './Budgets/AddBudget';
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axios from 'axios';

interface BudgetsProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

//Budget object returned from server (cache objects layout)
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

//Expense object returned from server(cache object layout)
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

const Budgets = ({ toggleSideBar, setToggleSideBar }: BudgetsProps) => {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // State for month selection
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false);

  // These will be updated when budget functionality is implemented
  const [totalBudgetForMonth, setTotalBudgetForMonth] = useState<string>("0.00");
  const [totalSpentForMonth, setTotalSpentForMonth] = useState<string>("0.00");
  const [totalRemainingForMonth, setTotalRemainingForMonth] = useState<string>("0.00");
  const [toggleAddBudget, setToggleAddBudget] = useState<boolean>(false);

  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseResponseObject[]>([]);


  const handleAddBudget = async (budgetObject: BudgetObject) => {
    try {
      const response = await axios.post(`http://localhost:3002/api/budget`, budgetObject)
      setToggleAddBudget(false);
      return response.data
    } catch (error) {
      console.error(error)
    }

  }

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/budget?userId=${auth.userId}`
      )
      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const fetchExpenseTransactionData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/transaction/expense?userId=${auth.userId}`,
      )
      setExpenseTransactions(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const { data: budgetsData } = useQuery({
    queryKey: ["budgets", auth.userId],
    queryFn: fetchBudgets,
    staleTime: Infinity
  });

  const addBudgetMutation = useMutation({
    mutationFn: handleAddBudget,
    onSuccess: (newBudgetData) => {
      queryClient.setQueryData(["budgets", auth.userId], (oldData: BudgetResponseObject[]) =>
        [...(oldData || []), newBudgetData]
      )
    }
  })

  const { data: expenseData } = useQuery({
    queryKey: ["expenses", auth?.userId],
    queryFn: fetchExpenseTransactionData,
    staleTime: Infinity
  })

  console.log(budgetsData);
  console.log("expense", expenseData)

  // Function to calculate stats based on the selected month
  const calculateStatsForMonth = () => {
    if (!budgetsData || !expenseData) return;

    //Gets all budgets for the selected month
    const selectedMonthBudget = budgetsData.filter((budget: BudgetResponseObject) => {
      const budgetDate = new Date(budget.budgetDate);
      return (
        (budgetDate.getMonth() === selectedMonth.getMonth() &&
          budgetDate.getFullYear() === selectedMonth.getFullYear())
        || budget.recurring
      );
    });


    const selectedMonthExpenses = expenseData.filter((expense: ExpenseResponseObject) => {
      const expenseDate = new Date(expense.dateOfExpense);
      return (
        expenseDate.getMonth() === selectedMonth.getMonth() &&
        expenseDate.getFullYear() === selectedMonth.getFullYear()
      );
    });

    const totalBudgetForMonth = selectedMonthBudget.reduce(
      (sum: number, budget: BudgetResponseObject) => sum + parseFloat(budget.budgetLimit),
      0
    );
    const totalExpensesForMonth = selectedMonthExpenses.reduce(
      (sum: number, expense: ExpenseResponseObject) => sum + parseFloat(expense.expenseAmount),
      0
    );



    setTotalBudgetForMonth(totalBudgetForMonth.toFixed(2));
    setTotalSpentForMonth(totalExpensesForMonth.toFixed(2));
    setTotalRemainingForMonth((totalBudgetForMonth - totalExpensesForMonth).toFixed(2));

  };


  useEffect(() => {
    calculateStatsForMonth()
  }, [selectedMonth, expenseData, budgetsData])

  return (
    <div className="flex flex-col items-center justify-start w-full bg-white h-screen rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="cursor-pointer"
        >
          <PanelLeft />
        </button>
        <h1 className="text-xl font-semibold">Budgets</h1>
      </div>

      <div className="relative w-full h-px opacity-75 bg-gray-400 mt-1" />

      <div className="flex flex-row justify-between w-full p-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-base text-[#71717A]">
            Create budgets by category and track your spending
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <button
            className="flex flex-row items-center gap-3 bg-blue-600 rounded-xl p-2 cursor-pointer h-10 px-4"
            onClick={() => setToggleMonthSelector(true)}
          >
            <Calendar className="w-4 h-4" color="white" />
            <p className="text-white text-sm font-bold">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </button>

          <button
            className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer h-10"
            onClick={() => setToggleAddBudget(true)}
          >
            <PlusIcon className="w-5 h-5" color="white" />
            <p className="text-white text-base font-bold">Add Budget</p>
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3 w-full p-6">
        <MetricCard title="Total Budget" icon={Wallet} amount={"$" + totalBudgetForMonth} />
        <MetricCard title="Total Spent" icon={TrendingDown} amount={"$" + totalSpentForMonth} />
        <MetricCard
          title="Remaining Budget"
          icon={DollarSign}
          amount={"$" + totalRemainingForMonth}
        />
      </div>

      <div className="grid gap-4 grid-cols-5 w-full p-6">
        <div className="col-span-3">
          <ActiveBudgets />
        </div>
        <div className="col-span-2">
          <SpendingByCategory />
        </div>
      </div>



      {toggleAddBudget && (
        <div className="fixed inset-0 w-full h-full bg-black/40 z-50">
          <AddBudget
            setToggleAddBudget={setToggleAddBudget}
            mutation={addBudgetMutation}
          />
        </div>
      )}

      {toggleMonthSelector && (
        <div className="fixed inset-0 w-full h-full bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[400px]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Select Month</h2>
                <button
                  onClick={() => setToggleMonthSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {months.map((monthName, i) => {
                  const isSelected = selectedMonth.getMonth() === i;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedMonth(new Date(selectedMonth.getFullYear(), i, 1));
                        setToggleMonthSelector(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-colors ${isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {monthName}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-row gap-2">
                <button
                  onClick={() => {
                    const newYear = selectedMonth.getFullYear() - 1;
                    setSelectedMonth(new Date(newYear, selectedMonth.getMonth(), 1));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Previous Year
                </button>
                <button
                  onClick={() => {
                    const newYear = selectedMonth.getFullYear() + 1;
                    setSelectedMonth(new Date(newYear, selectedMonth.getMonth(), 1));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next Year →
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedMonth(new Date());
                  setToggleMonthSelector(false);
                }}
                className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today
              </button>

              <div className="text-center">
                <p className="text-lg font-semibold">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets