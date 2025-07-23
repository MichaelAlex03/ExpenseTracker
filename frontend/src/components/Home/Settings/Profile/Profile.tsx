import { ArrowLeft, User } from "lucide-react";
import ProfileOverview from "./ProfileOverview";

interface ProfileProps {
  handleReturnToSettings: () => void;
}

const Profile = ({ handleReturnToSettings }: ProfileProps) => {
  return (
    <div className="w-full flex flex-col p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4">
          <button
            className="border-1 border-gray-300 shadow-lg rounded-lg px-2 py-1 cursor-pointer"
            onClick={handleReturnToSettings}
          >
            <ArrowLeft size={24}/>
          </button>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-[#71717A]">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        <div>
          <button className="bg-black flex flex-row items-center gap-2 shadow-lg rounded-lg p-3 cursor-pointer">
            <User color="white" className="h-4 w-4"/>
            <p className="text-white font-semibold">Edit Profile</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <ProfileOverview />
        </div>
        <div className="col-span-2">

        </div>
      </div>
    </div>
  );
};

export default Profile;
