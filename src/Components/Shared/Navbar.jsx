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
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Profile dropdown state
  const dropdownRef = useRef(null);

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme change logic
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

  // Determine Dashboard Path based on role
  const getDashboardPath = () => {
    if (userRole === "admin") return "/dashboard/manage-users";
    if (userRole === "manager") return "/dashboard/manage-products";
    if (userRole === "buyer") return "/dashboard/my-orders";
    return "/dashboard";
  };

  // Requirement-based Conditional NavLinks
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

      {/* Requirement Logic: If user is logged in, show Dashboard. Otherwise show About & Contact */}
      {user ? (
        <li>
          <MyLink to={getDashboardPath()} onClick={() => setIsOpen(false)}>
            Dashboard
          </MyLink>
        </li>
      ) : (
        <>
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
      )}
    </>
  );

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always Left Side */}
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

            {/* Actions: Theme & User/Login */}
            <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
              <input
                onChange={(e) => handleTheme(e.target.checked)}
                type="checkbox"
                checked={theme === "dark"}
                className="toggle toggle-success toggle-sm"
              />

              {!user ? (
                /* Before Login Actions (Right Side) */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-sm btn-secondary text-white"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                /* After Login Actions: User Avatar & Logout */
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
                          alt="User"
                        />
                      </div>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-base-100 rounded-xl shadow-2xl border border-base-200 p-2 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-base-200 mb-2">
                        <p className="text-sm font-bold truncate">
                          {user?.displayName}
                        </p>
                        <p className="text-xs opacity-60 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <ul className="space-y-1">
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

          {/* Mobile Actions: Menu & Theme Toggle */}
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
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-green-600">Menu</span>
              <button onClick={() => setIsOpen(false)}>
                <IoMdClose className="text-2xl" />
              </button>
            </div>

            <ul className="flex flex-col gap-4 font-medium flex-grow">
              {navLinks}
            </ul>

            {/* Logout/Login Button at Bottom of Sidebar */}
            <div className="mt-auto pt-6 border-t border-base-200">
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
                  className="btn btn-error btn-outline w-full"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />
        )}
      </Container>
    </header>
  );
};

export default Navbar;
