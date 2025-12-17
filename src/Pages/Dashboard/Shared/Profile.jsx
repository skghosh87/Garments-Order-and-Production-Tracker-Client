import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserEdit, FaEnvelope, FaUserShield, FaCamera } from "react-icons/fa";

const Profile = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ইনপুট ফিল্ডের জন্য স্টেট
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  const API_URL = import.meta.env.VITE_SERVER_API;

  // ইউজার লোড হলে ফর্ম ডাটা সেট করা
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || "",
      });
    }
  }, [user]);

  /* ================= Profile Update Handler ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ৪০১ এরর এড়াতে withCredentials: true যুক্ত করা হয়েছে
      const res = await axios.patch(
        `${API_URL}/api/v1/users/update-profile`,
        {
          email: user?.email, // কোন ইউজার আপডেট হবে তার আইডেন্টিটি
          displayName: formData.displayName,
          photoURL: formData.photoURL,
        },
        { withCredentials: true } // এটি কুকি টোকেন পাঠানোর জন্য বাধ্যতামূলক
      );

      if (res.data.modifiedCount > 0 || res.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated. Please refresh to see changes in Navbar.",
          icon: "success",
          confirmButtonColor: "#10B981",
        });
        setIsEditing(false);
      } else {
        Swal.fire("No Changes", "You didn't change any information.", "info");
      }
    } catch (err) {
      console.error("Update Error:", err);
      // ৪০১ এরর হলে ইউজারকে লগইন করার পরামর্শ দেওয়া
      const message =
        err.response?.status === 401
          ? "Session expired. Please logout and login again."
          : "Failed to update profile.";
      Swal.fire("Error", message, "error");
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
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-gray-100"
                src={
                  formData.photoURL ||
                  "https://i.ibb.co/2kRrFqG/default-avatar.png"
                }
                alt="Profile"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera className="text-white text-xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-10 px-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {user?.displayName || "User Name"}
              </h2>
              <span className="mt-2 inline-block px-4 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-widest">
                {userRole || "Buyer"}
              </span>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline btn-sm gap-2 rounded-lg cursor-pointer hover:bg-indigo-600 border-indigo-500 text-indigo-600 hover:text-white"
            >
              <FaUserEdit /> {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing ? (
            /* ================= View Mode ================= */
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-indigo-500">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Email
                    </p>
                    <p className="text-gray-700 font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-green-500">
                    <FaUserShield size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Role Access
                    </p>
                    <p className="text-gray-700 font-medium capitalize">
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= Edit Mode ================= */
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label font-semibold text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="input input-bordered focus:outline-indigo-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label font-semibold text-gray-600">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) =>
                      setFormData({ ...formData, photoURL: e.target.value })
                    }
                    className="input input-bordered focus:outline-indigo-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success text-white px-10 shadow-lg cursor-pointer flex-1 md:flex-none"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost flex-1 md:flex-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
