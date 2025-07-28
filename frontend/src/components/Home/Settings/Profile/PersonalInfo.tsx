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

interface PersonalInfoProps {
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataTypes 
}

const PersonalInfo = ({ handleFormChange, formData }: PersonalInfoProps) => {
  return (
    <div className="flex flex-col w-full border-1 border-gray-300 shadow-lg min-h-112 rounded-2xl p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Personal Information</h1>
        <p className="text-[#71717A] text-base">
          Update your personal details and contact information
        </p>
      </div>

      <div className="grid grid-cols-2 grid-rows-4 mt-4 gap-4">
        <div className="flex flex-col items-start gap-2 ">
          <label className="text-base font-semibold" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.firstName}
            onChange={handleFormChange}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.lastName}
            onChange={handleFormChange}
          />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col items-start gap-2">
            <label className="text-base font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
              value={formData.email}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 ">
          <label className="text-base font-semibold" htmlFor="phoneNum">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNum"
            name="phoneNum"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.phoneNum}
            onChange={handleFormChange}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="DOB">
            Date of Birth
          </label>
          <input
            type="date"
            id="DOB"
            name="DOB"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.DOB instanceof Date ? formData.DOB.toISOString().split("T")[0] : formData.DOB}
            onChange={handleFormChange}
          />
        </div>
        <div className="flex flex-col items-start gap-2 ">
          <label className="text-base font-semibold" htmlFor="occupation">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.occupation}
            onChange={handleFormChange}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.location}
            onChange={handleFormChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
