import { User } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AccountSettings {
  setToggleProfileScreen: (val: boolean) => void;
  setToggleSettingsScreen: (val: boolean) => void;
}

const AccountSettings = ({
  setToggleProfileScreen,
  setToggleSettingsScreen,
}: AccountSettings) => {

  const handleEditProfile = () => {
   setToggleProfileScreen(true);
   setToggleSettingsScreen(false);
  }

  

  return (
    <div className="flex flex-col justify-start items-start border-1 border-gray-300 shadow-lg w-full rounded-xl p-6 min-h-80 gap-12">
      <div className="w-full flex flex-row items-center gap-4">
        <User />
        <h1 className="text-2xl text-[#09090B] font-semibold">
          Account Settings
        </h1>
      </div>
      <div>
        <h1>Name</h1>
      </div>
      <div>
        <h1>Email</h1>
      </div>
      <button className="border-1 border-gray-300 shadow-lg rounded-lg px-2 py-1 cursor-pointer" onClick={handleEditProfile}>
        <p className="font-semibold">Edit Profile</p>
      </button>
    </div>
  );
};

export default AccountSettings;
