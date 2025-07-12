import {
  PanelLeft,
  PlusIcon,
  Calendar,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import MetricCard from "./MetricCard";
import RecentExpenses from "./ExpenseComponents/RecentExpenses";
import ExpenseCategories from "./ExpenseComponents/ExpenseCategories";
import BudgetStatus from "./ExpenseComponents/BudgetStatus";
import QuickStats from "./ExpenseComponents/QuickStats";

interface ExpenseProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}
const Expenses = ({ toggleSideBar, setToggleSideBar }: ExpenseProps) => {
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
        >
          <PlusIcon className="w-5 h-5" color="white" />
          <p className="text-white text-base font-bold">Add Expense</p>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-3 w-full p-6">
        <MetricCard
          title="Total Expenses This Month"
          icon={TrendingDown}
          amount="$5,583.00"
        />
        <MetricCard
          title="Average per Transaction"
          icon={DollarSign}
          amount="$5,583.00"
        />
        <MetricCard
          title="Expenses This Week"
          icon={Calendar}
          amount="$5,583.00"
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
    </div>
  );
};

export default Expenses;
