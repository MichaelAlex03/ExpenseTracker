import React from "react";
import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });

      setAuth({
        ...auth,
        email: response.data.email,
        userId: response.data.userId,
        accessToken: response.data.accessToken,
      });

      return response.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };

  return refresh;
};

export default useRefreshToken;
