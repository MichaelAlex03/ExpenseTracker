import Dashboard from "@/components/Home/Dashboard";
import Expenses from "@/components/Home/Expenses";
import Income from "@/components/Home/Income";
import Settings from "@/components/Home/Settings";
import Sidebar from "@/components/Home/Sidebar";
import { useState } from "react";

const Home = () => {
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [showIncome, setShowIncome] = useState<boolean>(false);
  const [showExpenses, setShowExpenses] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

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
          showSettings={showSettings}
          setShowSettings={setShowSettings}
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
        {showSettings && (
          <Settings
            toggleSideBar={toggleSideBar}
            setToggleSideBar={setToggleSideBar}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
