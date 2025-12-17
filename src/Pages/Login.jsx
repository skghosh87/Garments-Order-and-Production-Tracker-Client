import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);

  const { signIn, signInWithGoogle, resetPassword, user, loading } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleSignin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("ইমেল এবং পাসওয়ার্ড দিন");
      return;
    }

    try {
      await signIn(email, password);
      toast.success("লগইন সফল হয়েছে");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error.message
          .replace("Firebase: Error (auth/", "")
          .replace(").", "")
          .replaceAll("-", " ")
      );
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Google Login Successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleForgetPassword = async () => {
    const email = emailRef.current?.value.trim();
    if (!email) {
      toast.error("ইমেল লিখুন");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("রিসেট লিংক পাঠানো হয়েছে");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6 flex justify-center gap-2">
          <FaSignInAlt /> Login
        </h2>

        <form onSubmit={handleSignin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              className="w-full mt-1 px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              name="password"
              className="w-full mt-1 px-4 py-2 border rounded"
              required
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {show ? <IoEyeOff /> : <FaEye />}
            </span>
          </div>

          <button
            type="button"
            onClick={handleForgetPassword}
            className="text-sm text-green-600"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Processing..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignin}
            className="w-full flex items-center justify-center gap-2 border py-2 rounded"
          >
            <FcGoogle /> Login with Google
          </button>

          <p className="text-center text-sm">
            New here?
            <Link to="/register" className="text-green-600 ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
