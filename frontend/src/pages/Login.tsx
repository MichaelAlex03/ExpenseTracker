import { LayoutDashboard, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import '../index.css'

const Login = () => {

  const [showPassword, setShowPassword] = useState(false)

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

        <form
          className='border-0 shadow-lg w-full mt-5 flex flex-col items-center justify-center p-12 rounded-xl'
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col items-center'>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
            <p className='text-sm'>Enter your credentials to access your account</p>
          </div>

          <div className='flex flex-col mt-10 w-3/4 gap-2 relative'>
            <label className='text-sm' htmlFor='email'>Email</label>
            <Mail className='absolute top-[37px] left-3 h-4 w-4' />
            <input
              type='text'
              id='email'
              className='border border-color py-1 pl-10 rounded-lg'
            />
          </div>

          <div className='flex flex-col mt-5 w-3/4 gap-2 relative'>
            <label className='text-sm' htmlFor='email'>Password</label>
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

          <div className='w-3/4 mt-2 mb-4 cursor-pointer'>
            <p className='text-sm text-left'>Forgot Password?</p>
          </div>

          <button className='flex flex-row items-center justify-center gap-4 bg-black py-2 rounded-xl w-3/4 cursor-pointer'>
            <p className='text-white text-sm'>Sign In</p>
            <ArrowRight color='white' className='h-4 w-4'/>
          </button>
        </form>
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