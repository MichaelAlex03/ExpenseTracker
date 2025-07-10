import Dashboard from '@/components/Home/Dashboard';
import Sidebar from '@/components/Home/Sidebar';
import { useState } from 'react'

const Home = () => {

  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [showIncome, setShowIncome] = useState<boolean>(false);
  const [showExpenses, setShowExpenses] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [toggleSideBar, setToggleSideBar] = useState<boolean>(true)

  return (
    <main className='w-full h-screen bg-[#09090B] flex flex-row'>

      <div
        className={`sidebar-transition ${toggleSideBar ? 'w-80' : 'w-0'}`}
      >
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

      <div className='w-full p-3'>
        <Dashboard toggleSideBar={toggleSideBar} setToggleSideBar={setToggleSideBar}/>
      </div>

    </main>
  )
}

export default Home