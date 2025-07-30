import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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

interface SecurityProps {
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormDataTypes;
  isEditable: boolean;
}

const Security = ({ handleFormChange, formData, isEditable }: SecurityProps) => {
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col w-full border-1 border-gray-300 shadow-lg h-fit rounded-2xl p-6 mt-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Security</h1>
        <p className="text-[#71717A] text-base">
          Update your password and security preferences
        </p>
      </div>

      <div className="flex flex-col w-full mt-12">
        <div className="flex flex-col items-start gap-2 relative">
          <label className="text-base font-semibold" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="password"
            placeholder="Current Password"
            value={formData.password}
            onChange={handleFormChange}
            className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            disabled={!isEditable}
          />
          {!showCurrentPassword ? (
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowCurrentPassword(true)}
            >
              <Eye className="absolute top-11 right-3 h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowCurrentPassword(false)}
            >
              <EyeOff className="absolute top-11 right-3 h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-row items-center w-full gap-8">
          <div className="flex flex-col items-start gap-2 relative w-full">
            <label className="text-base font-semibold" htmlFor="newPassword">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleFormChange}
              placeholder="New Password"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
              disabled={!isEditable}
            />
            {!showNewPassword ? (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setShowNewPassword(true)}
              >
                <Eye className="absolute top-11 right-3 h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setShowNewPassword(false)}
              >
                <EyeOff className="absolute top-11 right-3 h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-col items-start gap-2 relative w-full">
            <label className="text-base font-semibold" htmlFor="newPassMatch">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="newPassMatch"
              name="newPassMatch"
              value={formData.newPassMatch}
              onChange={handleFormChange}
              placeholder="Confirm Password"
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
              disabled={!isEditable}
            />
            {!showConfirmPassword ? (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setShowConfirmPassword(true)}
              >
                <Eye className="absolute top-11 right-3 h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              >
                <EyeOff className="absolute top-11 right-3 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
