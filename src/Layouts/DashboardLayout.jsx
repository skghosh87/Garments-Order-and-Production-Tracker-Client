import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider"; // আপনার তৈরি করা AuthContext হুক
import Navbar from "../Components/Shared/Navbar"; // আপনার বিদ্যমান Navbar
import Footer from "../Components/Shared/Footer"; // আপনার বিদ্যমান Footer
import {
  FaUserShield,
  FaProductHunt,
  FaClipboardList,
  FaUserEdit,
  FaTruck,
} from "react-icons/fa";

// ১. রোল-ভিত্তিক ড্যাশবোর্ড মেনু ডেটা
const getDashboardLinks = (role) => {
  switch (role) {
    case "admin":
      return [
        {
          path: "manage-users",
          icon: <FaUserShield />,
          label: "Manage Managers & Buyer",
        },
        {
          path: "all-products",
          icon: <FaProductHunt />,
          label: "All Products (Admin View)",
        },
        { path: "all-orders", icon: <FaClipboardList />, label: "All Orders" },
        { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
      ];
    case "manager":
      return [
        { path: "add-product", icon: <FaProductHunt />, label: "Add Product" },
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
          icon: <FaTruck />,
          label: "Approved Orders",
        },
        { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
      ];
    case "buyer":
    default: // যদি রোল না থাকে, ডিফল্ট হিসেবে ক্রেতার মেনু
      return [
        { path: "my-orders", icon: <FaClipboardList />, label: "My Orders" },
        { path: "track-order", icon: <FaTruck />, label: "Track Order" },
        { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
      ];
  }
};

const DashboardLayout = () => {
  // AuthProvider থেকে ব্যবহারকারীর তথ্য (ইউজারের রোল পেতে)
  const { user } = useAuth();

  // মনে রাখবেন: Firebase Auth থেকে প্রাপ্ত user অবজেক্টে সরাসরি 'role' থাকে না।
  // MongoDB থেকে ইউজার ডেটা লোড করার পর role পাবেন।
  // আপাতত একটি ডামি রোল ব্যবহার করছি:
  const userRole = "manager"; // এখানে user.role ব্যবহার করতে হবে (যা MongoDB থেকে লোড করতে হবে)

  const dashboardLinks = getDashboardLinks(userRole);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ১. হেডার/নভবার - ড্যাশবোর্ডের জন্যেও নববার দরকার */}
      <Navbar />

      {/* ২. ড্যাশবোর্ডের মূল বডি */}
      <div className="drawer lg:drawer-open flex-grow">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        {/* ২.১. কন্টেন্ট এরিয়া (প্রধান ভাগ) */}
        <div className="drawer-content flex flex-col items-center justify-start p-4 bg-base-100">
          {/* মোবাইল স্ক্রিনের জন্য সাইডবার টগল বাটন */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden mb-4 self-start"
          >
            Open Dashboard Menu
          </label>

          {/* ড্যাশবোর্ডের ভেতরের পেজগুলি এখানে রেন্ডার হবে */}
          <main className="w-full max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>

        {/* ২.২. সাইডবার (ড্যাশবোর্ড মেনু) */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
            <h2 className="text-xl font-bold mb-4 text-center border-b pb-2">
              {userRole.toUpperCase()} Dashboard
            </h2>

            {/* রোল-ভিত্তিক নেভিগেশন লিঙ্কগুলি */}
            {dashboardLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-content font-bold"
                      : "hover:bg-base-300"
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* মূল সাইটে ফেরার জন্য একটি লিঙ্ক */}
            <div className="divider"></div>
            <li>
              <NavLink to="/">
                <FaUserEdit />
                Back to Home
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
