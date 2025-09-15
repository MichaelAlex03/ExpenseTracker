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

  const updateExpenseTransactionsMutation = useMutation({
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

        <button
          className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer h-10
        "
          onClick={() => setToggleAddExpense(true)}
        >
          <PlusIcon className="w-5 h-5" color="white" />
          <p className="text-white text-base font-bold">Add Expense</p>
        </button>
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
              mutation={updateExpenseTransactionsMutation}
            />
          </div>
        )
      }
    </div>
  );
};

export default Expenses;
