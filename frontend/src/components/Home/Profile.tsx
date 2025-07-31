import { User, XIcon, SaveIcon, PanelLeft } from "lucide-react";
import ProfileOverview from "./Profile/ProfileOverview";
import PersonalInfo from "./Profile/PersonalInfo";
import { useEffect, useState } from "react";
import Security from "./Profile/Security";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const [toggleEditProfile, setToggleEditProfile] = useState<boolean>(false);
  const [serverAndLocalDiff, setServerAndLocalDiff] = useState<boolean>(false);
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
    profileImageKey: "",
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
    profileImageKey: "",
  });

  const { auth, setAuth } = useAuth();

  const handleFormDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: name === "DOB" ? new Date(value) : value,
    }));
  };

  // User entity in Spring had additional fields not needed for client
  const updateSharedFields = (
    target: FormDataTypes,
    source: Record<string, any>
  ) => {
    const keys = Object.keys(target);
    for (const key of keys) {
      if (key in source && source[key] !== null && source[key] !== undefined) {
        target[key] = source[key];
      }
    }

    return target;
  };

  const areDatesEqual = (date1: Date, date2: Date) => {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth() + 1;
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth() + 1;
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  };

  const checkIfObjectsAreEqual = (
    localData: FormDataTypes,
    serverData: FormDataTypes
  ) => {
    const keys = Object.keys(localData);
    for (const key of keys) {
      if (key === "DOB") {
        if (!areDatesEqual(localData[key], serverData[key])) {
          return true;
        }
      } else if (localData[key] !== serverData[key]) {
        return true;
      }
    }
    return false;
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user?email=michaelalex03@outlook.com"
      );
      
      const data = {...serverFormData}
      const fetchedProfile = updateSharedFields(data, response.data);

      setServerFormData(fetchedProfile);
      setLocalFormData(fetchedProfile);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const body = {
        firstName: localFormData.firstName,
        lastName: localFormData.lastName,
        userEmail: localFormData.email,
        newPassword: null,
        phoneNumber: localFormData.phoneNum,
        dateOfBirth: null,
        occupation: localFormData.occupation,
        location: localFormData.location,
      };

      const response = await axios.patch(
        "http://localhost:3000/api/user",
        body
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["profile", auth?.email],
    queryFn: fetchProfile,
    staleTime: Infinity,
  });

  const updateProfileMutation = useMutation({
    mutationFn: handleUpdateProfile,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["profile", auth?.email], { data: updatedData });
      const mappedData: FormDataTypes = {
        firstName: updatedData?.firstName || "",
        lastName: updatedData?.lastName || "",
        email: updatedData?.email || "",
        phoneNum: updatedData?.phoneNum || "",
        DOB: updatedData?.DOB ? new Date(updatedData.DOB) : new Date(),
        occupation: updatedData?.occupation || "",
        location: updatedData?.location || "",
        password: "",
        newPassword: "",
        newPassMatch: "",
        profileImage: updatedData?.profileImage || "",
        profileImageKey: updatedData?.profileImageKey || "",
      };
      setServerFormData(mappedData);
      setLocalFormData(mappedData);
      setToggleEditProfile(!toggleEditProfile);
    },
  });

  useEffect(() => {
    if (data?.data) {
      const mappedData: FormDataTypes = {
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
        phoneNum: data.data.phoneNum || "",
        DOB: data.data.DOB ? new Date(data.data.DOB) : new Date(),
        occupation: data.data.occupation || "",
        location: data.data.location || "",
        password: "",
        newPassword: "",
        newPassMatch: "",
        profileImage: data.data.profileImage || "",
        profileImageKey: data.data.profileImageKey || "",
      };
      setServerFormData(mappedData);
      setLocalFormData(mappedData);
    }
  }, [data]);

  useEffect(() => {
    setServerAndLocalDiff(
      checkIfObjectsAreEqual(localFormData, serverFormData)
    );
  }, [serverFormData, localFormData]);

  console.log("Local", localFormData);
  console.log("Server", serverFormData);

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
                onClick={() => {
                  setToggleEditProfile(false);
                  setLocalFormData(serverFormData);
                }}
              >
                <XIcon color="black" className="h-4 w-4" />
                <p className="text-black font-semibold">Cancel</p>
              </button>
              <button
                className={`bg-black flex flex-row items-center gap-3 shadow-lg rounded-lg p-3 cursor-pointer ${
                  serverAndLocalDiff ? "opacity-100" : "opacity-20"
                }`}
                onClick={() => updateProfileMutation.mutate()}
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
          <ProfileOverview formData={serverFormData} />
        </div>
        <div className="col-span-2 row-span-2">
          <PersonalInfo
            handleFormChange={handleFormDataChange}
            formData={localFormData}
            isEditable={toggleEditProfile}
          />
          <Security
            handleFormChange={handleFormDataChange}
            formData={localFormData}
            isEditable={toggleEditProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
