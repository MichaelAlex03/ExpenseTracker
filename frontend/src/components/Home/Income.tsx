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
import { useState } from "react";

interface IncomeProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const Income = ({ toggleSideBar, setToggleSideBar }: IncomeProps) => {

  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<string>("0.00");
  const [monthlyRecurring, setMonthlyRecurring] = useState<string>("0.00");
  const [averagePerSource, setAveragePerSource] = useState<string>("0.00");

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
    </div>
  );
};

export default Income;
