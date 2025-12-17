import { useEffect, useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const MyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch My Orders ================= */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders/my-orders`,
        { withCredentials: true }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= Cancel Order ================= */
  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );

      Swal.fire("Cancelled!", "Order has been cancelled", "success");
      fetchOrders();
    } catch (err) {
      Swal.fire("Error", "Failed to cancel order", "error");
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
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have not placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "pending"
                          ? "badge-warning"
                          : order.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === "pending" ? (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="btn btn-xs btn-error"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
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
