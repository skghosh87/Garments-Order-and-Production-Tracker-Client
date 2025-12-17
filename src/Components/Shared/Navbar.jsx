import { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import MyLink from "../Shared/MyLink";
import Container from "../Shared/Container";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, userRole, logOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্টেট
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // প্রোফাইল ড্রপডাউন স্টেট
  const dropdownRef = useRef(null);

  // থিম স্টেট
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ করার লজিক
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // থিম পরিবর্তন লজিক
  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsOpen(false);
      setIsDropdownOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ড্যাশবোর্ড পাথ নির্ধারণ
  const getDashboardPath = () => {
    if (userRole === "admin") return "/dashboard/manage-users";
    if (userRole === "manager") return "/dashboard/manage-products";
    if (userRole === "buyer") return "/dashboard/my-orders";
    return "/dashboard";
  };

  const navLinks = (
    <>
      <li>
        <MyLink to="/" onClick={() => setIsOpen(false)}>
          Home
        </MyLink>
      </li>
      <li>
        <MyLink to="/all-products" onClick={() => setIsOpen(false)}>
          All-Products
        </MyLink>
      </li>
      <li>
        <MyLink to="/about-us" onClick={() => setIsOpen(false)}>
          About Us
        </MyLink>
      </li>
      <li>
        <MyLink to="/contact" onClick={() => setIsOpen(false)}>
          Contact
        </MyLink>
      </li>
    </>
  );

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-green-600 flex items-center gap-2"
          >
            <span className="bg-green-600 text-white p-1 rounded">GT</span>
            <span className="hidden sm:block">Garments Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6 font-medium text-base-content">
              {navLinks}
            </ul>

            {/* Actions: Theme & Profile */}
            <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
              <input
                onChange={(e) => handleTheme(e.target.checked)}
                type="checkbox"
                checked={theme === "dark"}
                className="toggle toggle-success toggle-sm"
              />

              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-outline btn-success"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-sm btn-success text-white"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center focus:outline-none"
                    title={user?.displayName}
                  >
                    <div className="avatar online">
                      <div className="w-10 h-10 rounded-full ring ring-green-500 ring-offset-base-100 ring-offset-2">
                        <img
                          src={
                            user?.photoURL ||
                            "https://i.ibb.co/2kRrFqG/default-avatar.png"
                          }
                          alt="Profile"
                        />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-base-100 rounded-xl shadow-2xl border border-base-200 p-2 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-base-200 mb-2">
                        <p className="text-sm font-bold truncate">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-base-content/60 truncate">
                          {user?.email}
                        </p>
                        <span className="badge badge-success badge-xs mt-1 capitalize text-[10px]">
                          {userRole}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to={getDashboardPath()}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2 hover:bg-base-200 rounded-lg transition-colors"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Theme */}
          <div className="flex md:hidden items-center gap-3">
            <input
              onChange={(e) => handleTheme(e.target.checked)}
              type="checkbox"
              checked={theme === "dark"}
              className="toggle toggle-success toggle-xs"
            />
            <button
              className="text-2xl text-base-content focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <IoMdClose /> : <CiMenuFries />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Navigation */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-[60] w-72 bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-green-600">Menu</span>
              <button onClick={() => setIsOpen(false)}>
                <IoMdClose className="text-2xl" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 mb-8 p-3 bg-base-200 rounded-xl">
                <img
                  className="w-12 h-12 rounded-full border-2 border-green-500"
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co/2kRrFqG/default-avatar.png"
                  }
                  alt=""
                />
                <div className="overflow-hidden">
                  <p className="font-bold truncate">{user?.displayName}</p>
                  <p className="text-xs opacity-60 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-4 font-medium">
              {navLinks}
              {user && (
                <li>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsOpen(false)}
                    className="text-green-600 font-bold"
                  >
                    My Dashboard
                  </Link>
                </li>
              )}
            </ul>

            <div className="mt-10 pt-6 border-t border-base-200">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-outline btn-success w-full"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn btn-success text-white w-full"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-outline w-full text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Overlay for Mobile Sidebar */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in"
          />
        )}
      </Container>
    </header>
  );
};

export default Navbar;
