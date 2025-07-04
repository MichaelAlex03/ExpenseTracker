import { cn } from '../../lib/utils'
import { AlertCircle } from 'lucide-react'

interface PasswordRequirementsProps {
    password: string
}

const PasswordRequirments = ({ password }: PasswordRequirementsProps) => {
    return (
        <div
            className={cn(
                "absolute z-50 w-full p-2 mt-1 bg-white border border-border rounded-lg shadow-lg top-17",
                "animate-fade-in",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <AlertCircle className='w-4 h-4' />
                <p className='text-sm'>Password Requirements</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">

                <div className='flex flex-row gap-4 items-center'>
                    <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className='h-2 w-2 bg-gray-400 rounded-full' />
                    </div>
                    <p className='text-xs'>At least 8 characters</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className='h-2 w-2 bg-gray-400 rounded-full' />
                    </div>
                    <p className='text-xs'>One special character</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className='h-2 w-2 bg-gray-400 rounded-full' />
                    </div>
                    <p className='text-xs'>One lowercase character</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className='h-2 w-2 bg-gray-400 rounded-full' />
                    </div>
                    <p className='text-xs'>One uppercase character</p>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className='h-2 w-2 bg-gray-400 rounded-full' />
                    </div>
                    <p className='text-xs'>One number</p>
                </div>

            </div>
        </div>
    )
}

export default PasswordRequirments