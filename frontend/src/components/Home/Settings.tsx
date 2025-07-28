import { PanelLeft } from "lucide-react";
import AccountSettings from "./Settings/AccountSettings";
import Appearance from "./Settings/Appearance";
import AppPreferences from "./Settings/AppPreferences";
import { useState } from "react";
import Profile from "./Settings/Profile/Profile";

interface FormDataTypes{
    firstName: string;
    lastName: string;
    email: string;
    phoneNum: string;
    DOB: Date;
    occupation: string;
    location: string;
    password: string;
    newPassword: string;
    newPassMatch: string;
    profileImage: string;
}
interface ExpenseProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const Settings = ({ toggleSideBar, setToggleSideBar }: ExpenseProps) => {
  const [toggleSettingsScreen, setToggleSettingsScreen] =
    useState<boolean>(true);
  const [toggleProfileScreen, setToggleProfileScreen] =
    useState<boolean>(false);
  const [toggleAppearanceScreen, setToggleAppearanceScreen] =
    useState<boolean>(false);

  const [formData, setFormData] = useState<FormDataTypes>();

  const fetchProfile = async () => {
    
  }

  

  const handleReturnToSettings = () => {
    setToggleProfileScreen(false);
    setToggleAppearanceScreen(false);
    setToggleSettingsScreen(true);
  };

  return (
    <div
      className={`${
        toggleProfileScreen ? "h-fit" : "h-screen"
      } flex flex-col items-center justify-start w-full bg-white rounded-xl`}
    >
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

      {toggleSettingsScreen && (
        <div className="w-full flex flex-col">
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
              <AccountSettings
                setToggleProfileScreen={setToggleProfileScreen}
                setToggleSettingsScreen={setToggleSettingsScreen}
              />
              <Appearance />
            </div>
          </div>
        </div>
      )}

      {toggleProfileScreen && (
        <Profile handleReturnToSettings={handleReturnToSettings} />
      )}
    </div>
  );
};

export default Settings;
