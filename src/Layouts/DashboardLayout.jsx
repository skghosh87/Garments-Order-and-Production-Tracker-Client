import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import {
  FaUserShield,
  FaProductHunt,
  FaClipboardList,
  FaUserEdit,
  FaTruck,
  FaSpinner,
  FaHome,
} from "react-icons/fa";

// ১. রোল-ভিত্তিক ড্যাশবোর্ড মেনু ডেটা
const getDashboardLinks = (role) => {
  switch (role) {
    case "admin":
      return [
        {
          path: "manage-users",
          icon: <FaUserShield />,
          label: "User Management",
        },

        {
          path: "manage-orders",
          icon: <FaClipboardList />,
          label: "All Orders",
        },
        { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
      ];
    case "manager":
      return [
        {
          path: "manage-users",
          icon: <FaUserShield />,
          label: "User Management",
        },
        {
          path: "manage-orders",
          icon: <FaClipboardList />,
          label: "Orders Management",
        },
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
        { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
      ];
    case "buyer":
    default:
      return [
        {
          path: "my-orders",
          icon: <FaClipboardList />,
          label: "My Orders",
        },
        { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
      ];
  }
};

const DashboardLayout = () => {
  const { user, userRole, userStatus, loading: authLoading } = useAuth();

  // লোডিং স্টেট হ্যান্ডলিং
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <FaSpinner className="text-5xl text-green-500 animate-spin" />
        <span className="ml-4 text-xl dark:text-gray-300">
          Dashboard is loading...
        </span>
      </div>
    );
  }

  if (userStatus === "suspended") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-red-50 dark:bg-red-950">
        <FaUserSlash className="text-6xl text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-300">
          Account Suspended
        </h1>
        <p className="text-lg text-red-600 dark:text-red-400 mt-2">
          Your account has been suspended. Please contact support for more
          information.
        </p>
      </div>
    );
  }

  const dashboardLinks = getDashboardLinks(userRole);

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      {/* ১. হেডার/নভবার */}
      <Navbar />

      {/* ২. ড্যাশবোর্ডের মূল বডি */}
      <div className="drawer lg:drawer-open flex-grow">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        {/* ২.১. কন্টেন্ট এরিয়া (প্রধান ভাগ) */}
        <div className="drawer-content flex flex-col justify-start p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
          {/* মোবাইল স্ক্রিনের জন্য সাইডবার টগল বাটন */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-sm btn-success drawer-button lg:hidden mb-4 self-start text-white dark:text-gray-900"
          >
            Dashboard Menu
          </label>

          {/* ড্যাশবোর্ডের ভেতরের পেজগুলি এখানে রেন্ডার হবে */}
          <main className="w-full max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>

        {/* ২.২. সাইডবার (ড্যাশবোর্ড মেনু) */}
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-64 min-h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-r dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl font-extrabold mb-6 text-green-600 dark:text-green-400 text-center border-b pb-3">
              {userRole ? userRole.toUpperCase() : "BUYER"} Dashboard
            </h2>

            {/* রোল-ভিত্তিক নেভিগেশন লিঙ্কগুলি */}
            {dashboardLinks.map((link) => (
              <li key={link.path} className="mb-1">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-green-500 text-white font-bold shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </NavLink>
              </li>
            ))}

            {/* মূল সাইটে ফেরার জন্য একটি লিঙ্ক */}
            <div className="divider my-4 border-t border-gray-200 dark:border-gray-700"></div>
            <li>
              <NavLink
                to="/"
                className="text-gray-500 hover:text-green-500 p-3 rounded-lg"
              >
                <FaHome />
                <span className="ml-2">Go back to Home Page</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* ৩. ফুটার */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
