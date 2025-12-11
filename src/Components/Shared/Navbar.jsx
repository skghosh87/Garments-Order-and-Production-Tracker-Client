import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logOut().catch((err) => console.log(err));
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 relative">
        <nav className="flex justify-between items-center h-16">
          {/* ✅ Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            Garments Tracker
          </Link>

          {/* ✅ Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 font-medium">
            <li>
              <Link to="/" className="hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-products" className="hover:text-green-600">
                All-Products
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link to="/about-us" className="hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-green-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-green-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-green-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/2kRrFqG/default-avatar.png"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
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

          {/* ✅ Mobile Menu Button */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoMdClose /> : <CiMenuFries />}
          </button>
        </nav>

        {/* ✅ Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 top-16 w-full bg-white shadow-md transition-all duration-300 ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-5"
          }`}
        >
          <ul className="flex flex-col p-4 space-y-3 font-medium">
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-products" onClick={closeMenu}>
                All-Products
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link to="/about-us" onClick={closeMenu}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={closeMenu}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-green-600"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-green-600 text-white text-center py-2 rounded"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
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
      </div>
    </header>
  );
};

export default Navbar;
