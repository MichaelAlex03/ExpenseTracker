import { LayoutDashboard, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

const Login = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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

        <div className='border-0 shadow-lg w-full mt-5 flex flex-col items-center justify-center p-12 rounded-xl'>
          <form
            className='flex flex-col items-center justify-center w-full'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col items-center'>
              <h1 className='text-2xl font-bold'>Welcome Back</h1>
              <p className='text-sm'>Enter your credentials to access your account</p>
            </div>

            <div className='flex flex-col mt-7 w-3/4 gap-2 relative'>
              <label className='text-sm' htmlFor='email'>Email</label>
              <Mail className='absolute top-[37px] left-3 h-4 w-4' />
              <input
                type='text'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border border-color py-1 pl-10 rounded-lg text-sm'
              />
            </div>

            <div className='flex flex-col mt-5 w-3/4 gap-2 relative'>
              <label className='text-sm' htmlFor='email'>Password</label>
              <Lock className='absolute top-[37px] left-3 h-4 w-4' />
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border border-color py-1 pl-10 rounded-lg text-sm'
              />
              {!showPassword ?
                <button type='button' className='cursor-pointer' onClick={() => setShowPassword(true)}>
                  <Eye className='absolute top-[37px] right-3 h-4 w-4' />
                </button>
                :
                <button type='button' className='cursor-pointer' onClick={() => setShowPassword(false)}>
                  <EyeOff className='absolute top-[37px] right-3 h-4 w-4' />
                </button>
              }
            </div>

            <div className='w-3/4 mt-2 mb-4 cursor-pointer'>
              <p className='text-sm text-left'>Forgot Password?</p>
            </div>

            <button className='flex flex-row items-center justify-center gap-4 bg-black py-2 rounded-xl w-3/4 cursor-pointer'>
              <p className='text-white text-sm'>Sign In</p>
              <ArrowRight color='white' className='h-4 w-4' />
            </button>
          </form>

          <div className="relative w-3/4 h-px bg-gray-300 mt-6">
            <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-white px-2">
              OR CONTINUE WITH
            </p>
          </div>

          <div className='w-3/4 flex flex-row mt-6 items-center justify-between'>
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
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M16.68 1.94c0 1.14-.93 2.06-2.07 2.06-.02-1.18.95-2.06 2.07-2.06zm2.18 4.36c-1.14-.13-2.1.65-2.65.65-.56 0-1.41-.63-2.33-.61-1.2.02-2.3.7-2.91 1.77-1.24 2.15-.32 5.33.89 7.08.59.86 1.29 1.82 2.21 1.79.88-.04 1.21-.57 2.27-.57 1.06 0 1.36.57 2.28.55.94-.02 1.53-.88 2.11-1.74.67-.98.95-1.93.96-1.98-.02-.01-1.85-.71-1.87-2.81-.02-1.76 1.44-2.6 1.51-2.64-.83-1.22-2.12-1.36-2.57-1.39zm-2.06-3.7c.38-.46.64-1.1.57-1.74-.55.02-1.22.37-1.62.83-.36.41-.68 1.07-.56 1.7.6.05 1.22-.31 1.61-.79z"
                  fill="black"
                />
              </svg>
              <p className='text-sm'>Apple</p>
            </button>
          </div>

          <div className='flex flex-row items-center justify-center w-3/4 mt-4'>
            <p className='text-sm'>Dont have an account?
              <span onClick={() => navigate('/register')} className='font-medium hover:cursor-pointer hover:underline'> Sign up </span>
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

export default Login