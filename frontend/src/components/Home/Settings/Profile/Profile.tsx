import { ArrowLeft, User, XIcon, SaveIcon } from "lucide-react";
import ProfileOverview from "./ProfileOverview";
import { useQuery } from "@tanstack/react-query";
import PersonalInfo from "./PersonalInfo";
import { useEffect, useState } from "react";
import Security from "./Security";
import axios from "axios";

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

interface ProfileProps {
  handleReturnToSettings: () => void;
}

const USER_API_URL = "/api/user";

const Profile = ({ handleReturnToSettings }: ProfileProps) => {
  const [toggleEditProfile, setToggleEditProfile] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNum: "",
    DOB: new Date(),
    occupation: "",
    location: "",
    password: "",
    newPassword: "",
    newPassMatch: "",
    profileImage: "",
  });

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleChangeProfilePicture = async () => {};

  useEffect(() => {}, []);

  console.log(formData)

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
          {toggleEditProfile ? (
            <div className="flex flex-row gap-4">
              <button
                className="bg-white border-1 border-gray-300 flex flex-row items-center gap-3 shadow-lg rounded-lg p-3 cursor-pointer"
                onClick={() => setToggleEditProfile(!toggleEditProfile)}
              >
                <XIcon color="black" className="h-4 w-4" />
                <p className="text-black font-semibold">Cancel</p>
              </button>
              <button
                className="bg-black flex flex-row items-center gap-3 shadow-lg rounded-lg p-3 cursor-pointer"
                onClick={() => setToggleEditProfile(!toggleEditProfile)}
              >
                <SaveIcon color="white" className="h-4 w-4" />
                <p className="text-white font-semibold">Save Profile</p>
              </button>
            </div>
          ) : (
            <button
              className="bg-black flex flex-row items-center gap-2 shadow-lg rounded-lg p-3 cursor-pointer"
              onClick={() => setToggleEditProfile(!toggleEditProfile)}
            >
              <User color="white" className="h-4 w-4" />
              <p className="text-white font-semibold">Edit Profile</p>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 mt-10 gap-10">
        <div className="col-span-1">
          <ProfileOverview
            handleFormChange={handleFormDataChange}
            formData={formData}
          />
        </div>
        <div className="col-span-2 row-span-2">
          <PersonalInfo
            handleFormChange={handleFormDataChange}
            formData={formData}
          />
          <Security
            handleFormChange={handleFormDataChange}
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
