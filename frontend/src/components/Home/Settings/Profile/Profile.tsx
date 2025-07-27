import { ArrowLeft, User } from "lucide-react";
import ProfileOverview from "./ProfileOverview";
import { useQuery } from "@tanstack/react-query";
import PersonalInfo from "./PersonalInfo";
import { useState } from "react";
import Security from "./Security";

interface ProfileProps {
  handleReturnToSettings: () => void;
}

const USER_API_URL = "/api/user";

const Profile = ({ handleReturnToSettings }: ProfileProps) => {

  const [toggleEditProfile, setToggleEditProfile] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [DOB, setDOB] = useState<Date>(new Date());
  const [occupation, setOccupation] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPassMatch, setNewPassMatch] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const fetchProfile = async () => {
    try {
    } catch (error) {}
  };

  return (
    <div className="w-full flex flex-col p-6 h-auto">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-4">
          <button
            className="border-1 border-gray-300 shadow-lg rounded-lg px-2 py-1 cursor-pointer"
            onClick={handleReturnToSettings}
          >
            <ArrowLeft size={24} />
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
            <User color="white" className="h-4 w-4" />
            <p className="text-white font-semibold">Edit Profile</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 mt-10 gap-10">
        <div className="col-span-1">
          <ProfileOverview />
        </div>
        <div className="col-span-2 row-span-2">
          <PersonalInfo />
          <Security />
        </div>
      </div>
    </div>
  );
};

export default Profile;
