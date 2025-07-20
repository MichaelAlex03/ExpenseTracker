import {
  LayoutDashboard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_EMAIL = import.meta.env.VITE_GITHUB_USER_EMAIL;

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {};

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-[55%] bg-white flex flex-col items-center justify-center px-40">
        <div className="flex flex-row items-center gap-2 w-full 2xl:w-3/4">
          <div className="bg-black h-10 w-10 flex justify-center items-center rounded-xl">
            <LayoutDashboard color="white" className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <p className="text-sm">Manage your finances</p>
          </div>
        </div>

        <div className="border-0 shadow-lg w-full 2xl:w-3/4 mt-5 flex flex-col items-center justify-center p-12 rounded-xl">
          <form
            className="flex flex-col items-center justify-center w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="flex flex-col mt-7 w-3/4 gap-2 relative">
              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <Mail className="absolute top-[37px] left-3 h-4 w-4" />
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-color py-1 pl-10 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col mt-5 w-3/4 gap-2 relative">
              <label className="text-sm" htmlFor="email">
                Password
              </label>
              <Lock className="absolute top-[37px] left-3 h-4 w-4" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-color py-1 pl-10 rounded-lg text-sm"
              />
              {!showPassword ? (
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowPassword(true)}
                >
                  <Eye className="absolute top-[37px] right-3 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowPassword(false)}
                >
                  <EyeOff className="absolute top-[37px] right-3 h-4 w-4" />
                </button>
              )}
            </div>

            <div className="w-3/4 mt-2 mb-4 cursor-pointer">
              <p className="text-sm text-left font-semibold">
                Forgot Password?
              </p>
            </div>

            <button className="flex flex-row items-center justify-center gap-4 bg-black py-2 rounded-xl w-3/4 cursor-pointer">
              <p className="text-white text-sm">Sign In</p>
              <ArrowRight color="white" className="h-4 w-4" />
            </button>
          </form>

          <div className="relative w-3/4 h-px bg-gray-300 mt-6">
            <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-white px-2">
              OR CONTINUE WITH
            </p>
          </div>

          <div className="w-3/4 flex flex-row mt-6 items-center justify-center gap-8">
            <button
              type="button"
              className="flex flex-row items-center gap-2 border-1 border-color px-6 py-2 rounded-lg cursor-pointer"
              onClick={handleGoogleLogin}
            >
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
              <p className="text-sm">Google</p>
            </button>

            <button
              className="flex flex-row items-center gap-2 border-1 border-color px-6 py-2 rounded-lg cursor-pointer"
              onClick={handleGithubLogin}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="mr-2 h-4 w-4"
              >
                <title>GitHub icon</title>
                <path
                  d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
    0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.087-.744.083-.729.083-.729
    1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.333-5.466-5.931
    0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.49 11.49 0 013.003-.404c1.018.005
    2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22
    0 4.61-2.807 5.625-5.48 5.921.43.37.823 1.102.823 2.222
    0 1.606-.015 2.896-.015 3.286 0 .322.217.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>

              <p className="text-sm">Github</p>
            </button>
          </div>

          <div className="flex flex-row items-center justify-center w-3/4 mt-4">
            <p className="text-sm">
              Dont have an account?
              <span
                onClick={() => navigate("/register")}
                className="font-medium hover:cursor-pointer hover:underline"
              >
                {" "}
                Sign up{" "}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-[45%] custom-gradient-bg flex flex-col items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl icon-background mb-10">
          <LayoutDashboard className="h-10 w-10 text-primary" />
        </div>

        <div className="flex flex-col items-center max-w-md gap-2">
          <h1 className="text-3xl font-bold">Take Control of Your Finances</h1>
          <p className="text-center text-base">
            Track expenses, manage income, and achieve your financial goals with
            our intuitive expense tracker.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-10 min-w-md">
          <div className="flex flex-row items-center gap-4">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <p className="text-sm">Real-time expense tracking</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm">Budget management</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <p className="text-sm">Financial insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
