import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  FaSpinner,
  FaClipboardList,
  FaSearch,
  FaEye,
  FaUserCircle,
  FaBox,
} from "react-icons/fa";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/admin/all-orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // সার্চ এবং ফিল্টার লজিক
  useEffect(() => {
    let result = orders;

    if (filterStatus !== "All") {
      result = result.filter(
        (order) => order.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, filterStatus, orders]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/orders/status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", `Status is now ${newStatus}`, "success");
        fetchAllOrders();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-black text-gray-800 uppercase italic">
            All Orders Management
          </h1>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Email..."
              className="input input-bordered pl-10 w-full md:w-64 h-10"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="select select-bordered h-10 min-h-0"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase font-black">
            <tr>
              <th className="py-4">Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="font-mono text-[10px] text-blue-600 font-bold">
                  #{order._id.slice(-8).toUpperCase()}
                </td>
                <td>
                  <div className="text-xs">
                    <p className="font-bold text-gray-700">
                      {order.buyerEmail}
                    </p>
                  </div>
                </td>
                <td className="text-xs font-bold uppercase">
                  {order.productName}
                </td>
                <td className="text-center font-bold">{order.quantity}</td>
                <td className="text-center">
                  <span
                    className={`badge badge-sm font-bold uppercase text-[9px] ${
                      order.status === "pending"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* View Button: Redirects to detailed tracking page */}
                    <Link
                      to={`/dashboard/order-details/${order._id}`}
                      className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-100"
                    >
                      <FaEye className="mr-1" /> View
                    </Link>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="select select-bordered select-xs text-[10px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
