import {
  PanelLeft,
  PlusIcon,
  Calendar,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import MetricCard from "./MetricCard";
import RecentExpenses from "./Expense/RecentExpenses";
import ExpenseCategories from "./Expense/ExpenseCategories";
import BudgetStatus from "./Expense/BudgetStatus";
import QuickStats from "./Expense/QuickStats";
import { useState, useEffect } from "react";
import AddExpense from "./Expense/AddExpense";
import useAuth from "../../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ExpenseProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
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

//Expense object for creation of expense transaction
interface ExpenseObject {
  amount: string
  description: string
  category: string
  paymentMethod: string
  dateOfExpense: Date
  additionalNotes: string
}

const Expenses = ({ toggleSideBar, setToggleSideBar }: ExpenseProps) => {

  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("0.00");
  const [averageExpensePerTransaction, setAverageExpensePerTransaction] = useState<string>("0.00");
  const [weeklyExpenses, setWeeklyExpenses] = useState<string>("0.00");
  const [toggleAddExpense, setToggleAddExpense] = useState<boolean>(false);

  // Month selector state management
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false); // Controls visibility of month selector modal
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date()); // Tracks which month is currently selected for viewing stats

  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseResponseObject[]>([]);

  console.log(toggleAddExpense)

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

  const { data, isLoading } = useQuery({
    queryKey: ["expenses", auth?.userId],
    queryFn: fetchExpenseTransactionData,
    staleTime: Infinity
  });

  const calculateStatsDirectly = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = expenseTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfExpense);
      return transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear;
    });

    const total = monthlyTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.expenseAmount || "0");
    }, 0);

    // Calculate current week boundaries
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyTransactions = expenseTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfExpense);
      return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
    });

    console.log("weeklyTransactions", weeklyTransactions)

    const weeklyTotal = weeklyTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.expenseAmount || "0");
    }, 0)

    setWeeklyExpenses(weeklyTotal.toFixed(2));
    setAverageExpensePerTransaction((total / monthlyTransactions.length).toFixed(2));
    setMonthlyExpenses(total.toFixed(2));

  }

  const handleAddExpense = async (expenseObject: ExpenseObject) => {

    // This is the format of the AddExpenseDto in the spring backend
    let body = {
      dateOfExpense: expenseObject.dateOfExpense,
      expenseDescription: expenseObject.description,
      expenseAmount: expenseObject.amount,
      expenseCategory: expenseObject.category,
      expensePaymentMethod: expenseObject.paymentMethod,
      additionalNotes: expenseObject.additionalNotes,
      userId: auth.userId
    }


    try {
      const response = await axios.post(
        "http://localhost:3001/api/transaction/expense",
        body
      );
      console.log(response)
      if (response.status === 201) {
        setToggleAddExpense(false);
      }
      return response.data
    } catch (error) {
      console.log(error);
      console.log((error as Error).message)
    }
  }

  const addExpenseTransactionsMutation = useMutation({
    mutationFn: handleAddExpense,
    onSuccess: (newExpenseTransaction) => {
      queryClient.setQueryData(["expenses", auth.userId], (oldData: ExpenseResponseObject[]) =>
        [...(oldData || []), newExpenseTransaction])
    }
  });

  useEffect(() => {
    if (data) {
      setExpenseTransactions(data)
    }
  }, [data])

  useEffect(() => {
    if (expenseTransactions.length > 0) {
      calculateStatsDirectly();
    }
  }, [expenseTransactions])

  console.log("cache", data)
  console.log("expenses", expenseTransactions)

  return (
    <div className="flex flex-col items-center justify-start w-full bg-white h-fit rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="cursor-pointer"
        >
          <PanelLeft />
        </button>
        <h1 className="text-xl font-semibold">Expenses</h1>
      </div>

      <div className="relative w-full h-px opacity-75 bg-gray-400 mt-1" />

      <div className="flex flex-row justify-between w-full p-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-base text-[#71717A]">
            Track and analyze your spending patterns
          </p>
        </div>

        {/* Button container - holds both month selector and add transaction buttons */}
        <div className="flex flex-row gap-3">
          {/* Month Selector Button - Blue button that shows current selected month */}
          <button
            className="flex flex-row items-center gap-3 bg-blue-600 rounded-xl p-2 cursor-pointer h-10 px-4
          "
            onClick={() => setToggleMonthSelector(true)} // Opens the month selector modal
          >
            <Calendar className="w-4 h-4" color="white" /> {/* Calendar icon */}
            <p className="text-white text-sm font-bold">
              {/* Dynamically displays selected month/year (e.g., "January 2024") */}
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </button>

          <button
            className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer h-10
        "
            onClick={() => setToggleAddExpense(true)}
          >
            <PlusIcon className="w-5 h-5" color="white" />
            <p className="text-white text-base font-bold">Add Expense</p>
          </button>
        </div>


      </div>

      <div className="grid gap-4 grid-cols-3 w-full p-6">
        <MetricCard
          title="Total Expenses This Month"
          icon={TrendingDown}
          amount={"$" + monthlyExpenses}
        />
        <MetricCard
          title="Average per Transaction"
          icon={DollarSign}
          amount={"$" + averageExpensePerTransaction}
        />
        <MetricCard
          title="Expenses This Week"
          icon={Calendar}
          amount={"$" + weeklyExpenses}
        />
      </div>

      <div className="grid grid-cols-5 w-full p-6 gap-8">
        <div className="flex flex-col col-span-3 gap-8">
          <RecentExpenses />
          <QuickStats />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <ExpenseCategories />
          <BudgetStatus />
        </div>
      </div>
      {
        toggleAddExpense && (
          <div className="fixed inset-0 w-full h-full bg-black/40 z-50">
            <AddExpense
              setToggleAddExpense={setToggleAddExpense}
              mutation={addExpenseTransactionsMutation}
            />
          </div>
        )
      }
      {/* Month Selector Modal - Conditionally rendered when toggleMonthSelector is true */}
      {
        toggleMonthSelector && (
          <div className="fixed inset-0 w-full h-full bg-black/40 z-50 flex items-center justify-center">
            {/* Modal content container - white rounded box */}
            <div className="bg-white rounded-xl p-6 w-[400px]">
              <div className="flex flex-col gap-4">
                {/* Modal header with title and close button */}
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">Select Month</h2>
                  <button
                    onClick={() => setToggleMonthSelector(false)} // Closes modal when clicked
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ {/* Close button (X) */}
                  </button>
                </div>

                {/* Month grid - 3 columns x 4 rows for all 12 months */}
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(selectedMonth.getFullYear(), i, 1); // Create date for each month
                    const monthName = date.toLocaleDateString('en-US', { month: 'short' }); // Get abbreviated month name (Jan, Feb, etc.)
                    const isSelected = selectedMonth.getMonth() === i; // Check if this month is currently selected

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          // When month is clicked: update selectedMonth and close modal
                          setSelectedMonth(new Date(selectedMonth.getFullYear(), i, 1));
                          setToggleMonthSelector(false);
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors ${isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700' // Selected month styling (blue)
                            : 'border-gray-200 hover:border-gray-300' // Unselected month styling (gray)
                          }`}
                      >
                        {monthName} {/* Display month name (Jan, Feb, etc.) */}
                      </button>
                    );
                  })}
                </div>

                {/* Year navigation buttons */}
                <div className="flex flex-row gap-2">
                  {/* Previous Year Button */}
                  <button
                    onClick={() => {
                      const newYear = selectedMonth.getFullYear() - 1; // Decrease year by 1
                      setSelectedMonth(new Date(newYear, selectedMonth.getMonth(), 1)); // Update selectedMonth with new year
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ← Previous Year
                  </button>
                  {/* Next Year Button */}
                  <button
                    onClick={() => {
                      const newYear = selectedMonth.getFullYear() + 1; // Increase year by 1
                      setSelectedMonth(new Date(newYear, selectedMonth.getMonth(), 1)); // Update selectedMonth with new year
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Next Year →
                  </button>
                </div>

                {/* Today button - resets to current month/year */}
                <button
                  onClick={() => {
                    setSelectedMonth(new Date()); // Set to current month and year
                    setToggleMonthSelector(false); // Close modal
                  }}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>

                {/* Current selection display */}
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {/* Show full month name and year (e.g., "January 2024") */}
                    {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Expenses;
