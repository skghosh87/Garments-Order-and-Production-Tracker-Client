import React, { useState } from "react";
import {
  FaEye,
  FaGoogle,
  FaUserPlus,
  FaIdBadge,
  FaUser,
  FaEnvelope,
  FaCamera,
  FaLock,
} from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Container from "../Components/Shared/Container";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const {
    createUser,
    updateUserProfile,
    signInWithGoogle,
    setLoading,
    logOut,
  } = useAuth();

  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // ফায়ারবেস এরর মেসেজ পার্স করা
  const parseFirebaseError = (error) => {
    let errorMessage = error.message
      .replace("Firebase: Error (auth/", "")
      .replace(").", "")
      .replaceAll("-", " ")
      .trim();

    if (errorMessage.includes("email already in use")) {
      errorMessage = "This email is already registered. Please sign in.";
    }
    return errorMessage;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL =
      form.photo.value || "https://i.ibb.co/5vFwYxS/default-user.png";
    const password = form.password.value;
    const role = form.role.value;

    setPasswordError("");

    // পাসওয়ার্ড ভ্যালিডেশন (Assignment Requirement)
    const regExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!regExp.test(password)) {
      const validationMessage =
        "Password must be at least 6 characters, include one uppercase and one lowercase letter.";
      setPasswordError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    try {
      setLoading(true);

      // ১. Firebase-এ ইউজার তৈরি
      await createUser(email, password);
      await updateUserProfile(name, photoURL);

      // ২. MongoDB-র জন্য ডাটা অবজেক্ট (Role capitalization & Status 'pending')
      const userInfo = {
        name,
        email,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        photoURL,
        status: "pending", // Assignment Requirement: Default status pending
        createdAt: new Date(),
      };

      // ৩. ব্যাকএন্ডে ডাটা পাঠানো
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/users`,
        userInfo
      );

      if (res.data.insertedId || res.data.message === "User already exists") {
        toast.success(
          "Registration Successful! Please login and wait for approval."
        );

        // টোস্ট দেখার জন্য ২ সেকেন্ড সময় নিয়ে রিডাইরেক্ট
        setTimeout(async () => {
          await logOut();
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user?.displayName,
        email: user?.email,
        role: "Buyer", // Google login-এর জন্য ডিফল্ট রোল
        photoURL: user?.photoURL,
        status: "pending",
        createdAt: new Date(),
      };

      await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/users`,
        userInfo
      );

      toast.success("Google Sign-Up Successful! Redirecting to login...");
      setTimeout(async () => {
        await logOut();
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(`Google sign-up failed: ${parseFirebaseError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <ToastContainer position="top-center" autoClose={2000} />
      <Container className="flex items-center justify-center">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-green-200 dark:border-green-700/50">
          <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6 flex items-center justify-center gap-2">
            <FaUserPlus className="text-3xl" /> Create Your Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaUser className="inline mr-2 text-green-500" /> Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaEnvelope className="inline mr-2 text-green-500" /> Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaIdBadge className="inline mr-2 text-green-500" /> Select Your
                Role
              </label>
              <select
                name="role"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="buyer">Buyer</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaCamera className="inline mr-2 text-green-500" /> Photo URL
                (Optional)
              </label>
              <input
                name="photo"
                type="text"
                placeholder="Your photo URL"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaLock className="inline mr-2 text-green-500" /> Password
              </label>
              <input
                name="password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-[42px] cursor-pointer text-green-600 text-xl"
              >
                {show ? <IoEyeOff /> : <FaEye />}
              </span>
            </div>

            {passwordError && (
              <p className="text-sm text-red-600 font-medium">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Register Account
            </button>

            <div className="mt-5 border-t pt-5">
              <button
                onClick={handleGoogleSignup}
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <FaGoogle className="mr-3 text-red-500 text-xl" /> Sign up with
                Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Register;
