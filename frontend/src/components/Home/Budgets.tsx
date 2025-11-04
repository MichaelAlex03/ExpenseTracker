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
import AddBudget from './Budgets/AddBudget';
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axios from 'axios';

interface BudgetsProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

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
  const [currentSelectedMonth, setCurrentSelectedMonth] = useState<Date>(selectedMonth);
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false);

  // These will be updated when budget functionality is implemented
  const [totalBudgetForMonth, setTotalBudgetForMonth] = useState<string>("0.00");
  const [totalSpentForMonth, setTotalSpentForMonth] = useState<string>("0.00");
  const [totalRemainingForMonth, setTotalRemainingForMonth] = useState<string>("0.00");
  const [toggleAddBudget, setToggleAddBudget] = useState<boolean>(false);

  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseResponseObject[]>([]);
  const [openBudgetErrorModal, setOpenBudgetErrorModal] = useState<boolean>(false);

  const handleAddBudget = async (budgetObject: BudgetObject) => {
    const requiredFields = {...budgetObject, budgetNotes: " "}
    const hasEmptyFields = Object.values(requiredFields).some(value => !value);
    if (hasEmptyFields) {
      setOpenBudgetErrorModal(true);
      throw new Error('Required fields missing');
    }

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

  const handleRemoveBudget = async (budgetToDelete: number) => {
    try {
      await axios.delete(`http://localhost:3002/api/budget?budgetId=${budgetToDelete}`);
      return budgetToDelete;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete budget");
    }
  }

  const handleUpdateBudget = async (budgetObject: BudgetResponseObject) => {
    try {
      const response = await axios.patch('http://localhost:3002/api/budget', budgetObject);
      return response.data
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update budget");
    }
  }

  const { data: budgetsData } = useQuery({
    queryKey: ["budgets", auth.userId],
    queryFn: fetchBudgets,
    staleTime: Infinity
  });

  const { data: expenseData } = useQuery({
    queryKey: ["expenses", auth?.userId],
    queryFn: fetchExpenseTransactionData,
    staleTime: Infinity
  })

  const addBudgetMutation = useMutation({
    mutationFn: handleAddBudget,
    onSuccess: (newBudgetData) => {
      queryClient.setQueryData(["budgets", auth.userId], (oldData: BudgetResponseObject[]) =>
        [...(oldData || []), newBudgetData]
      )
    }
  })

  const removeBudgetMutation = useMutation({
    mutationFn: handleRemoveBudget,
    onSuccess: (budgetId: number) => {
      queryClient.setQueryData(["budgets", auth.userId], (oldData: BudgetResponseObject[]) => (
        (oldData || []).filter(budget => budget.id !== budgetId)
      ))
    }
  })

  const updateBudgetMutation = useMutation({
    mutationFn: handleUpdateBudget,
    onSuccess: (updatedBudget: BudgetResponseObject) => {
      queryClient.setQueryData(["budgets", auth.userId], (oldData: BudgetResponseObject[]) => ([
        ...(oldData || []).filter(budget => budget.id !== updatedBudget.id), updatedBudget
      ]))
    }
  })


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


  const updateDate = () => {
    setSelectedMonth(currentSelectedMonth)
    setToggleMonthSelector(false)
  }


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

      <div className="flex w-full p-6">
        <ActiveBudgets
          budgets={budgetsData}
          expenses={expenseData}
          selectedMonth={selectedMonth}
          mutation={removeBudgetMutation}
          updateBudgetMutation={updateBudgetMutation}
        />
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

              <div className='flex flex-col gap-4'>
                <button
                  onClick={() => {
                    setSelectedMonth(new Date());
                    setCurrentSelectedMonth(new Date())
                    setToggleMonthSelector(false);
                  }}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    updateDate()
                  }}
                  className="w-full p-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold">
                  {currentSelectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {openBudgetErrorModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white flex-col items-center justify-center rounded-xl p-6 w-2/5'>
            <div className='flex flex-col items-start gap-4'>
              <h1 className='font-bold text-xl'>Error</h1>
              <p className='text-base text-gray-500'>One or more required fields missing</p>
            </div>
            <div className='w-full gap-6 flex items-center justify-end'>
              <button
                className='border-1 border-gray-500/40 px-4 py-2 rounded-lg hover:bg-gray-400/20 transition-colors duration-150 cursor-pointer'
                onClick={() => setOpenBudgetErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets