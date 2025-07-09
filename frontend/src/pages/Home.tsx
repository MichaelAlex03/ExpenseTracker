import Dashboard from '@/components/Home/Dashboard';
import Sidebar from '@/components/Home/Sidebar';
import { useState } from 'react'

const Home = () => {

  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [showIncome, setShowIncome] = useState<boolean>(false);
  const [showExpenses, setShowExpenses] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
    <main className='w-full h-screen bg-[#09090B] flex flex-row'>

      <div className='min-w-80 max-w-80'>
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
        <Dashboard />
      </div>

    </main>
  )
}

export default Home