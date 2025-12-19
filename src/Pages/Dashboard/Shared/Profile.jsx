import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUserEdit,
  FaEnvelope,
  FaUserShield,
  FaCamera,
  FaExclamationTriangle,
} from "react-icons/fa";

const Profile = () => {
  // আপনার useAuth হুকে userStatus, suspendReason এবং suspendFeedback যোগ করে নিন
  const { user, userRole, userStatus, suspendReason, suspendFeedback } =
    useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  const API_URL = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || "",
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // সিকিউরিটি চেক: সাসপেন্ডেড ইউজার আপডেট করতে পারবে না
    if (userStatus === "suspended") {
      Swal.fire(
        "Access Denied",
        "Suspended accounts cannot update profile information.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-profile`,
        {
          email: user?.email,
          displayName: formData.displayName,
          photoURL: formData.photoURL,
        },
        { withCredentials: true }
      );

      if (res.data.modifiedCount > 0 || res.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully.",
          icon: "success",
          confirmButtonColor: "#10B981",
        });
        setIsEditing(false);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Banner */}
        <div className="h-40 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 relative">
          <div className="absolute -bottom-16 left-10">
            <div className="relative group">
              <img
                className={`w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-gray-100 ${
                  userStatus === "suspended" ? "grayscale" : ""
                }`}
                src={
                  formData.photoURL ||
                  "https://i.ibb.co/2kRrFqG/default-avatar.png"
                }
                alt="Profile"
              />
            </div>
          </div>
        </div>

        <div className="pt-20 pb-10 px-10">
          {/* CHALLENGE: Suspended Feedback Section */}
          {userStatus === "suspended" && (
            <div className="mb-8 p-5 bg-red-50 border-l-8 border-red-500 rounded-r-2xl animate-pulse">
              <div className="flex items-start gap-4">
                <FaExclamationTriangle
                  className="text-red-500 mt-1"
                  size={24}
                />
                <div>
                  <h3 className="text-lg font-bold text-red-800">
                    Your Account is Suspended
                  </h3>
                  <p className="text-red-700 font-medium mt-1">
                    <span className="font-bold">Reason:</span>{" "}
                    {suspendReason || "Policy Violation"}
                  </p>
                  {suspendFeedback && (
                    <p className="text-red-600 text-sm mt-2 bg-white/50 p-2 rounded-lg italic">
                      Admin Feedback: {suspendFeedback}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {user?.displayName || "User"}
              </h2>
              <div className="flex gap-2 mt-2">
                <span className="px-4 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-widest">
                  {userRole}
                </span>
                <span
                  className={`px-4 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${
                    userStatus === "suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {userStatus}
                </span>
              </div>
            </div>

            {/* সাসপেন্ডেড হলে এডিট বাটন হাইড অথবা ডিজেবল রাখা ভালো */}
            {userStatus !== "suspended" && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline btn-sm gap-2 rounded-lg border-indigo-500 text-indigo-600"
              >
                <FaUserEdit /> {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            )}
          </div>

          {!isEditing ? (
            /* View Mode */
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg text-indigo-500 shadow-sm">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">EMAIL</p>
                    <p className="text-gray-700 font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg text-green-500 shadow-sm">
                    <FaUserShield size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">STATUS</p>
                    <p className="text-gray-700 font-medium capitalize">
                      {userStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form
              onSubmit={handleUpdate}
              className="space-y-6 animate-in slide-in-from-bottom-5"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="input input-bordered focus:ring-2 ring-indigo-500"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Photo URL</label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) =>
                      setFormData({ ...formData, photoURL: e.target.value })
                    }
                    className="input input-bordered focus:ring-2 ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-success text-white px-8"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
