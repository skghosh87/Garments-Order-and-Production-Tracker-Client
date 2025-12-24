import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserShield, FaEdit, FaCheckCircle, FaBan } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tempRole, setTempRole] = useState("");
  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      if (err.response?.status === 403) {
        Swal.fire(
          "Access Denied",
          "You do not have Admin permissions.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setTempRole(user.role);
    document.getElementById("update_role_modal").showModal();
  };

  const handleUpdateRole = async () => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/role/${selectedUser._id}`,
        { role: tempRole },
        { withCredentials: true }
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `User role updated to ${tempRole}`, "success");
        document.getElementById("update_role_modal").close();
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Role update failed", "error");
    }
  };

  // স্ট্যাটাস আপডেট করার ফাংশন (Verified / Suspended)
  const handleStatusUpdate = async (user, newStatus) => {
    if (user.email === currentUser?.email && newStatus === "suspended") {
      return Swal.fire(
        "Action Denied",
        "You cannot suspend your own account!",
        "warning"
      );
    }

    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/users/status/${user._id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated", `User status is now ${newStatus}`, "success");
        fetchUsers();
      }
    } catch (err) {
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <FaUserShield className="text-3xl text-green-600" />
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
          Manage All Users
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2">
          <thead className="bg-gray-100 text-gray-700 uppercase text-[12px] font-bold">
            <tr>
              <th className="rounded-l-xl">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-400 italic"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u.email === currentUser?.email;
                return (
                  <tr
                    key={u._id}
                    className="bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
                  >
                    <td className="font-bold text-gray-800">
                      {u.displayName || u.name || "N/A"}
                      {isSelf && (
                        <span className="badge badge-sm badge-ghost ml-1">
                          You
                        </span>
                      )}
                    </td>
                    <td className="text-gray-500 font-medium">{u.email}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "manager"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    {/* স্ট্যাটাস ব্যাজ */}
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          u.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : u.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status || "pending"}
                      </span>
                    </td>
                    <td className="flex justify-center gap-2 py-4">
                      {/* ভেরিফাই বাটন - শুধুমাত্র পেন্ডিং ইউজারদের জন্য */}
                      {u.status === "pending" && (
                        <button
                          onClick={() => handleStatusUpdate(u, "verified")}
                          className="btn btn-xs btn-success text-white px-3 flex items-center gap-1"
                        >
                          <FaCheckCircle /> Verify
                        </button>
                      )}

                      {/* আপডেট রোল বাটন */}
                      <button
                        onClick={() => openModal(u)}
                        disabled={isSelf}
                        className="btn btn-xs btn-outline btn-primary flex items-center gap-1"
                      >
                        <FaEdit /> Update
                      </button>

                      {/* সাসপেন্ড বা একটিভেট বাটন */}
                      {u.status === "suspended" ? (
                        <button
                          onClick={() => handleStatusUpdate(u, "verified")}
                          className="btn btn-xs btn-outline btn-success px-3"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(u, "suspended")}
                          disabled={isSelf}
                          className="btn btn-xs btn-error text-white px-3 flex items-center gap-1"
                        >
                          <FaBan /> Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DaisyUI Modal */}
      <dialog
        id="update_role_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
            Modify User Permissions
          </h3>
          <p className="py-4 text-sm text-gray-600">
            Target User:{" "}
            <span className="font-bold text-blue-600">
              {selectedUser?.email}
            </span>
          </p>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold uppercase text-[12px] text-gray-500">
                Assign New Role
              </span>
            </label>
            <select
              className="select select-bordered w-full font-bold"
              value={tempRole}
              onChange={(e) => setTempRole(e.target.value)}
            >
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button
              onClick={handleUpdateRole}
              className="btn btn-primary text-white px-8"
            >
              Update Now
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageUsers;
