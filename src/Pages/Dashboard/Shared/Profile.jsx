import React from "react";

import {
  FaUserCircle,
  FaEnvelope,
  FaIdBadge,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Profile = () => {
  const { user, userRole, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "আপনি কি লগআউট করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      try {
        await logOut();
        navigate("/login");
        Swal.fire("Logged Out", "সফলভাবে লগআউট হয়েছে।", "success");
      } catch (error) {
        Swal.fire("Error", "লগআউট করতে সমস্যা হয়েছে।", "error");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* প্রোফাইল হেডার */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end -mt-16 gap-6 mb-8">
            <img
              src={
                user?.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
                {user?.displayName || "User Name"}
              </h1>
              <p className="text-blue-600 font-bold flex items-center gap-2">
                <FaShieldAlt /> {userRole?.toUpperCase() || "USER"} DASHBOARD
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white rounded-xl gap-2 px-6 transition-all font-bold"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* ইনফরমেশন কার্ডস */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                <FaUserCircle /> Personal Information
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">
                    Full Name
                  </label>
                  <p className="font-bold text-gray-800">{user?.displayName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">
                    Email Address
                  </label>
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" /> {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                <FaIdBadge /> Account Details
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">
                    Current Role
                  </label>
                  <p className="font-black text-indigo-600 uppercase tracking-tighter">
                    {userRole}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold uppercase">
                    Status
                  </label>
                  <p className="text-green-600 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>{" "}
                    Active Account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
