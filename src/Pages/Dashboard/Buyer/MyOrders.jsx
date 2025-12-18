import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner, FaShoppingBag, FaTrashAlt } from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  /* ================= Fetch My Orders ================= */
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
    fetchOrders();
  }, []);

  /* ================= Cancel Order (Only if Pending) ================= */
  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this pending order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/orders/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
        fetchOrders(); // লিস্ট রিফ্রেশ করা
      }
    } catch (err) {
      Swal.fire("Error", "Failed to cancel order. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <FaShoppingBag className="text-2xl text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Purchase History
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500 italic text-lg">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="uppercase text-[12px]">
                <th>#</th>
                <th>Product Name</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Total Price</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="text-gray-400">{index + 1}</td>
                  <td className="font-bold text-gray-700">
                    {order.productName}
                  </td>
                  <td className="text-center">{order.quantity} pcs</td>
                  <td className="text-right font-bold text-blue-600">
                    ${order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge font-bold p-3 border-none text-white ${
                        order.status === "pending"
                          ? "bg-yellow-500"
                          : order.status === "approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {order.status === "pending" ? (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="btn btn-sm btn-error btn-outline hover:text-white transition-all flex items-center gap-1 mx-auto"
                      >
                        <FaTrashAlt className="text-xs" /> Cancel
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs italic uppercase">
                        No Action
                      </span>
                    )}
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

export default MyOrders;
