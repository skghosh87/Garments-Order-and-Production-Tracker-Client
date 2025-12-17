import React, { useState } from "react";
import {
  FaEye,
  FaGoogle,
  FaUserPlus,
  FaIdBadge,
  FaUser, // Full Name এর জন্য
  FaEnvelope, // Email এর জন্য
  FaCamera, // Photo URL এর জন্য
  FaLock, // Password এর জন্য
} from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Container from "../Components/Shared/Container";
import useAuth from "../hooks/useAuth";
// import axios from "axios";

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
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const photoURL =
      form.get("photo") || "https://i.ibb.co/5vFwYxS/default-user.png";
    const email = form.get("email");
    const password = form.get("password");
    const role = form.get("role");

    setPasswordError("");

    const validationMessage =
      "Password must be at least 6 characters long and include one uppercase and one lowercase letter.";
    const regExp = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!regExp.test(password)) {
      setPasswordError(validationMessage);
      toast.error(validationMessage, { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      await createUser(email, password);
      await updateUserProfile(name, photoURL); // TODO: MongoDB Integration (Next Step)

      toast.success("Registration Successful! Please Login.", {
        position: "top-center",
      });
      await logOut();
      navigate("/login");
    } catch (error) {
      const errorMessage = parseFirebaseError(error);
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(); // TODO: Save Google User to MongoDB with default role and status
      toast.success("Google Sign-Up Successful! Please Login.", {
        position: "top-center",
      });
      await logOut();
      navigate("/login");
    } catch (error) {
      const errorMessage = parseFirebaseError(error);
      toast.error(`Google sign-up failed: ${errorMessage}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      {" "}
      <Container className="flex items-center justify-center">
        {" "}
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-green-200 dark:border-green-700/50">
          {" "}
          <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6 flex items-center justify-center gap-2">
            {" "}
            <FaUserPlus className="text-green-500 dark:text-green-400 text-3xl" />{" "}
            Create Your Account{" "}
          </h2>{" "}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}{" "}
            <div>
              {" "}
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {" "}
                <FaUser className="inline mr-2 text-green-500" /> Full Name{" "}
              </label>{" "}
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />{" "}
            </div>
            {/* Email */}{" "}
            <div>
              {" "}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {" "}
                <FaEnvelope className="inline mr-2 text-green-500" /> Email{" "}
              </label>{" "}
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@email.com"
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />{" "}
            </div>
            {/* Role Dropdown */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                <FaIdBadge className="inline mr-2 text-green-500" /> Select Your
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white appearance-none transition duration-150"
                required
              >
                <option value="buyer">Buyer </option>
                <option value="manager">Manager </option>
              </select>
            </div>
            {/* Photo URL */}{" "}
            <div>
              {" "}
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {" "}
                <FaCamera className="inline mr-2 text-green-500" /> Photo URL
                (Optional){" "}
              </label>{" "}
              <input
                id="photo"
                type="text"
                name="photo"
                placeholder="Your photo URL"
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition duration-150"
              />{" "}
            </div>
            {/* Password */}{" "}
            <div className="relative">
              {" "}
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {" "}
                <FaLock className="inline mr-2 text-green-500" /> Password{" "}
              </label>{" "}
              <input
                id="password"
                type={show ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />{" "}
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 mt-2 cursor-pointer text-green-600 dark:text-green-400 text-xl"
              >
                {show ? <IoEyeOff /> : <FaEye />}{" "}
              </span>{" "}
            </div>{" "}
            {passwordError && (
              <p className="mt-1 text-sm text-red-600 font-medium dark:text-red-400">
                {passwordError}{" "}
              </p>
            )}{" "}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-md disabled:bg-green-400"
            >
              Register Account{" "}
            </button>{" "}
            <div className="mt-5 border-t border-gray-200 dark:border-gray-600 pt-5">
              {" "}
              <div className="flex items-center justify-center gap-2 mb-4">
                {" "}
                <div className="h-px w-full bg-gray-200 dark:bg-gray-600"></div>{" "}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  OR
                </span>{" "}
                <div className="h-px w-full bg-gray-200 dark:bg-gray-600"></div>{" "}
              </div>{" "}
              <button
                onClick={handleGoogleSignup}
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150"
              >
                {" "}
                <FaGoogle className="mr-3 text-red-500 text-xl" />
                Sign up with Google{" "}
              </button>{" "}
            </div>{" "}
            <div className="text-center mt-3">
              {" "}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-600 dark:text-green-400 hover:underline font-medium ml-1"
                >
                  Login Here{" "}
                </Link>{" "}
              </p>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </Container>
      <ToastContainer />{" "}
    </div>
  );
};

export default Register;
