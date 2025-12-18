import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner, FaUsersCog, FaSearch, FaUserSlash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/users`, {
        params: { search, role: roleFilter, page, limit },
        withCredentials: true,
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  const handleRoleChange = async (id, role) => {
    try {
      await axios.patch(
        `${API_URL}/api/v1/users/role/${id}`,
        { role },
        { withCredentials: true }
      );
      Swal.fire("Success!", "User role has been updated.", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to update role.", "error");
    }
  };

  const handleSuspend = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: `<span class="text-red-600">Suspend ${user.name}</span>`,
      html: `
        <div class="flex flex-col gap-3">
          <input id="reason" class="swal2-input m-0 w-full" placeholder="Reason (e.g. Policy Violation)">
          <textarea id="feedback" class="swal2-textarea m-0 w-full" placeholder="Internal Feedback for the user"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm Suspension",
      confirmButtonColor: "#d33",
      preConfirm: () => ({
        reason: document.getElementById("reason").value,
        feedback: document.getElementById("feedback").value,
      }),
    });

    if (formValues) {
      if (!formValues.reason || !formValues.feedback) {
        return Swal.fire(
          "Required",
          "Please provide both reason and feedback",
          "error"
        );
      }
      try {
        await axios.patch(
          `${API_URL}/api/v1/users/suspend/${user._id}`,
          { status: "suspended", ...formValues },
          { withCredentials: true }
        );
        Swal.fire("Suspended!", "User access has been restricted.", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Error", "Failed to suspend user.", "error");
      }
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
        <p className="text-gray-500 font-medium italic text-lg">
          Loading global user database...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FaUsersCog className="text-2xl text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Management
          </h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered pl-10 w-full md:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="select select-bordered"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
        <table className="table w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-gray-600 dark:text-gray-200 uppercase text-xs font-bold">
              <th>User Info</th>
              <th>Role Assignment</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <td>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-gray-100">
                      {u.name}
                    </span>
                    <span className="text-xs text-gray-400 font-mono italic">
                      {u.email}
                    </span>
                  </div>
                </td>
                <td>
                  <select
                    value={u.role}
                    disabled={u.email === currentUser?.email}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="select select-sm select-bordered font-semibold capitalize"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="buyer">Buyer</option>
                  </select>
                </td>
                <td className="text-center">
                  <span
                    className={`badge font-bold p-3 border-none text-white ${
                      u.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="text-center">
                  {u.status === "active" && u.email !== currentUser?.email ? (
                    <button
                      onClick={() => handleSuspend(u)}
                      className="btn btn-xs btn-error text-white hover:scale-110"
                    >
                      <FaUserSlash className="mr-1" /> Suspend
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300 italic">
                      No Action
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 join">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num + 1)}
              className={`join-item btn btn-md ${
                page === num + 1 ? "btn-primary shadow-lg" : "btn-ghost"
              }`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
