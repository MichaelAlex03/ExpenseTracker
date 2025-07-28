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

interface DashboardProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const Dashboard = ({ toggleSideBar, setToggleSideBar }: DashboardProps) => {

  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [totalIncome, setTotalIncome] = useState<string>("0.00");
  const [totalExpenses, setTotalExpenses] = useState<string>("0.00");
  const [savingsRate, setSavingsRate] = useState<string>("0.00")

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
        >
          <PlusIcon className="w-5 h-5" color="white" />
          <p className="text-white text-base font-bold">Add Transaction</p>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-4 w-full p-6">
        <MetricCard title="Total Balance" icon={Wallet} amount="$5,583.00" />
        <MetricCard title="Total Income" icon={TrendingUp} amount="$5,583.00" />
        <MetricCard
          title="Total Expenses"
          icon={TrendingDown}
          amount="$5,583.00"
        />
        <MetricCard title="Savings Rate" icon={DollarSign} amount="$5,583.00" />
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
    </div>
  );
};

export default Dashboard;
