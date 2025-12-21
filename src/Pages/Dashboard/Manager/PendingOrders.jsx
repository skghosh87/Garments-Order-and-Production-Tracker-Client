import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaCheck,
  FaTimes,
  FaEye,
  FaHourglassHalf,
} from "react-icons/fa";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  // পেন্ডিং অর্ডার ফেচ করা
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/manager/pending-orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Pending Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // ১. Approve Button লজিক (Status: Approved & timestamp logs)
  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/orders/approve/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire(
          "Approved!",
          "অর্ডারটি প্রোডাকশনের জন্য এপ্রুভ করা হয়েছে।",
          "success"
        );
        fetchPendingOrders();
      }
    } catch (err) {
      Swal.fire("Error", "এপ্রুভ করা সম্ভব হয়নি।", "error");
    }
  };

  // ২. Reject Button লজিক (Status: Rejected)
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "আপনি কি এই অর্ডারটি রিজেক্ট করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.patch(
          `${API_URL}/api/v1/orders/reject/${id}`,
          {},
          { withCredentials: true }
        );
        if (res.data.modifiedCount > 0) {
          Swal.fire("Rejected", "অর্ডারটি বাতিল করা হয়েছে।", "info");
          fetchPendingOrders();
        }
      } catch (err) {
        Swal.fire("Error", "রিজেক্ট করা সম্ভব হয়নি।", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-20">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-8 bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <FaHourglassHalf className="text-3xl text-amber-600" />
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase">
            Pending Approvals
          </h2>
          <p className="text-amber-700 text-sm font-medium italic">
            Awaiting your approval to start production
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2">
          {/* টেবিল কলামসমূহ */}
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-black tracking-widest">
            <tr>
              <th className="py-4">Order ID</th>
              <th>User (Buyer)</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-20 text-gray-400 italic"
                >
                  No pending orders at the moment.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"
                >
                  <td className="font-mono text-xs text-blue-600 font-bold">
                    #{order._id.slice(-8)}
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">
                        {order.buyerName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {order.buyerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="font-bold">{order.productName}</td>
                  <td className="font-black text-gray-600">
                    {order.orderQuantity} PCS
                  </td>
                  <td className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="flex justify-center gap-2 py-4">
                    {/* ৩. View Button */}
                    <button
                      className="btn btn-xs btn-outline btn-info"
                      title="View Details"
                    >
                      <FaEye />
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => handleApprove(order._id)}
                      className="btn btn-xs btn-success text-white"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => handleReject(order._id)}
                      className="btn btn-xs btn-error text-white"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
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

export default PendingOrders;
