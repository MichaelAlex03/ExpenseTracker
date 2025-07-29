import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  User
} from "lucide-react";

interface SidebarProps {
  showDashboard: boolean;
  setShowDashboard: (val: boolean) => void;
  showIncome: boolean;
  setShowIncome: (val: boolean) => void;
  showExpenses: boolean;
  setShowExpenses: (val: boolean) => void;
  showProfile: boolean;
  setShowProfile: (val: boolean) => void;
}

const Sidebar = ({
  showDashboard,
  setShowDashboard,
  showIncome,
  setShowIncome,
  showExpenses,
  setShowExpenses,
  showProfile,
  setShowProfile,
}: SidebarProps) => {
  return (
    <div className="w-full flex flex-col p-4 items-ceneter">
      <div className="flex flex-row items-center gap-2">
        <div className="bg-[#1D4ED8] h-10 w-10 flex items-center justify-center rounded-xl">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-white">Expense Tracker</h1>
          <p className="text-sm text-white">Manage your finances</p>
        </div>
      </div>

      <div className="relative w-full h-px opacity-25 bg-gray-300 mt-4" />

      <div className="flex flex-col mt-4 gap-2">
        <p className="text-[#F4F4F5] font-medium text-lg">Navigation</p>

        {showDashboard ? (
          <button
            className="flex flex-row items-center gap-2 mt-2 px-2 py-1 bg-[#27272A] rounded-xl"
            onClick={() => {
              setShowDashboard(true);
              setShowExpenses(false);
              setShowProfile(false);
              setShowIncome(false);
            }}
          >
            <LayoutDashboard className="h-4 w-4" color="white" />
            <p className="text-white">Dashboard</p>
          </button>
        ) : (
          <button
            className="flex flex-row items-center gap-2 mt-2 hover:bg-[#27272A] px-2 py-1 rounded-xl"
            onClick={() => {
              setShowDashboard(true);
              setShowExpenses(false);
              setShowProfile(false);
              setShowIncome(false);
            }}
          >
            <LayoutDashboard className="h-4 w-4" color="white" />
            <p className="text-white">Dashboard</p>
          </button>
        )}

        {showIncome ? (
          <button
            className="flex flex-row items-center gap-2 px-2 py-1 bg-[#27272A] rounded-xl"
            onClick={() => {
              setShowDashboard(false);
              setShowExpenses(false);
              setShowProfile(false);
              setShowIncome(true);
            }}
          >
            <TrendingUp className="h-4 w-4" color="white" />
            <p className="text-white">Income</p>
          </button>
        ) : (
          <button
            className="flex flex-row items-center gap-2 hover:bg-[#27272A] px-2 py-1 rounded-xl"
            onClick={() => {
              setShowDashboard(false);
              setShowExpenses(false);
              setShowProfile(false);
              setShowIncome(true);
            }}
          >
            <TrendingUp className="h-4 w-4" color="white" />
            <p className="text-white">Income</p>
          </button>
        )}

        {showExpenses ? (
          <button
            className="flex flex-row items-center gap-2 px-2 py-1 bg-[#27272A] rounded-xl"
            onClick={() => {
              setShowDashboard(false);
              setShowExpenses(true);
              setShowProfile(false);
              setShowIncome(false);
            }}
          >
            <TrendingDown className="h-4 w-4" color="white" />
            <p className="text-white">Expenses</p>
          </button>
        ) : (
          <button
            className="flex flex-row items-center gap-2 hover:bg-[#27272A] px-2 py-1 rounded-xl"
            onClick={() => {
              setShowDashboard(false);
              setShowExpenses(true);
              setShowProfile(false);
              setShowIncome(false);
            }}
          >
            <TrendingDown className="h-4 w-4" color="white" />
            <p className="text-white">Expenses</p>
          </button>
        )}

        {showProfile ? (
          <button
            className="flex flex-row items-center gap-2 px-2 py-1 bg-[#27272A] rounded-xl"
            onClick={() => {
              setShowDashboard(false);
              setShowExpenses(false);
              setShowProfile(true);
              setShowIncome(false);
            }}
          >
            <User className="h-4 w-4" color="white" />
            <p className="text-white">Profile</p>
          </button>
        ) : (
          <button
            className="flex flex-row items-center gap-2 hover:bg-[#27272A] px-2 py-1 rounded-xl"
            onClick={() => {
              setShowDashboard(false);
              setShowExpenses(false);
              setShowProfile(true);
              setShowIncome(false);
            }}
          >
            <User className="h-4 w-4" color="white" />
            <p className="text-white">Profile</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
