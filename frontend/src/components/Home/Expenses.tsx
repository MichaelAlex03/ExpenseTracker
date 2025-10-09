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

//Expense object returned from server
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

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("0.00");
  const [averageExpensePerTransaction, setAverageExpensePerTransaction] = useState<string>("0.00");
  const [weeklyExpenses, setWeeklyExpenses] = useState<string>("0.00");
  const [toggleAddExpense, setToggleAddExpense] = useState<boolean>(false);
  const [largestExpense, setLargestExpense] = useState<string>("0.00");
  const [mostFrequentCategory, setMostFrequentCategory] = useState<string>("");
  const [dailyAverage, setDailyAverage] = useState<string>("0.00");

  // Month selector state management
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false); // Controls visibility of month selector modal
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date()); // Tracks which month is currently selected for viewing stats
  const [currentSelectedMonth, setCurrentSelectedMonth] = useState<Date>(selectedMonth);

  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseResponseObject[]>([]);
  const [openExpenseErrorModal, setOpenExpenseErrorModal] = useState<boolean>(false);

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

  const { data } = useQuery({
    queryKey: ["expenses", auth?.userId],
    queryFn: fetchExpenseTransactionData,
    staleTime: Infinity
  });

  const calculateStatsDirectly = () => {
    let categoriesFrequency = new Map<string, number>();
    let maxFrequency = 0;
    let mostFrequentCategory = "";
    let largestExpense = 0.00;

    const monthlyTransactions = expenseTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfExpense);
      return transactionDate.getMonth() === selectedMonth.getMonth() &&
        transactionDate.getFullYear() === selectedMonth.getFullYear();
    });

    const total = monthlyTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.expenseAmount || "0");
    }, 0);

    // Calculate week boundaries for the selected month
    const startOfWeek = new Date(selectedMonth);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(selectedMonth.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyTransactions = expenseTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfExpense);
      return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
    });

    const weeklyTotal = weeklyTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.expenseAmount || "0");
    }, 0);

    for(let i = 0; i < monthlyTransactions.length; i++){
      let expenseCategory = monthlyTransactions[i].expenseCategory;
      let expenseAmount = monthlyTransactions[i].expenseAmount;

      if (categoriesFrequency.get(expenseCategory) !== undefined) {
        categoriesFrequency.set(expenseCategory, categoriesFrequency.get(expenseCategory)! + 1);
      } else {
        categoriesFrequency.set(expenseCategory, 1);
      }

      if((categoriesFrequency.get(expenseCategory) ?? 0) > maxFrequency){
          maxFrequency = (categoriesFrequency.get(expenseCategory) ?? 0)
          mostFrequentCategory = expenseCategory;
      }

      if (parseFloat(expenseAmount) > largestExpense){
        largestExpense = parseFloat(expenseAmount);
      }

      
    }

   
    const today = new Date();
    let daysElapsed = 0
    
    if (today.getMonth() === selectedMonth.getMonth() && today.getFullYear() === selectedMonth.getFullYear()){
      daysElapsed = today.getDate()
    } else if (selectedMonth < today) {
      let date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      daysElapsed = date.getDate()
    } else {
      daysElapsed = 1
    }
    
    

    setWeeklyExpenses(weeklyTotal.toFixed(2));
    setAverageExpensePerTransaction(monthlyTransactions.length > 0 ? (total / monthlyTransactions.length).toFixed(2) : "0.00");
    setMonthlyExpenses(total.toFixed(2));
    setDailyAverage((total / daysElapsed).toFixed(2));
    setMostFrequentCategory(mostFrequentCategory);
    setLargestExpense(largestExpense.toFixed(2));
  }

  const updateDate = () => {
    setSelectedMonth(currentSelectedMonth);
    setToggleMonthSelector(false);
  }

  const handleAddExpense = async (expenseObject: ExpenseObject) => {
    const hasEmptyFields = Object.values(expenseObject).some(value => !value);
    if (hasEmptyFields) {
      setOpenExpenseErrorModal(true);
      throw new Error('Required fields missing');
    }

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

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/transaction/expense?transactionId=${expenseId}`
      );
      return expenseId;
    } catch (error) {
      throw new Error("Error deleting expense")
    }
  }

  const handleUpdateExpense = async (expenseObject: ExpenseResponseObject) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/transaction/expense`,
        expenseObject
      );
      return response.data;
    } catch (error) {
      throw new Error("Could not update expense transaction");
    }
  };

  const addExpenseTransactionsMutation = useMutation({
    mutationFn: handleAddExpense,
    onSuccess: (newExpenseTransaction) => {
      queryClient.setQueryData(["expenses", auth.userId], (oldData: ExpenseResponseObject[]) =>
        [...(oldData || []), newExpenseTransaction])
    }
  });

  const removeExpenseMutation = useMutation({
    mutationFn: handleDeleteExpense,
    onSuccess: (expenseId: number) => {
      queryClient.setQueryData(["expenses", auth.userId], (oldData: ExpenseResponseObject[]) => (
        (oldData || []).filter(expense => expense.id !== expenseId)
      ))
    }
  })

  const updateExpenseMutation = useMutation({
    mutationFn: handleUpdateExpense,
    onSuccess: (updatedExpense) => {
      queryClient.setQueryData(["expenses", auth.userId], (oldData: ExpenseResponseObject[]) => [
        ...(oldData || []).filter(expense => expense.id !== updatedExpense.id),
        updatedExpense
      ]);
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
  }, [expenseTransactions, selectedMonth])


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

      <div className="flex flex-col w-full p-6 gap-8">
        <div>
          <RecentExpenses
            expenses={expenseTransactions}
            selectedMonth={selectedMonth}
            mutation={removeExpenseMutation}
            updateExpenseMutation={updateExpenseMutation}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <ExpenseCategories expenses={expenseTransactions} selectedMonth={selectedMonth} />
          </div>
          <div className="col-span-1">
            <QuickStats
              largestExpense={largestExpense}
              mostFrequentCategory={mostFrequentCategory}
              dailyAverage={dailyAverage} 
            />
          </div>
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
                  {months.map((monthName, i) => {
                    const isSelected = currentSelectedMonth.getMonth() === i;

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentSelectedMonth(new Date(currentSelectedMonth.getFullYear(), i, 1));
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

                {/* Year navigation buttons */}
                <div className="flex flex-row gap-2">
                  {/* Previous Year Button */}
                  <button
                    onClick={() => {
                      const newYear = currentSelectedMonth.getFullYear() - 1; // Decrease year by 1
                      setCurrentSelectedMonth(new Date(newYear, currentSelectedMonth.getMonth(), 1)); // Update currentSelectedMonth with new year
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ← Previous Year
                  </button>
                  {/* Next Year Button */}
                  <button
                    onClick={() => {
                      const newYear = currentSelectedMonth.getFullYear() + 1; // Increase year by 1
                      setCurrentSelectedMonth(new Date(newYear, currentSelectedMonth.getMonth(), 1)); // Update currentSelectedMonth with new year
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
                    setCurrentSelectedMonth(new Date());
                    setToggleMonthSelector(false); // Close modal
                  }}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>

                {/* Done button - updates selectedMonth with currentSelectedMonth */}
                <button
                  onClick={updateDate}
                  className="w-full p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Done
                </button>

                {/* Current selection display */}
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {/* Show full month name and year (e.g., "January 2024") */}
                    {currentSelectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {openExpenseErrorModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white flex-col items-center justify-center rounded-xl p-6 w-2/5'>
            <div className='flex flex-col items-start gap-4'>
              <h1 className='font-bold text-xl'>Error</h1>
              <p className='text-base text-gray-500'>One or more required fields missing</p>
            </div>
            <div className='w-full gap-6 flex items-center justify-end'>
              <button
                className='border-1 border-gray-500/40 px-4 py-2 rounded-lg hover:bg-gray-400/20 transition-colors duration-150 cursor-pointer'
                onClick={() => setOpenExpenseErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
