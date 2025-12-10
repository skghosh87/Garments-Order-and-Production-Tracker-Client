import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthProvider";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaIdBadge,
} from "react-icons/fa";

const Register = () => {
  const { createUser, updateUserProfile, logOut } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("buyer");

  const [passwordError, setPasswordError] = useState("");

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const validatePassword = (pwd) => {
    let error = "";
    if (pwd.length < 6) {
      error = "Password must be at least 6 characters long.";
    } else if (!/[A-Z]/.test(pwd)) {
      error = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(pwd)) {
      error = "Password must contain at least one lowercase letter.";
    }

    setPasswordError(error);
    return error === "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error(passwordError);
      return;
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateUserProfile(name, photoURL);

      toast.success("Registration successful! Please log in.", {
        autoClose: 3000,
      });

      // Example: await axios.post('/api/users', { email, name, role, status: 'pending' });

      await logOut();

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);

      toast.error(error.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl max-w-lg w-full"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Create a New Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaUser className="mr-2 text-blue-500" /> Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaEnvelope className="mr-2 text-blue-500" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your Email"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaCamera className="mr-2 text-blue-500" /> Photo URL (Optional)
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Picture URL"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaIdBadge className="mr-2 text-blue-500" /> Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              required
            >
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaLock className="mr-2 text-blue-500" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                validatePassword(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Password"
              required
            />

            {passwordError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-semibold">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an Account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
