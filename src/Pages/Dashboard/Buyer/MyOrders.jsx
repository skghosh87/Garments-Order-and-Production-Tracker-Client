import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaEye,
  FaTrashAlt,
  FaHistory,
  FaShoppingBag,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom"; // react-router-dom নিশ্চিত করুন

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/orders/my-orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি বাতিল করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.patch(
          `${API_URL}/api/v1/orders/cancel/${orderId}`,
          {},
          { withCredentials: true }
        );
        if (res.data.modifiedCount > 0) {
          Swal.fire(
            "Cancelled!",
            "অর্ডারটি সফলভাবে বাতিল করা হয়েছে।",
            "success"
          );
          fetchOrders();
        }
      } catch (err) {
        Swal.fire("Error", "বাতিল করা সম্ভব হয়নি, আবার চেষ্টা করুন।", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-5xl text-blue-600 mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">
          Loading Orders...
        </p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-gray-50 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <FaHistory className="text-3xl text-blue-600" />
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Purchase History
          </h2>
        </div>
        <div className="px-6 py-2 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200">
          TOTAL: {orders.length}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="table w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 uppercase text-[12px] font-black border-none">
              <th className="bg-transparent">Order ID</th>
              <th className="bg-transparent">Product</th>
              <th className="bg-transparent">Quantity</th>
              <th className="bg-transparent">Status</th>
              <th className="bg-transparent">Total Price</th>
              <th className="bg-transparent text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-20 bg-gray-50 rounded-2xl"
                >
                  <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500 font-bold uppercase italic">
                    No orders found yet!
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white shadow-sm hover:shadow-md transition-all group"
                >
                  <td className="rounded-l-2xl border-y border-l border-gray-100 font-mono text-xs font-bold text-blue-600">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="border-y border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.image}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                        alt={order.productName}
                      />
                      <span className="font-bold text-gray-800 text-sm tracking-tight">
                        {order.productName}
                      </span>
                    </div>
                  </td>
                  <td className="border-y border-gray-100 font-black text-gray-500">
                    {order.orderQuantity}{" "}
                    <span className="text-[10px] uppercase">Units</span>
                  </td>
                  <td className="border-y border-gray-100">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border-y border-gray-100 font-black text-gray-800">
                    ${order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="rounded-r-2xl border-y border-r border-gray-100 text-center">
                    <div className="flex justify-center gap-3">
                      {/* View Button */}
                      <Link
                        to={`/dashboard/track-order/${order._id}`}
                        className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[11px] font-black uppercase"
                      >
                        <FaEye /> View
                      </Link>

                      {/* Cancel Button - Only show if status is pending */}
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[11px] font-black uppercase"
                        >
                          <FaTrashAlt /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
