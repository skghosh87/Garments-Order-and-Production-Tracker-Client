import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaClipboardList,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // স্ট্যাটাস আপডেট ফাংশন
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/orders/status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0 || res.data.success) {
        Swal.fire({
          title: "Updated!",
          text: `Order is now ${newStatus}`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchAllOrders(); // ডেটা রিফ্রেশ
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">
          Fetching global orders...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <FaClipboardList className="text-3xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
              System Orders
            </h1>
            <p className="text-sm text-gray-500">
              Monitor and manage all transactions
            </p>
          </div>
        </div>

        <div className="stats shadow bg-gray-50 dark:bg-gray-700">
          <div className="stat py-2 px-6">
            <div className="stat-title text-xs font-bold uppercase">
              Total Revenue
            </div>
            <div className="stat-value text-2xl text-blue-600">
              $
              {orders
                .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-400 text-xl italic font-light">
            No orders have been recorded yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="table w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-gray-600 dark:text-gray-200 uppercase text-[11px] font-black tracking-widest">
                <th className="py-4">Buyer</th>
                <th className="py-4">Product</th>
                <th className="py-4 text-center">Qty</th>
                <th className="py-4 text-right">Revenue</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 text-center">Actions</th>
                <th className="py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-blue-50/30 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td>
                    <div className="flex items-center gap-2">
                      {/* সমাধান ১: ছবি দেখানো */}
                      {order.buyerPhoto || order.photoURL ? (
                        <img
                          src={order.buyerPhoto || order.photoURL}
                          alt="Buyer"
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <FaUserCircle className="text-gray-300 text-2xl" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {order.buyerEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 dark:text-white uppercase text-xs">
                        {order.productName}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400">
                        ID: {order._id.slice(-6)}
                      </span>
                    </div>
                  </td>
                  <td className="text-center font-bold">{order.quantity}</td>
                  <td className="text-right font-black text-blue-600">
                    ${order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge badge-sm font-bold py-3 px-4 text-[10px] uppercase border-none ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="select select-bordered select-xs w-full max-w-[120px] focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="text-[9px]" />
                        {/* সমাধান ২: তারিখ ফিক্স */}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;