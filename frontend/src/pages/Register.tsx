import { LayoutDashboard, Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import '../index.css'

const Register = () => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [emailFocus, setEmailFocus] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');
    const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordMatch, setPasswordMatch] = useState<boolean>(false);

    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        setPasswordMatch(password === confirmPassword);
    }, [confirmPassword, password])

    const handleSubmit = async () => {

    }

    return (
        <div className='w-full h-screen flex flex-row'>
            <div className='w-[55%] bg-white flex flex-col items-center justify-center px-40'>
                <div className='flex flex-row items-center gap-2 w-full'>
                    <div className='bg-black h-10 w-10 flex justify-center items-center rounded-xl'>
                        <LayoutDashboard color='white' className='h-6 w-6' />
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-bold'>Expense Tracker</h1>
                        <p className='text-sm'>Manage your finances</p>
                    </div>
                </div>

                <div className='border-0 shadow-lg w-full mt-5 flex flex-col items-center justify-center p-10 rounded-xl'>
                    <form
                        className='flex flex-col items-center justify-center w-full'
                        onSubmit={handleSubmit}
                    >
                        <div className='flex flex-col items-center'>
                            <h1 className='text-2xl font-bold'>Create Account</h1>
                            <p className='text-sm'>Start tracking your expenses and managing your finances</p>
                        </div>

                        <div className='flex flex-row items-center w-4/5 gap-2'>
                            <div className='flex flex-col mt-7 gap-2 w-1/2 relative'>
                                <label className='text-sm' htmlFor='firstName'>First Name</label>
                                <User className='absolute top-[37px] left-3 h-4 w-4' />
                                <input
                                    type='text'
                                    id='firstName'
                                    className='border border-color py-1 pl-10 rounded-lg'
                                />
                            </div>
                            <div className='flex flex-col mt-7 gap-2 w-1/2 relative'>
                                <label className='text-sm' htmlFor='lastName'>Last Name</label>
                                <input
                                    type='text'
                                    id='lastName'
                                    className='border border-color py-1 pl-2 rounded-lg'
                                />
                            </div>
                        </div>

                        <div className='flex flex-col mt-4 w-4/5 gap-2 relative'>
                            <label className='text-sm' htmlFor='email'>Email</label>
                            <Mail className='absolute top-[37px] left-3 h-4 w-4' />
                            <input
                                type='text'
                                id='email'
                                className='border border-color py-1 pl-10 rounded-lg'
                            />
                        </div>

                        <div className='flex flex-col mt-4 w-4/5 gap-2 relative'>
                            <label className='text-sm' htmlFor='password'>Password</label>
                            <Lock className='absolute top-[37px] left-3 h-4 w-4' />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                className='border border-color py-1 pl-10 rounded-lg'
                            />
                            {!showPassword ?
                                <button className='cursor-pointer' onClick={() => setShowPassword(true)}>
                                    <Eye className='absolute top-[37px] right-3 h-4 w-4' />
                                </button>
                                :
                                <button className='cursor-pointer' onClick={() => setShowPassword(false)}>
                                    <EyeOff className='absolute top-[37px] right-3 h-4 w-4' />
                                </button>
                            }
                        </div>

                        <div className='flex flex-col mt-4 w-4/5 gap-2 relative'>
                            <label className='text-sm' htmlFor='confirmPass'>Confirm Password</label>
                            <Lock className='absolute top-[37px] left-3 h-4 w-4' />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='confirmPass'
                                className='border border-color py-1 pl-10 rounded-lg'
                            />
                            {!showPassword ?
                                <button className='cursor-pointer' onClick={() => setShowPassword(true)}>
                                    <Eye className='absolute top-[37px] right-3 h-4 w-4' />
                                </button>
                                :
                                <button className='cursor-pointer' onClick={() => setShowPassword(false)}>
                                    <EyeOff className='absolute top-[37px] right-3 h-4 w-4' />
                                </button>
                            }
                        </div>

                        <div className='w-4/5 mt-2 mb-2 cursor-pointer'>
                            <p className='text-sm text-left'>Forgot Password?</p>
                        </div>

                        <button className='flex flex-row items-center justify-center gap-4 bg-black py-2 rounded-xl w-4/5 cursor-pointer'>
                            <p className='text-white text-sm'>Create Account</p>
                            <ArrowRight color='white' className='h-4 w-4' />
                        </button>
                    </form>

                    <div className="relative w-4/5 h-px bg-gray-300 mt-6">
                        <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-white px-2">
                            OR CONTINUE WITH
                        </p>
                    </div>

                    <div className='w-4/5 flex flex-row mt-6 items-center justify-center gap-8'>
                        <button className='flex flex-row items-center gap-2 border-1 border-color px-6 py-2 rounded-lg cursor-pointer'>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <p className='text-sm'>Google</p>
                        </button>

                        <button className='flex flex-row items-center gap-2 border-1 border-color px-6 py-2 rounded-lg cursor-pointer'>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <p className='text-sm'>Apple</p>
                        </button>
                    </div>

                    <div className='flex flex-row items-center justify-center w-4/5 mt-4'>
                        <p className='text-sm'>Already have an account?
                            <span className='font-medium hover:cursor-pointer hover:underline'> Sign In </span>
                        </p>
                    </div>


                </div>



            </div>

            <div className="w-[45%] custom-gradient-bg flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl icon-background mb-10">
                    <LayoutDashboard className="h-10 w-10 text-primary" />
                </div>

                <div className='flex flex-col items-center max-w-md gap-2'>
                    <h1 className='text-3xl font-bold'>Take Control of Your Finances</h1>
                    <p className='text-center text-base'>
                        Track expenses, manage income, and achieve your financial goals with our intuitive expense tracker.
                    </p>
                </div>

                <div className='grid grid-cols-1 gap-4 mt-10 min-w-md'>
                    <div className='flex flex-row items-center gap-4'>
                        <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                        <p className='text-sm'>Real-time expense tracking</p>
                    </div>
                    <div className='flex flex-row items-center gap-4'>
                        <div className='h-2 w-2 bg-blue-500 rounded-full'></div>
                        <p className='text-sm'>Budget management</p>
                    </div>
                    <div className='flex flex-row items-center gap-4'>
                        <div className='h-2 w-2 bg-red-500 rounded-full'></div>
                        <p className='text-sm'>Financial insights</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register