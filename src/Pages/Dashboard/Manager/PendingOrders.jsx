import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaHourglassHalf,
  FaBoxOpen,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_SERVER_API;

  /* ================= Fetch Only This Manager's Pending Orders ================= */
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/orders/pending`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Could not load pending orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  /* ================= Handle Order Status Update (Approve/Reject) ================= */
  const handleStatusUpdate = async (id, action) => {
    const isApprove = action === "approve";

    const confirm = await Swal.fire({
      title: `${isApprove ? "Approve" : "Reject"} Order?`,
      text: isApprove
        ? "This will move the order to the Approved list."
        : "This will mark the order as Rejected.",
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isApprove ? "Yes, Approve it!" : "Yes, Reject it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      // ডাইনামিক এপিআই রুট: /approve/:id অথবা /reject/:id
      const res = await axios.patch(
        `${API_URL}/api/v1/orders/${action}/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire(
          isApprove ? "Approved!" : "Rejected!",
          `Order has been ${
            isApprove ? "confirmed" : "cancelled"
          } successfully.`,
          "success"
        );
        // লিস্ট থেকে ওই অর্ডারটি সরিয়ে ফেলা (ফিল্টার করে)
        setOrders(orders.filter((order) => order._id !== id));
      }
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire("Error", "Failed to update order status.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-5xl text-yellow-500" />
        <p className="text-gray-500 font-medium italic">
          Scanning for new orders...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8 border-b pb-5">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <FaHourglassHalf className="text-2xl text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Pending Orders
          </h1>
          <p className="text-sm text-gray-500">
            Awaiting your approval to start production
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Hooray! No pending orders at the moment.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="table w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-gray-700 dark:text-gray-200 uppercase text-[12px] tracking-wider">
                <th className="py-4 px-6 text-left">#</th>
                <th className="py-4 px-6 text-left">Buyer</th>
                <th className="py-4 px-6 text-left">Product Info</th>
                <th className="py-4 px-6 text-center">Qty</th>
                <th className="py-4 px-6 text-right">Total Price</th>
                <th className="py-4 px-6 text-center">Decision</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-yellow-50/30 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {order.buyerName || "Client"}
                      </span>
                      <span className="text-[10px] text-gray-500 italic">
                        {order.buyerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-green-700 dark:text-green-400">
                        {order.productName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ID: {order.productId}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-gray-700 dark:text-gray-300">
                    {order.orderQuantity || order.quantity}{" "}
                    <span className="text-[10px] font-normal text-gray-400">
                      PCS
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-gray-900 dark:text-white">
                    ${order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleStatusUpdate(order._id, "approve")}
                        className="p-2 bg-green-100 hover:bg-green-600 text-green-600 hover:text-white rounded-full transition-all shadow-sm group"
                        title="Approve Order"
                      >
                        <FaCheck className="text-sm group-hover:scale-125 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order._id, "reject")}
                        className="p-2 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-full transition-all shadow-sm group"
                        title="Reject Order"
                      >
                        <FaTimes className="text-sm group-hover:scale-125 transition-transform" />
                      </button>
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

export default PendingOrders;
