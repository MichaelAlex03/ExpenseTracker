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
      } else if (transaction.incomeFrequency === "monthly"){
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

  const updateIncomeTransactionsMutation = useMutation({
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

        <button
          className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer h-10
        "
          onClick={() => setToggleAddIncome(true)}
        >
          <PlusIcon className="w-5 h-5" color="white" />
          <p className="text-white text-base font-bold">Add Income</p>
        </button>
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
            <AddIncome setToggleAddIncome={setToggleAddIncome} mutation={updateIncomeTransactionsMutation} />
          </div>
        )
      }
    </div>
  );
};

export default Income;
