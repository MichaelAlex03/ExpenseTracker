import { User, PlusIcon, Phone, Mail, MapPin } from "lucide-react";

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
}
interface ProfileOverviewProps {
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataTypes;
}

const ProfileOverview = ({
  handleFormChange,
  formData,
}: ProfileOverviewProps) => {
  const handleImagePicker = () => {
    document.getElementById("imageSelector")?.click();
  };

  return (
    <div className="flex flex-col items-center w-full border-1 border-gray-300 shadow-lg min-h-112 rounded-2xl p-6">
      <div className="flex flex-col items-start w-full">
        <h1 className="text-2xl font-semibold">Profile Overview</h1>
        <p className="text-[#71717A] text-base">
          Your profile information and status
        </p>
      </div>

      <div className="mt-10">
        <button
          className="relative cursor-pointer w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-600 transition-colors duration-200"
          onClick={handleImagePicker}
        >
          <User size={40} />
          <div className="absolute top-0 right-0 bg-secondary p-1 rounded-full border-4 border-white bg-gray-400">
            <PlusIcon size={24} color="black" />
          </div>
        </button>
        <input type="file" className="hidden" id="imageSelector" />

        <div className="flex flex-col items-center mt-2">
          <p className="text-lg font-semibold">
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-base text-[#71717A]">{formData.occupation}</p>
        </div>
      </div>

      <div className="h-0.5 w-full bg-[#e4e4e7] mt-4" />

      <div className="w-full flex flex-col items-start gap-6 mt-4">
        <div className="flex flex-row gap-4 items-center">
          <Mail className="h-5 w-5" />
          {formData.email}
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Phone className="h-5 w-5" />
          {formData.phoneNum}
        </div>
        <div className="flex flex-row gap-4 items-center">
          <MapPin className="h-5 w-5" />
          {formData.location}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
