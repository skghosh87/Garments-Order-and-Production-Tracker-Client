import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders/pending`,
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
    fetchPendingOrders();
  }, []);

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders/approve/${id}`,
        {},
        { withCredentials: true }
      );

      Swal.fire("Approved!", "Order approved successfully", "success");
      fetchPendingOrders();
    } catch (err) {
      Swal.fire("Error", "Failed to approve order", "error");
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders/reject/${id}`,
        {},
        { withCredentials: true }
      );

      Swal.fire("Rejected!", "Order rejected", "success");
      fetchPendingOrders();
    } catch (err) {
      Swal.fire("Error", "Failed to reject order", "error");
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
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No pending orders.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Buyer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.buyerEmail}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalPrice}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleApprove(order._id)}
                      className="btn btn-xs btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(order._id)}
                      className="btn btn-xs btn-error"
                    >
                      Reject
                    </button>
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
