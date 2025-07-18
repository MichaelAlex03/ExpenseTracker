import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    console.log(accessToken);

    if (accessToken) {
      setAuth({
        ...auth,
        accessToken,
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
