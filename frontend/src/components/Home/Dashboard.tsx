import {
  PanelLeft
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white h-full rounded-xl p-4">
      <div className="w-full flex flex-row items-center gap-4">
        <PanelLeft />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
