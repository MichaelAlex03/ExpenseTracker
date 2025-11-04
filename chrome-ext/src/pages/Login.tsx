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
import "./Login.css";


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
    <div className="login-container">
      <div className="login-left-section">
        <div className="login-header">
          <div className="login-logo">
            <LayoutDashboard color="white" className="login-logo-icon" />
          </div>
          <div className="login-title-wrapper">
            <h1 className="login-app-title">Expense Tracker</h1>
            <p className="login-app-subtitle">Manage your finances</p>
          </div>
        </div>

        <div className="login-form-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-header">
              <h1 className="login-welcome-title">Welcome Back</h1>
              <p className="login-welcome-subtitle">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="login-form-group">
              <label className="login-form-label" htmlFor="email">
                Email
              </label>
              <Mail className="login-input-icon" />
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-form-input"
              />
            </div>

            <div className="login-form-group password-group">
              <label className="login-form-label" htmlFor="password">
                Password
              </label>
              <Lock className="login-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-form-input"
              />
              {!showPassword ? (
                <button
                  type="button"
                  className="login-toggle-button"
                  onClick={() => setShowPassword(true)}
                >
                  <Eye className="login-input-icon-right" />
                </button>
              ) : (
                <button
                  type="button"
                  className="login-toggle-button"
                  onClick={() => setShowPassword(false)}
                >
                  <EyeOff className="login-input-icon-right" />
                </button>
              )}
            </div>

            <div className="login-forgot-password">
              <p className="login-forgot-password-text">
                Forgot Password?
              </p>
            </div>

            <button className="login-signin-button" type="submit">
              <p className="login-signin-button-text">Sign In</p>
              <ArrowRight color="white" className="login-signin-icon" />
            </button>
          </form>

          <div className="login-divider">
            <p className="login-divider-text">
              OR CONTINUE WITH
            </p>
          </div>

          <div className="login-oauth-container">
            <button
              type="button"
              className="login-oauth-button"
              onClick={handleGoogleLogin}
            >
              <svg className="login-oauth-icon" viewBox="0 0 24 24">
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
              <p className="login-oauth-text">Google</p>
            </button>

            <button
              className="login-oauth-button"
              onClick={handleGithubLogin}
              type="button"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="login-oauth-icon"
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

              <p className="login-oauth-text">Github</p>
            </button>
          </div>

          <div className="login-signup-section">
            <p className="login-signup-text">
              Dont have an account?
              <span
                onClick={() => navigate("/register")}
                className="login-signup-link"
              >
                {" "}
                Sign up{" "}
              </span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
