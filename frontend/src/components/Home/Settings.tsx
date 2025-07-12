import { PanelLeft } from "lucide-react";
import AccountSettings from "./SettingsComponents/AccountSettings";
import Appearance from "./SettingsComponents/Appearance";
import AppPreferences from "./SettingsComponents/AppPreferences";
interface ExpenseProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const Settings = ({ toggleSideBar, setToggleSideBar }: ExpenseProps) => {
  return (
    <div className="flex flex-col items-center justify-start w-full bg-white h-screen rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="cursor-pointer"
        >
          <PanelLeft />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="relative w-full h-px opacity-75 bg-gray-400 mt-1" />

      <div className="flex flex-row justify-between w-full p-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-base text-[#71717A]">
            Manage your account preferences and app settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-3 w-full p-6">
        <div className="flex flex-row items-center gap-8 row-span-2 col-span-2">
          <AccountSettings />
          <Appearance />
        </div>
        <div className="row-span-1">
          <AppPreferences />
        </div>
      </div>
    </div>
  );
};

export default Settings;
