import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const email = params.get("email");
    const userId = params.get("userId");
    console.log(accessToken);

    if (accessToken) {
      setAuth({
        ...auth,
        accessToken: accessToken || "",
        email: email || "",
        userId: userId ? Number(userId) : 0 
      });
      if (auth.accessToken) {
        navigate("/home");
      }
    } else {
      navigate("/");
    }
  }, [auth]);
  return <p>....Redirecting</p>;
};

export default OAuthSuccess;
