import {
  PanelLeft,
  PlusIcon,
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import MetricCard from "./MetricCard";
import MonthlyOverview from "./Dashboard/MonthlyOverview";
import RecentTransactions from "./Dashboard/RecentTransactions";
import TopCategories from "./Dashboard/TopCategories";
import BudgetProgress from "./Dashboard/BudgetProgress";
import { useState } from "react";
import AddTransaction from "./Dashboard/AddTransaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

interface DashboardProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

//Income object returned from POST api call
interface IncomeResponseObject {
  id: number
  incomeAmount: string
  incomeDescription: string
  incomeCategory: string
  incomeFrequency: string
  dateOfIncome: Date
  additionalNotes: string
  userId: number
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

const Dashboard = ({ toggleSideBar, setToggleSideBar }: DashboardProps) => {
  const queryClient = useQueryClient();

  const { auth } = useAuth();
  console.log(auth)

  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [totalIncome, setTotalIncome] = useState<string>("0.00");
  const [totalExpenses, setTotalExpenses] = useState<string>("0.00");
  const [savingsRate, setSavingsRate] = useState<string>("0.00");
  const [toggleAddTransaction, setToggleAddTransaction] = useState<boolean>(false);
  const [incomeTransaction, setIncomeTransactions] = useState<IncomeResponseObject>({
    id: 0,
    incomeAmount: '',
    incomeDescription: '',
    incomeCategory: '',
    incomeFrequency: '',
    dateOfIncome: new Date(),
    additionalNotes: '',
    userId: 0
  });
  const [expenseTransaction, setExpenseTransactions] = useState<ExpenseResponseObject>({
    id: 0,
    userId: 0,
    expenseAmount: '',
    expenseDescription: '',
    expenseCategory: '',
    expensePaymentMethod: '',
    dateOfExpense: new Date(),
    additionalNotes: ''
  });

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

  const fetchIncomeTransactionData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/transaction/income?userId=${auth.userId}`,
      )
      setIncomeTransactions(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["expenses", auth?.userId],
    queryFn: fetchExpenseTransactionData,
    staleTime: Infinity
  });

  const { data: incomeData, isLoading: incomeLoading } = useQuery({
    queryKey: ["income", auth?.userId],
    queryFn: fetchIncomeTransactionData,
    staleTime: Infinity
  });

  const updateExpenseTransactionsMutation = useMutation({

  });

  const updateIncomeTransactionsMutation = useMutation({

  });

  console.log("cache", expenseData);
  console.log("cacheeee", incomeData);


  return (
    <div className="flex flex-col items-center justify-start w-full bg-white h-fit rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="cursor-pointer"
        >
          <PanelLeft />
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="relative w-full h-px opacity-75 bg-gray-400 mt-1" />

      <div className="flex flex-row justify-between w-full p-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base text-[#71717A]">
            Track your income, expenses, and financial health
          </p>
        </div>

        <button
          className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer h-10
        "
          onClick={() => setToggleAddTransaction(true)}
        >
          <PlusIcon className="w-5 h-5" color="white" />
          <p className="text-white text-base font-bold">Add Transaction</p>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-4 w-full p-6">
        <MetricCard title="Total Balance" icon={Wallet} amount={"$" + totalBalance} />
        <MetricCard title="Total Income" icon={TrendingUp} amount={"$" + totalIncome} />
        <MetricCard
          title="Total Expenses"
          icon={TrendingDown}
          amount={"$" + totalExpenses}
        />
        <MetricCard title="Savings Rate" icon={DollarSign} amount={"%" + savingsRate} />
      </div>

      <div className="grid gap-4 grid-cols-5 w-full p-6">
        <div className="col-span-3">
          <MonthlyOverview />
        </div>
        <div className="col-span-2">
          <RecentTransactions />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 w-full p-6">
        <TopCategories />
        <BudgetProgress />
      </div>
      {
        toggleAddTransaction && (
          <div className="fixed inset-0 w-full h-full bg-black/40 z-50">
            <AddTransaction setToggleAddTransaction={setToggleAddTransaction} />
          </div>
        )
      }
    </div>
  );
};

export default Dashboard;
