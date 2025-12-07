import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider"; // আপনার AuthProvider এর পথ
import MyLink from "./MyLink"; // আমদানি করা হলো
import Container from "./Container"; // আমদানি করা হলো
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  // প্রমাণীকরণ এবং ব্যবহারকারীর ডেটা
  const { user, logOut, loading } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // থিম টগল লজিক (আপনি আপনার প্রয়োজন অনুযায়ী এটিকে Context বা অন্য উপায়ে ম্যানেজ করতে পারেন)
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // DaisyUI/Tailwind থিম পরিবর্তন
  };

  // ডায়নামিক ন্যাভিগেশন লিঙ্কস
  const navLinks = (
    <>
      <li>
        <MyLink to="/">Home</MyLink>
      </li>
      <li>
        <MyLink to="/all-products">All Products</MyLink>
      </li>
      <li>
        <MyLink to="/about-us">About Us</MyLink>
      </li>
      <li>
        <MyLink to="/contact">Contact</MyLink>
      </li>
    </>
  );

  // লগআউট হ্যান্ডেলার (JWT Cookie অপসারণ সহ)
  const handleLogout = async () => {
    try {
      // সার্ভার থেকে JWT টোকেন Cookie অপসারণ
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      // Firebase থেকে লগআউট
      await logOut();
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (loading) {
    // লোডিং অবস্থায় ইউআই লোড হওয়া এড়াতে পারে
    // return <LoadingSpinner />;
  }

  return (
    <header className="bg-base-100 shadow-md z-10 sticky top-0">
      {/* Container কম্পোনেন্টটি ব্যবহার করা হলো */}
      <Container className="px-4">
        <nav className="navbar">
          {/* লোগো/ব্র্যান্ড নাম এবং মোবাইল মেনু */}
          <div className="navbar-start">
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-ghost lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <CiMenuFries className="h-5 w-5" />
              </label>
              <ul
                tabIndex={0}
                className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${
                  isMenuOpen ? "block" : "hidden"
                } lg:hidden`}
                onClick={() => setIsMenuOpen(false)}
              >
                {navLinks}
                {user ? (
                  <li>
                    <MyLink to="/dashboard">Dashboard</MyLink>
                  </li>
                ) : (
                  <>
                    <li>
                      <MyLink to="/login">Login</MyLink>
                    </li>
                    <li>
                      <MyLink to="/register">Register</MyLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <Link
              to="/"
              className="btn btn-ghost normal-case text-xl font-bold text-primary"
            >
              Garments Tracker
            </Link>
          </div>

          {/* ডেস্কটপ মেনু */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 font-medium space-x-2">
              {navLinks}
              {user && (
                <li>
                  <MyLink to="/dashboard">Dashboard</MyLink>
                </li>
              )}
            </ul>
          </div>

          {/* শেষ অংশ: Auth & Theme */}
          <div className="navbar-end space-x-2">
            {/* থিম টগল */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <MdOutlineDarkMode className="h-6 w-6" />
              ) : (
                <MdOutlineLightMode className="h-6 w-6" />
              )}
            </button>

            {/* ব্যবহারকারী অথেনটিকেশন স্ট্যাটাস */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    {/* ইউজার অ্যাভাটার */}
                    <img
                      src={user.photoURL || "placeholder-avatar.png"}
                      alt={user.displayName || user.email}
                      title={user.displayName || user.email}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/dashboard/profile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              // লগইন পূর্ববর্তী অবস্থায়
              <div className="hidden lg:flex space-x-2">
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
