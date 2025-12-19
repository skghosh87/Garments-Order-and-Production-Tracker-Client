import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API || "http://localhost:5000",
  withCredentials: true, // কুকি আদান-প্রদানের জন্য এটিই প্রধান
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    // শুধুমাত্র Response Interceptor প্রয়োজন (Error handling এর জন্য)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        // যদি টোকেন ইনভ্যালিড হয় বা এক্সপায়ার হয়
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
