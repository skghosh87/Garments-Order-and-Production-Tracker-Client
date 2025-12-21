import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUsersCog,
  FaSearch,
  FaUserSlash,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/users?search=${search}`, {
        withCredentials: true,
      });
      // ডাটাবেজ থেকে আসা ডাটা চেক করার জন্য নিচের লাইনটি দেখুন (Console-এ)
      console.log("Fetched Users Data:", res.data);
      const userData = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(userData);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      Swal.fire("Error", "Could not load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

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
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  const handleVerifyStatus = async (id) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/status/${id}`,
        { status: "verified" },
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Verified!", "User has been approved.", "success");
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to verify user", "error");
    }
  };

  const handleSuspend = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: `Suspend: ${user.name || "User"}`,
      html: `
        <input id="reason" class="swal2-input" placeholder="Reason">
        <textarea id="feedback" class="swal2-textarea" placeholder="Feedback"></textarea>
      `,
      showCancelButton: true,
      preConfirm: () => {
        const reason = document.getElementById("reason").value;
        const feedback = document.getElementById("feedback").value;
        if (!reason || !feedback) Swal.showValidationMessage("Fields required");
        return { reason, feedback };
      },
    });

    if (formValues) {
      try {
        const res = await axios.patch(
          `${API_URL}/api/v1/users/suspend/${user._id}`,
          { reason: formValues.reason, feedback: formValues.feedback },
          { withCredentials: true }
        );
        if (res.data.modifiedCount > 0) {
          Swal.fire("Suspended!", "Action successful.", "success");
          fetchUsers();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to suspend", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10">
        <FaSpinner className="animate-spin text-4xl inline" />
      </div>
    );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUsersCog /> User Management
        </h2>
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-72"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th>User Information</th>
              <th>System Role</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              // কন্ডিশন চেক করার আগে এখানে একবার কনসোল লগ দিয়ে দেখুন
              // console.log(`User: ${u.email}, Status: ${u.status}`);

              return (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={
                              u.photoURL ||
                              "https://i.ibb.co/0QZCv5C/default-avatar.png"
                            }
                            alt="avatar"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {u.name || u.displayName}
                        </div>
                        <div className="text-xs opacity-50">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      defaultValue={u.role}
                      disabled={u.email === currentUser?.email}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="select select-sm select-bordered"
                    >
                      <option value="Buyer">Buyer</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge badge-sm p-3 font-bold ${
                        u.status === "verified"
                          ? "badge-success"
                          : u.status === "suspended"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex flex-col gap-2 items-center">
                      {/* এই অংশটি খেয়াল করুন - কন্ডিশন একদম সহজ করে দেওয়া হয়েছে */}
                      {String(u.status).trim() === "pending" && (
                        <button
                          onClick={() => handleVerifyStatus(u._id)}
                          className="btn btn-xs btn-success text-white w-24"
                        >
                          <FaCheckCircle /> Verify
                        </button>
                      )}

                      {u.email !== currentUser?.email &&
                        (u.status !== "suspended" ? (
                          <button
                            onClick={() => handleSuspend(u)}
                            className="btn btn-xs btn-outline btn-error w-24"
                          >
                            <FaUserSlash /> Suspend
                          </button>
                        ) : (
                          <span className="text-xs text-error font-bold">
                            Suspended
                          </span>
                        ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
