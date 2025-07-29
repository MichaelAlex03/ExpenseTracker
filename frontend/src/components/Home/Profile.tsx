import { User, XIcon, SaveIcon, PanelLeft } from "lucide-react";
import ProfileOverview from "./Profile/ProfileOverview";
import PersonalInfo from "./Profile/PersonalInfo";
import { useEffect, useState } from "react";
import Security from "./Profile/Security";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

interface FormDataTypes {
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
  [key: string]: string | Date; //Index signature allowing iteration safely. Saying all keys are strings and values are string or Date
}

interface ProfileProps {
  toggleSideBar: boolean;
  setToggleSideBar: (val: boolean) => void;
}

const USER_API_URL = "/api/user";

const Profile = ({ toggleSideBar, setToggleSideBar }: ProfileProps) => {
  const [toggleEditProfile, setToggleEditProfile] = useState<boolean>(false);

  const [serverFormData, setServerFormData] = useState<FormDataTypes>({
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

  const [localFormData, setLocalFormData] = useState<FormDataTypes>({
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

  const { auth, setAuth } = useAuth();

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // User entity in Spring had additional fields not needed for client
  const updateSharedFields = (target: FormDataTypes, source: Record<string, any>) => {
    const keys = Object.keys(target);
    for (const key of keys){
      if (key in source){
        target[key] = source[key];
      }
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user?email=michaelalex03@outlook.com"
      );
      console.log("RES", response);
      updateSharedFields(localFormData, response.data);
      return response
    } catch (error) {
      console.error(error);
      console.log("ERRRRRR");
    }

  };

  const { data, isLoading } = useQuery({
    queryKey: [auth?.email],
    queryFn: fetchProfile,
    staleTime: Infinity,
  });

  const handleChangeProfilePicture = async () => {};

  console.log(data)
  console.log(localFormData);

  return (
    <div className="w-full flex flex-col items-center justify-start h-auto bg-white rounded-xl">
      <div className="w-full flex flex-row items-center gap-4 p-6">
        <button
          onClick={() => setToggleSideBar(!toggleSideBar)}
          className="cursor-pointer"
        >
          <PanelLeft />
        </button>
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <div className="relative w-full h-px opacity-75 bg-gray-400 mt-1" />
      
      <div className="flex flex-row items-center justify-between w-full p-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-[#71717A]">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="p-6">
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

      <div className="grid grid-cols-3 grid-rows-2 gap-10 w-full p-6">
        <div className="col-span-1">
          <ProfileOverview
            handleFormChange={handleFormDataChange}
            formData={localFormData}
          />
        </div>
        <div className="col-span-2 row-span-2">
          <PersonalInfo
            handleFormChange={handleFormDataChange}
            formData={localFormData}
          />
          <Security
            handleFormChange={handleFormDataChange}
            formData={localFormData}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
