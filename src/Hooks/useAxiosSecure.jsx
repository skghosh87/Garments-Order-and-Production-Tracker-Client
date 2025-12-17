import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "./useAuth"; // আপনার তৈরি করা কাস্টম হুক

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000", // আপনার সার্ভারের URL
  withCredentials: true, // যদি কুকি ব্যবহার করেন তবে এটি জরুরি
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    // ১. Request Interceptor: প্রতিটি রিকোয়েস্টের সাথে টোকেন পাঠানো
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // ২. Response Interceptor: ৪০১ বা ৪০৩ এরর হ্যান্ডেল করা (JWT Challenge)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logOut(); // ইউজারকে লগআউট করে দেওয়া
          navigate("/login"); // লগইন পেজে পাঠিয়ে দেওয়া
        }
        return Promise.reject(error);
      }
    );

    // ক্লিনআপ ফাংশন
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
