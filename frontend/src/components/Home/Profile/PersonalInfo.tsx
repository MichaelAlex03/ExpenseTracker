const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
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
    profileImage: File | string | null;
}

import React from "react";

interface PersonalInfoProps {
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  formData: FormDataTypes;
  isEditable: boolean;
}

const PersonalInfo = ({ handleFormChange, formData, isEditable }: PersonalInfoProps) => {
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
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleFormChange}
            disabled={!isEditable}
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
            placeholder="Last Name"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.lastName}
            onChange={handleFormChange}
            disabled={!isEditable}
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
              placeholder="Email"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
              value={formData.email}
              onChange={handleFormChange}
              disabled={true}
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
            placeholder="Phone Number"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.phoneNum}
            onChange={handleFormChange}
            disabled={!isEditable}
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
            disabled={!isEditable}
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
            placeholder="Occupation"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.occupation}
            onChange={handleFormChange}
            disabled={!isEditable}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label className="text-base font-semibold" htmlFor="location">
            Location
          </label>
          <select
            id="location"
            name="location"
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            value={formData.location}
            onChange={handleFormChange}
            disabled={!isEditable}
          >
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
