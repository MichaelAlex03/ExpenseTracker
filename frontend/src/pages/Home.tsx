import Budgets from "@/components/Home/Budgets";
import Dashboard from "@/components/Home/Dashboard";
import Expenses from "@/components/Home/Expenses";
import Income from "@/components/Home/Income";
import Profile from "@/components/Home/Profile";
import Sidebar from "@/components/Home/Sidebar";
import { useState } from "react";

const Home = () => {
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [showIncome, setShowIncome] = useState<boolean>(false);
  const [showExpenses, setShowExpenses] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showBudgets, setShowBudgets] = useState<boolean>(false);

  const [toggleSideBar, setToggleSideBar] = useState<boolean>(true);

  return (
    <main className="w-full h-screen bg-[#09090B] flex flex-row">
      <div className={`sidebar-transition ${toggleSideBar ? "w-100" : "w-0"}`}>
        <Sidebar
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
          showIncome={showIncome}
          setShowIncome={setShowIncome}
          showExpenses={showExpenses}
          setShowExpenses={setShowExpenses}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          showBudgets={showBudgets}
          setShowBudgets={setShowBudgets}
        />
      </div>

      <div className="w-full p-3 overflow-y-auto">
        {showDashboard && (
          <Dashboard
            toggleSideBar={toggleSideBar}
            setToggleSideBar={setToggleSideBar}
          />
        )}
        {showIncome && (
          <Income
            toggleSideBar={toggleSideBar}
            setToggleSideBar={setToggleSideBar}
          />
        )}
        {showExpenses && (
          <Expenses
            toggleSideBar={toggleSideBar}
            setToggleSideBar={setToggleSideBar}
          />
        )}
        {showProfile && (
          <Profile
            toggleSideBar={toggleSideBar}
            setToggleSideBar={setToggleSideBar}
          />
        )}
        {
          showBudgets && (
            <Budgets
              toggleSideBar={toggleSideBar}
              setToggleSideBar={setToggleSideBar}
            />
          )
        }
      </div>
    </main>
  );
};

export default Home;
