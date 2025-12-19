import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUsersCog,
  FaSearch,
  FaUserSlash,
  FaSpinner,
  FaUserShield,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { user: currentUser } = useAuth(); // Logged-in admin info
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_SERVER_API;

  /* ================= 1. Fetch Users Dynamically ================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/users`, {
        withCredentials: true,
      });
      // Logic to handle both array and paginated object responses
      const userData = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(userData);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      Swal.fire("Error", "Could not load users from database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  /* ================= 2. Handle Role Change ================= */
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/role/${id}`,
        { role: newRole },
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", `User role is now ${newRole}`, "success");
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update user role", "error");
    }
  };

  /* ================= 3. Handle Suspension with Reason ================= */
  const handleSuspend = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: `<span style="color: #d33">Suspend: ${
        user.displayName || "User"
      }</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <label style="font-weight: bold; display: block; margin-bottom: 5px;">Suspension Reason:</label>
          <input id="reason" class="swal2-input" style="margin: 0; width: 100%;" placeholder="e.g., Fraudulent Activity">
          
          <label style="font-weight: bold; display: block; margin-top: 15px; margin-bottom: 5px;">Internal Feedback:</label>
          <textarea id="feedback" class="swal2-textarea" style="margin: 0; width: 100%; height: 80px;" placeholder="Message for the user profile..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm Suspension",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      preConfirm: () => {
        const reason = document.getElementById("reason").value;
        const feedback = document.getElementById("feedback").value;
        if (!reason || !feedback) {
          Swal.showValidationMessage(
            "Please provide both a reason and feedback"
          );
        }
        return { reason, feedback };
      },
    });

    if (formValues) {
      try {
        const res = await axios.patch(
          `${API_URL}/api/v1/users/suspend/${user._id}`,
          {
            reason: formValues.reason,
            feedback: formValues.feedback,
          },
          { withCredentials: true }
        );
        if (res.data.modifiedCount > 0) {
          Swal.fire(
            "Suspended!",
            "User access restricted successfully.",
            "success"
          );
          fetchUsers();
        }
      } catch (err) {
        Swal.fire("Error", "Action failed. Check server logs.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-2" />
        <p className="text-gray-500">Syncing with database...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <FaUsersCog className="text-2xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Management
          </h2>
        </div>

        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered w-full pl-10 h-11"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <th>User Information</th>
              <th>System Role</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-indigo-100 text-indigo-600 rounded-full w-10">
                        <span className="text-xs">
                          {u.displayName?.charAt(0) || "U"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">
                        {u.displayName}
                      </div>
                      <div className="text-xs opacity-50 font-mono">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <select
                    defaultValue={u.role}
                    disabled={u.email === currentUser?.email}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="select select-sm select-bordered font-medium"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="text-center">
                  <span
                    className={`badge badge-sm font-bold ${
                      u.status === "suspended" ? "badge-error" : "badge-success"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="text-center">
                  {u.status !== "suspended" &&
                  u.email !== currentUser?.email ? (
                    <button
                      onClick={() => handleSuspend(u)}
                      className="btn btn-xs btn-outline btn-error hover:text-white"
                    >
                      <FaUserSlash className="mr-1" /> Suspend
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No Action Available
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
