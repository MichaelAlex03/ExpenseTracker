import {
  PanelLeft,
  PlusIcon,
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import MetricCard from "./MetricCard";
import MonthlyOverview from "./Dashboard/MonthlyOverview";
import RecentTransactions from "./Dashboard/RecentTransactions";
import TopCategories from "./Dashboard/TopCategories";
import BudgetProgress from "./Dashboard/BudgetProgress";
import { useState, useEffect } from "react";
import AddTransaction from "./Dashboard/AddTransaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

interface DashboardProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

interface BaseTransaction {
  amount: string;
  dateOfTransaction: Date;
  additionalNotes: string;
}

//Income object for creation of income transaction
interface IncomeTransaction extends BaseTransaction {
  transactionType: 'income';
  incomeDescription: string;
  category: string;
  frequency: string;
}

//Expense object for creation of expense transaction
interface ExpenseTransaction extends BaseTransaction {
  transactionType: 'expense';
  description: string;
  category: string;
  paymentMethod: string;
  // [key: string]: string | Date
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

  // Define months array at the top level of the component
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [totalIncome, setTotalIncome] = useState<string>("0.00");
  const [totalExpenses, setTotalExpenses] = useState<string>("0.00");
  const [savingsRate, setSavingsRate] = useState<string>("0.00");
  const [toggleAddTransaction, setToggleAddTransaction] = useState<boolean>(false);
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [currentSelectedMonth, setCurrentSelectedMonth] = useState<Date>(selectedMonth);
  const [openExpenseErrorModal, setOpenExpenseErrorModal] = useState<boolean>(false);
  const [openIncomeErrorModal, setOpenIncomeErrorModal] = useState<boolean>(false);

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
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIncomeTransactionData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/transaction/income?userId=${auth.userId}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: expenseData } = useQuery({
    queryKey: ["expenses", auth?.userId],
    queryFn: fetchExpenseTransactionData,
    staleTime: Infinity
  });

  const { data: incomeData } = useQuery({
    queryKey: ["income", auth?.userId],
    queryFn: fetchIncomeTransactionData,
    staleTime: Infinity
  });

  const { data: budgetsData } = useQuery({
    queryKey: ["budgets", auth.userId],
    queryFn: fetchBudgets,
    staleTime: Infinity
  });

  const handleAddExpenseTransaction = async (expenseObject: ExpenseTransaction) => {

    let requiredFields = { ...expenseObject, additionalNotes: " " }

    const hasEmptyFields = Object.values(requiredFields).some(value => !value);
    if (hasEmptyFields) {
      setOpenExpenseErrorModal(true);
      throw new Error('Required fields missing');
    }

    const body = {
      dateOfExpense: expenseObject.dateOfTransaction,
      expenseDescription: expenseObject.description,
      expenseAmount: expenseObject.amount,
      expenseCategory: expenseObject.category,
      expensePaymentMethod: expenseObject.paymentMethod,
      additionalNotes: expenseObject.additionalNotes,
      userId: auth.userId
    };

    try {
      const response = await axios.post("http://localhost:3001/api/transaction/expense", body);
      if (response.status === 201) {
        setToggleAddTransaction(false);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleAddIncomeTransactions = async (incomeObject: IncomeTransaction) => {
    let requiredFields = { ...incomeObject, additionalNotes: " " }

    const hasEmptyFields = Object.values(requiredFields).some(value => !value);
    if (hasEmptyFields) {
      setOpenIncomeErrorModal(true);
      throw new Error('Required fields missing');
    }

    const body = {
      dateOfIncome: incomeObject.dateOfTransaction,
      incomeAmount: incomeObject.amount,
      incomeCategory: incomeObject.category,
      incomeFrequency: incomeObject.frequency,
      additionalNotes: incomeObject.additionalNotes,
      userId: auth.userId,
      incomeDescription: incomeObject.incomeDescription
    };

    try {
      const response = await axios.post("http://localhost:3001/api/transaction/income", body);
      if (response.status === 201) {
        setToggleAddTransaction(false);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const addExpenseTransactionsMutation = useMutation({
    mutationFn: handleAddExpenseTransaction,
    onSuccess: (newExpenseTransaction) => {
      console.log("hereeee")
      queryClient.setQueryData(["expenses", auth.userId], (oldData: ExpenseResponseObject[]) =>
        [...(oldData || []), newExpenseTransaction])
    }
  });

  const addIncomeTransactionsMutation = useMutation({
    mutationFn: handleAddIncomeTransactions,
    onSuccess: (newIncomeTransaction) => {
      queryClient.setQueryData(["income", auth.userId], (oldData: IncomeResponseObject[]) =>
        [...(oldData || []), newIncomeTransaction])
    }
  });

  // Function to calculate stats based on the selected month
  const calculateStatsForMonth = () => {
    if (!incomeData || !expenseData) return;

    const selectedMonthIncome = incomeData.filter((income: IncomeResponseObject) => {
      const incomeDate = new Date(income.dateOfIncome);
      return (
        incomeDate.getMonth() === selectedMonth.getMonth() &&
        incomeDate.getFullYear() === selectedMonth.getFullYear()
      );
    });

    const selectedMonthExpenses = expenseData.filter((expense: ExpenseResponseObject) => {
      const expenseDate = new Date(expense.dateOfExpense);
      return (
        expenseDate.getMonth() === selectedMonth.getMonth() &&
        expenseDate.getFullYear() === selectedMonth.getFullYear()
      );
    });

    const totalIncomeForMonth = selectedMonthIncome.reduce(
      (sum: number, income: IncomeResponseObject) => sum + parseFloat(income.incomeAmount),
      0
    );
    const totalExpensesForMonth = selectedMonthExpenses.reduce(
      (sum: number, expense: ExpenseResponseObject) => sum + parseFloat(expense.expenseAmount),
      0
    );

    setTotalIncome(totalIncomeForMonth.toFixed(2));
    setTotalExpenses(totalExpensesForMonth.toFixed(2));
    setTotalBalance((totalIncomeForMonth - totalExpensesForMonth).toFixed(2));

    const savingsRate = totalIncomeForMonth > 0 ? ((totalIncomeForMonth - totalExpensesForMonth) / totalIncomeForMonth) * 100 : 0;
    setSavingsRate(savingsRate.toFixed(2));
  };

  const updateDate = () => {
    setSelectedMonth(currentSelectedMonth)
    setToggleMonthSelector(false)
  }

  useEffect(() => {
    calculateStatsForMonth();
  }, [selectedMonth, incomeData, expenseData]);

  console.log(expenseData)

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
            onClick={() => setToggleAddTransaction(true)}
          >
            <PlusIcon className="w-5 h-5" color="white" />
            <p className="text-white text-base font-bold">Add Transaction</p>
          </button>
        </div>
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
          <MonthlyOverview
            incomeData={incomeData || []}
            expenseData={expenseData || []}
            selectedMonth={selectedMonth}
          />
        </div>
        <div className="col-span-2">
          <RecentTransactions
            incomeData={incomeData || []}
            expenseData={expenseData || []}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 w-full p-6">
        <TopCategories
          incomeData={incomeData || []}
          expenseData={expenseData || []}
          selectedMonth={selectedMonth}
        />
        <BudgetProgress
          budgets={budgetsData}
          expenses={expenseData}
          selectedMonth={selectedMonth}
        />
      </div>

      {toggleAddTransaction && (
        <div className="fixed inset-0 w-full h-full bg-black/40 z-50">
          <AddTransaction
            setToggleAddTransaction={setToggleAddTransaction}
            incomeMutation={addIncomeTransactionsMutation}
            expenseMutation={addExpenseTransactionsMutation}
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

              <div className="flex flex-row gap-2">
                <button
                  onClick={() => {
                    const newYear = currentSelectedMonth.getFullYear() - 1;
                    setCurrentSelectedMonth(new Date(newYear, currentSelectedMonth.getMonth(), 1));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Previous Year
                </button>
                <button
                  onClick={() => {
                    const newYear = currentSelectedMonth.getFullYear() + 1;
                    setCurrentSelectedMonth(new Date(newYear, currentSelectedMonth.getMonth(), 1));
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

              <button
                onClick={updateDate}
                className="w-full p-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>

              <div className="text-center">
                <p className="text-lg font-semibold">
                  {currentSelectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        (openExpenseErrorModal || openIncomeErrorModal) && (
          <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
            <div className='bg-white flex-col items-center justify-center rounded-xl p-6 w-2/5'>
              <div className='flex flex-col items-start gap-4'>
                <h1 className='font-bold text-xl'>Error</h1>
                <p className='text-base text-gray-500'>One or more required fields missing</p>
              </div>
              <div className='w-full gap-6 flex items-center justify-end'>
                <button
                  className='border-1 border-gray-500/40 px-4 py-2 rounded-lg hover:bg-gray-400/20 transition-colors duration-150 cursor-pointer'
                  onClick={() => {
                    setOpenExpenseErrorModal(false)
                    setOpenIncomeErrorModal(false)
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Dashboard;
