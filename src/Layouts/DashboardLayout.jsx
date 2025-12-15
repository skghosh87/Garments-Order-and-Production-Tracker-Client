import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import {
  FaUserShield,
  FaProductHunt,
  FaClipboardList,
  FaUserEdit,
  FaSpinner,
  FaHome,
  FaUserSlash,
} from "react-icons/fa";
import DashboardSidebar from "../Pages/Dashboard/Shared/DashboardSidebar";

/* ===========================
   Role Based Dashboard Links
=========================== */
const getDashboardLinks = (role) => {
  switch (role) {
    case "admin":
      return [
        {
          path: "manage-users",
          icon: <FaUserShield />,
          label: "Manage Users",
        },
        {
          path: "manage-orders",
          icon: <FaClipboardList />,
          label: "All Orders",
        },
        {
          path: "profile",
          icon: <FaUserEdit />,
          label: "My Profile",
        },
      ];

    case "manager":
      return [
        {
          path: "add-product",
          icon: <FaProductHunt />,
          label: "Add Product",
        },
        {
          path: "manage-products",
          icon: <FaProductHunt />,
          label: "Manage Products",
        },
        {
          path: "pending-orders",
          icon: <FaClipboardList />,
          label: "Pending Orders",
        },
        {
          path: "approved-orders",
          icon: <FaClipboardList />,
          label: "Approved Orders",
        },
        {
          path: "profile",
          icon: <FaUserEdit />,
          label: "My Profile",
        },
      ];

    case "buyer":
    default:
      return [
        {
          path: "my-orders",
          icon: <FaClipboardList />,
          label: "My Orders",
        },
        {
          path: "profile",
          icon: <FaUserEdit />,
          label: "My Profile",
        },
      ];
  }
};

const DashboardLayout = () => {
  const { user, userRole, userStatus, loading } = useAuth();

  /* Loading State */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="text-5xl text-green-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  /* Suspended Account */
  if (userStatus === "suspended") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-6">
        <FaUserSlash className="text-6xl text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-red-700">Account Suspended</h1>
        <p className="text-center text-red-600 mt-2 max-w-md">
          Your account has been suspended by admin. Please check your profile
          for suspension reason.
        </p>
      </div>
    );
  }

  const dashboardLinks = getDashboardLinks(userRole);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Body */}
      <div className="drawer lg:drawer-open flex-grow">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* Main Content */}
        <div className="drawer-content p-4 md:p-6">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-success btn-sm drawer-button lg:hidden mb-4 text-white"
          >
            Dashboard Menu
          </label>

          <main className="max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        {/* Sidebar */}

        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <DashboardSidebar />
          <aside className="w-64 min-h-full bg-white border-r shadow-lg">
            <h2 className="text-xl font-bold text-center py-5 text-green-600 border-b">
              {userRole?.toUpperCase()} Dashboard
            </h2>

            <ul className="menu p-4">
              {dashboardLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg p-3 transition ${
                        isActive
                          ? "bg-green-500 text-white font-semibold"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                </li>
              ))}

              <div className="divider"></div>

              <li>
                <NavLink to="/" className="flex items-center gap-3 p-3">
                  <FaHome />
                  Back to Home
                </NavLink>
              </li>
            </ul>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
