import {
  PanelLeft,
  PlusIcon,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import MetricCard from "./MetricCard";
import IncomeHistory from "./Income/IncomeHistory";
import IncomeCategories from "./Income/IncomeCategories";
import MonthlyProjections from "./Income/MonthlyProjections";
import { useEffect, useState } from "react";
import AddIncome from "./Income/AddIncome";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface IncomeProps {
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

//Income object for creation of income transaction
interface IncomeObject {
  amount: string
  incomeDescription: string
  category: string
  frequency: string
  dateOfIncome: Date
  additionalNotes: string
}


const Income = ({ toggleSideBar, setToggleSideBar }: IncomeProps) => {

  const { auth } = useAuth();


  const queryClient = useQueryClient();

  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<string>("0.00");
  const [monthlyRecurring, setMonthlyRecurring] = useState<string>("0.00");
  const [averagePerSource, setAveragePerSource] = useState<string>("0.00");
  const [toggleAddIncome, setToggleAddIncome] = useState<boolean>(false);

  // Month selector state management
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false); // Controls visibility of month selector modal
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date()); // Tracks which month is currently selected for viewing stats

  const [incomeTransactions, setIncomeTransactions] = useState<IncomeResponseObject[]>([]);


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

  const { data, isLoading } = useQuery({
    queryKey: ["income", auth.userId],
    queryFn: fetchIncomeTransactionData,
    staleTime: Infinity,
  });

  const calculateStatsDirectly = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = incomeTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfIncome);
      return transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear;
    });

    const total = monthlyTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.incomeAmount || "0");
    }, 0);

    const recurring = monthlyTransactions.reduce((sum, transaction) => {
      if (transaction.incomeFrequency === "weekly") {
        return sum + (4 * parseFloat(transaction.incomeAmount || "0"));
      } else if (transaction.incomeFrequency === "bi-weekly") {
        return sum + (2 * parseFloat(transaction.incomeAmount || "0"));
      } else if (transaction.incomeFrequency === "monthly") {
        return sum + parseFloat(transaction.incomeAmount || "0")
      } else {
        return sum;
      }
    }, 0);



    setAveragePerSource((total / monthlyTransactions.length).toFixed(2));
    setMonthlyRecurring(recurring.toFixed(2));
    setTotalMonthlyIncome(total.toFixed(2));

  }

  console.log("monthlyIncome", totalMonthlyIncome);
  console.log("recurring", monthlyRecurring);
  console.log(incomeTransactions)

  const handleAddIncome = async (incomeObject: IncomeObject) => {

    // This is the format of the AddIncomeDto in the spring backend
    let body = {
      dateOfIncome: incomeObject.dateOfIncome,
      incomeAmount: incomeObject.amount,
      incomeCategory: incomeObject.category,
      incomeFrequency: incomeObject.frequency,
      additionalNotes: incomeObject.additionalNotes,
      userId: auth.userId,
      incomeDescription: incomeObject.incomeDescription
    }

    try {
      const response = await axios.post("http://localhost:3001/api/transaction/income", body);
      if (response.status === 201) {
        setToggleAddIncome(false);
      }
      return response.data
    } catch (error) {
      console.log(error);
    }
  }

  const addIncomeTransactionsMutation = useMutation({
    mutationFn: handleAddIncome,
    onSuccess: (newIncomeTransaction) => {
      queryClient.setQueryData(["income", auth.userId], (oldData: IncomeResponseObject[]) =>
        [...(oldData || []), newIncomeTransaction])
    }
  });

  //Make sure to keep incomeTransactions insync with local cache
  useEffect(() => {
    if (data) {
      setIncomeTransactions(data);
    }
  }, [data]);

  //Recalculate stats everytime incomeTransactions state is modified
  useEffect(() => {
    if (incomeTransactions.length > 0) {
      calculateStatsDirectly();
    }
  }, [incomeTransactions]);

  console.log("cache", data);
  console.log("income", incomeTransactions);


  return (
    <div className="flex flex-col items-center justify-start w-full bg-white h-screen rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="cursor-pointer"
        >
          <PanelLeft />
        </button>
        <h1 className="text-xl font-semibold">Income</h1>
      </div>

      <div className="relative w-full h-px opacity-75 bg-gray-400 mt-1" />

      <div className="flex flex-row justify-between w-full p-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-base text-[#71717A]">
            Manage and track all your income sources
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

          {/* Original Add Transaction Button - unchanged */}
          <button
            className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer h-10
        "
            onClick={() => setToggleAddIncome(true)}
          >
            <PlusIcon className="w-5 h-5" color="white" />
            <p className="text-white text-base font-bold">Add Income</p>
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3 w-full p-6">
        <MetricCard
          title="Total Income This Month"
          icon={TrendingUp}
          amount={"$" + totalMonthlyIncome}
        />
        <MetricCard
          title="Monthly Recurring"
          icon={DollarSign}
          amount={"$" + monthlyRecurring}
        />
        <MetricCard
          title="Average per source"
          icon={Calendar}
          amount={"$" + averagePerSource}
        />
      </div>

      <div className="grid grid-cols-4 w-full p-6 gap-8">
        <div className="col-span-2 h-full">
          <IncomeHistory />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <IncomeCategories />
          <MonthlyProjections />
        </div>
      </div>
      {
        toggleAddIncome && (
          <div className="fixed inset-0 w-full h-full bg-black/40 z-50">
            <AddIncome setToggleAddIncome={setToggleAddIncome} mutation={addIncomeTransactionsMutation} />
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
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          isSelected 
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

export default Income;
