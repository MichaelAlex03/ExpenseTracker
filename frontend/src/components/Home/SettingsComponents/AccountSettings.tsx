import { User } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AccountSettings {
  user: User;
}

const AccountSettings = () => {
  return (
    <div className="flex flex-row justify-center border-0 shadow-lg w-full rounded-xl p-6 min-h-102">
      <div className="w-full flex flex-row items-center gap-4">
        <User />
        <h1 className="text-2xl text-[#09090B] font-semibold">
          Account Settings
        </h1>
      </div>
    </div>
  );
};

export default AccountSettings;
