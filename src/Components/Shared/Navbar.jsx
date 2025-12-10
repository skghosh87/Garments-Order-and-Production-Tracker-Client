import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import MyLink from "./MyLink";
import Container from "./Container";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

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

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      await logOut();
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (loading) {
    // return <LoadingSpinner />;
  }

  return (
    <header className="bg-base-100 shadow-md z-10 sticky top-0">
      <Container className="px-4">
        <nav className="navbar">
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

          <div className="navbar-end space-x-2">
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

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
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
