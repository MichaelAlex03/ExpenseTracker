import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils'
import { AlertCircle, Check, X } from 'lucide-react'

interface PasswordRequirementsProps {
    password: string,
}

const passwordRules = {
    length: /^.{8,24}$/,
    specialCharacter: /[!@#$%]/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
};

const PasswordRequirments = ({ password }: PasswordRequirementsProps) => {

    const [validLength, setValidLength] = useState<boolean>(false);
    const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);
    const [hasLowercase, setHasLowercase] = useState<boolean>(false);
    const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
    const [hasDigit, setHasDigit] = useState<boolean>(false);


    // Update password requirements every time password changes
    useEffect(() => {
        setValidLength(passwordRules.length.test(password));
        setHasSpecialChar(passwordRules.specialCharacter.test(password));
        setHasLowercase(passwordRules.lowercase.test(password));
        setHasUpperCase(passwordRules.uppercase.test(password));
        setHasDigit(passwordRules.number.test(password))
    }, [password])


    return (
        <div className="absolute z-50 w-full p-2 mt-1 bg-white border-0 rounded-lg shadow-xl top-17">
            <div className="flex flex-row items-center gap-2">
                <AlertCircle className='w-4 h-4' />
                <p className='text-sm'>Password Requirements</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">

                <div className='flex flex-row gap-4 items-center'>
                    {!password ?
                        <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className='h-2 w-2 bg-gray-400 rounded-full' />
                        </div>
                        : !validLength
                            ? <X className='h-4 w-4' color='red' />
                            : <Check className='h-4 w-4' color='green' />
                    }
                    < p className='text-xs'>8-24 characters</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    {!password ?
                        <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className='h-2 w-2 bg-gray-400 rounded-full' />
                        </div>
                        : !hasSpecialChar
                            ? <X className='h-4 w-4' color='red' />
                            : <Check className='h-4 w-4' color='green' />

                    }
                    <p className='text-xs'>One special character</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    {!password ?
                        <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className='h-2 w-2 bg-gray-400 rounded-full' />
                        </div>
                        : !hasLowercase
                            ? <X className='h-4 w-4' color='red' />
                            : <Check className='h-4 w-4' color='green' />
                    }
                    <p className='text-xs'>One lowercase character</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    {!password ?
                        <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className='h-2 w-2 bg-gray-400 rounded-full' />
                        </div>
                        : !hasUpperCase
                            ? <X className='h-4 w-4' color='red' />
                            : <Check className='h-4 w-4' color='green' />
                    }
                    <p className='text-xs'>One uppercase character</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    {!password ?
                        <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className='h-2 w-2 bg-gray-400 rounded-full' />
                        </div>
                        : !hasDigit
                            ? <X className='h-4 w-4' color='red' />
                            : <Check className='h-4 w-4' color='green' />
                    }
                    <p className='text-xs'>One number</p>
                </div>

            </div>
        </div >
    )
}

export default PasswordRequirments