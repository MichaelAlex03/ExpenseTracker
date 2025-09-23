import { useState } from 'react';
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
import SpendingByCategory from './Budgets/SpendingByCategory';
import AddBudget from './Budgets/AddBudget';

interface BudgetsProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const Budgets = ({ toggleSideBar, setToggleSideBar }: BudgetsProps) => {

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // State for month selection
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [toggleMonthSelector, setToggleMonthSelector] = useState<boolean>(false);
  
  // These will be updated when budget functionality is implemented
  const [totalBudgetForMonth, setTotalBudgetForMonth] = useState<string>("0.00");
  const [totalSpentForMonth, setTotalSpentForMonth] = useState<string>("0.00");
  const [totalRemainingForMonth, setTotalRemainingForMonth] = useState<string>("0.00");
  const [toggleAddBudget, setToggleAddBudget] = useState<boolean>(false);

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
          >
            <PlusIcon className="w-5 h-5" color="white" />
            <p className="text-white text-base font-bold">Add Transaction</p>
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

      <div className="grid gap-4 grid-cols-5 w-full p-6">
        <div className="col-span-3">
          <ActiveBudgets/>
        </div>
        <div className="col-span-2">
          <SpendingByCategory/>
        </div>
      </div>

      

      {toggleAddBudget && (
        <div className="fixed inset-0 w-full h-full bg-black/40 z-50">
          <AddBudget />
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
                  const isSelected = selectedMonth.getMonth() === i;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedMonth(new Date(selectedMonth.getFullYear(), i, 1));
                        setToggleMonthSelector(false);
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
                    const newYear = selectedMonth.getFullYear() - 1;
                    setSelectedMonth(new Date(newYear, selectedMonth.getMonth(), 1));
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Previous Year
                </button>
                <button
                  onClick={() => {
                    const newYear = selectedMonth.getFullYear() + 1;
                    setSelectedMonth(new Date(newYear, selectedMonth.getMonth(), 1));
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

              <div className="text-center">
                <p className="text-lg font-semibold">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets