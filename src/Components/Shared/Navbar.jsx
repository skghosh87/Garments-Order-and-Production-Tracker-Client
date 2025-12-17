import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import MyLink from "../Shared/MyLink";
import Container from "../Shared/Container";
import { Link } from "react-router";

const Navbar = () => {
  const { user, userRole, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logOut().catch((err) => console.error(err));
  };
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };
  const closeMenu = () => setIsOpen(false);

  // Role-based Dashboard Links
  const renderDashboardLinks = () => {
    if (!userRole) return null;

    switch (userRole) {
      case "admin":
        return (
          <li>
            <MyLink to="/dashboard/manage-users" onClick={closeMenu}>
              Admin Dashboard
            </MyLink>
          </li>
        );
      case "manager":
        return (
          <li>
            <MyLink to="/dashboard/manage-products" onClick={closeMenu}>
              Manager Dashboard
            </MyLink>
          </li>
        );
      case "buyer":
        return (
          <li>
            <MyLink to="/dashboard/my-orders" onClick={closeMenu}>
              My Orders
            </MyLink>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <Container className="relative">
        <nav className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-green-600 hover:text-blue-700"
          >
            Garments Tracker
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 font-medium text-blue-900">
            <li>
              <MyLink to="/" onClick={closeMenu}>
                Home
              </MyLink>
            </li>
            <li>
              <MyLink to="/all-products" onClick={closeMenu}>
                All-Products
              </MyLink>
            </li>

            {!user ? (
              <>
                <li>
                  <MyLink to="/about-us" onClick={closeMenu}>
                    About Us
                  </MyLink>
                </li>
                <li>
                  <MyLink to="/contact" onClick={closeMenu}>
                    Contact
                  </MyLink>
                </li>
                <li>
                  <MyLink
                    to="/login"
                    onClick={closeMenu}
                    className="text-green-600 btn btn-outline hover:bg-green-700 hover:text-white"
                  >
                    Login
                  </MyLink>
                </li>
                <li>
                  <MyLink
                    to="/register"
                    onClick={closeMenu}
                    className="text-red-600 btn btn-outline  px-4 py-2 rounded hover:bg-green-700 hover:text-white"
                  >
                    Register
                  </MyLink>
                </li>
                <input
                  onChange={(e) => handleTheme(e.target.checked)}
                  type="checkbox"
                  defaultChecked={localStorage.getItem("theme") === "dark"}
                  className="toggle"
                />
              </>
            ) : (
              <>
                {renderDashboardLinks()}
                <li className="flex items-center gap-2">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/2kRrFqG/default-avatar.png"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span>{user?.displayName || "User"}</span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoMdClose /> : <CiMenuFries />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 top-16 w-full bg-white shadow-md transition-all duration-300 ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-5"
          }`}
        >
          <ul className="flex flex-col p-4 space-y-3 font-medium">
            <li>
              <MyLink to="/" onClick={closeMenu}>
                Home
              </MyLink>
            </li>
            <li>
              <MyLink to="/all-products" onClick={closeMenu}>
                All-Products
              </MyLink>
            </li>

            {!user ? (
              <>
                <li>
                  <MyLink to="/about-us" onClick={closeMenu}>
                    About Us
                  </MyLink>
                </li>
                <li>
                  <MyLink to="/contact" onClick={closeMenu}>
                    Contact
                  </MyLink>
                </li>
                <li>
                  <MyLink
                    to="/login"
                    onClick={closeMenu}
                    className="text-green-600"
                  >
                    Login
                  </MyLink>
                </li>
                <li>
                  <MyLink
                    to="/register"
                    onClick={closeMenu}
                    className="bg-green-600 text-white text-center py-2 rounded"
                  >
                    Register
                  </MyLink>
                </li>
              </>
            ) : (
              <>
                {renderDashboardLinks()}
                <li className="flex items-center gap-3">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/2kRrFqG/default-avatar.png"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span>{user?.displayName || "User"}</span>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
