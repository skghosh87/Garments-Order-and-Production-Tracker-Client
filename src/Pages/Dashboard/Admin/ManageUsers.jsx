import { useEffect, useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  /* ================= Fetch Users ================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/v1/users`,
        {
          params: { search, role: roleFilter, page, limit },
          withCredentials: true,
        }
      );

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  /* ================= Update Role ================= */
  const handleRoleChange = async (id, role) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/users/role/${id}`,
        { role },
        { withCredentials: true }
      );

      Swal.fire("Updated!", "User role updated", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  /* ================= Suspend User ================= */
  const handleSuspend = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: "Suspend User",
      html: `
        <input id="reason" class="swal2-input" placeholder="Suspend reason">
        <textarea id="feedback" class="swal2-textarea" placeholder="Feedback for user"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          reason: document.getElementById("reason").value,
          feedback: document.getElementById("feedback").value,
        };
      },
      showCancelButton: true,
      confirmButtonText: "Suspend",
    });

    if (!formValues?.reason || !formValues?.feedback) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/users/suspend/${user._id}`,
        {
          status: "suspended",
          ...formValues,
        },
        { withCredentials: true }
      );

      Swal.fire("Suspended", "User has been suspended", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to suspend user", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="buyer">Buyer</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={u.email === user?.email}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="select select-sm select-bordered"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="buyer">Buyer</option>
                  </select>
                </td>
                <td>
                  <span
                    className={`badge ${
                      u.status === "active" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  {u.status === "active" && (
                    <button
                      onClick={() => handleSuspend(u)}
                      className="btn btn-xs btn-error"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num + 1)}
            className={`btn btn-sm ${
              page === num + 1 ? "btn-success" : "btn-outline"
            }`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
