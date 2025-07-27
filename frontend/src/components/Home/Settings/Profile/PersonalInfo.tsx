interface PersonalInfoProps{
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: Date
  occupation: string
  location: string
}

const PersonalInfo = () => {
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
            type={"text"}
            id="firstName"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="lastName">
            Last Name
          </label>
          <input
            type={"text"}
            id="lastName"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
          />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col items-start gap-2">
            <label className="text-base font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type={"text"}
              id="email"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 ">
          <label className="text-base font-semibold" htmlFor="phoneNum">
            Phone Number
          </label>
          <input
            type={"text"}
            id="phoneNum"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <input
            type={"date"}
            id="dateOfBirth"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-2 ">
          <label className="text-base font-semibold" htmlFor="occupation">
            Occupation
          </label>
          <input
            type={"text"}
            id="occupation"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="location">
            Location
          </label>
          <input
            type={"text"}
            id="location"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
