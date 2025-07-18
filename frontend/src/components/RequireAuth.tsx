import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  console.log(auth?.accessToken)
  return auth?.accessToken ? <Outlet /> : <Navigate to={"/home"} />;
};

export default RequireAuth;
