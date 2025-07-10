import { PanelLeft, PlusIcon, Wallet, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import MetricCard from "./MetricCard";

interface DashboardProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const Dashboard = ({ toggleSideBar, setToggleSideBar }: DashboardProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white h-full rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button onClick={() => setToggleSideBar(!toggleSideBar)} className="cursor-pointer">
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

        <button className="flex flex-row items-center gap-4 bg-black rounded-xl p-2 cursor-pointer">
          <PlusIcon className="w-5 h-5" color="white" />
          <p className="text-white text-base font-bold">Add Transaction</p>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-4 w-full p-6">
        <MetricCard title="Total Balance" icon={Wallet} amount="$5,583.00" />
        <MetricCard title="Total Income" icon={TrendingUp} amount="$5,583.00" />
        <MetricCard title="Total Expenses" icon={TrendingDown} amount="$5,583.00" />
        <MetricCard title="Savings Rate" icon={DollarSign} amount="$5,583.00" />
      </div>
    </div>
  );
};

export default Dashboard;
