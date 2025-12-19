import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);
  const { signIn, signInWithGoogle, resetPassword, user, loading, setLoading } =
    useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  // টোস্ট মেসেজ দেখানোর জন্য একটি ছোট ফাংশন
  const formatError = (error) => {
    return error.message
      .replace("Firebase: Error (auth/", "")
      .replace(").", "")
      .replaceAll("-", " ");
  };

  // ১. ইমেল ও পাসওয়ার্ড দিয়ে লগইন
  const handleSignin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      setLoading(true);
      await signIn(email, password);

      // সাকসেস মেসেজ দেখানো
      toast.success("Login Successful! Redirecting...", {
        position: "top-center",
        autoClose: 1500, // ১.৫ সেকেন্ড পর টোস্ট বন্ধ হবে
      });

      // টোস্ট দেখার জন্য সময় দিয়ে নেভিগেট করা
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (error) {
      toast.error(formatError(error));
      setLoading(false); // এরর হলে লোডিং বন্ধ করা
    }
  };

  // ২. গুগল দিয়ে লগইন
  const handleGoogleSignin = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user?.displayName,
        email: user?.email,
        role: "buyer",
        photoURL: user?.photoURL,
        status: "pending",
        createdAt: new Date(),
      };

      await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/users`,
        userInfo
      );

      toast.success("Google Login Successful!");

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (error) {
      toast.error("Google sign-in failed.");
      setLoading(false);
    }
  };

  // ৩. পাসওয়ার্ড রিসেট
  const handleForgetPassword = async () => {
    const email = emailRef.current?.value.trim();
    if (!email) {
      toast.warning("Please enter your email address.");
      return;
    }

    try {
      await resetPassword(email);
      toast.info("Check your inbox for password reset link.");
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      {/* ToastContainer অবশ্যই এখানে বা মেইন লেআউটে থাকতে হবে */}
      <ToastContainer />

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-green-100 dark:border-green-900">
        <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6 flex justify-center items-center gap-2">
          <FaSignInAlt /> Login
        </h2>

        <form onSubmit={handleSignin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaEnvelope className="inline mr-2 text-green-500" /> Email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white outline-none"
              required
            />
          </div>

          <div className="relative">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaLock className="inline mr-2 text-green-500" /> Password
              </label>
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-xs text-green-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white outline-none"
              required
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 text-xl"
            >
              {show ? <IoEyeOff /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold transition ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
          >
            {loading ? "Logging in..." : "Login Now"}
          </button>

          <div className="flex items-center gap-2 py-2">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium dark:text-white cursor-pointer"
          >
            <FcGoogle className="text-2xl" /> Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            New here?
            <Link
              to="/register"
              className="text-green-600 dark:text-green-400 font-bold ml-1 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
