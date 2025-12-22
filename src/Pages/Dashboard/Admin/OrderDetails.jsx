import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaBox,
  FaUser,
  FaHistory,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  // তারিখ ফরম্যাট করার ফাংশন (Moment এর বিকল্প)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/orders/details/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, API_URL]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  if (!order)
    return (
      <div className="text-center mt-20 font-bold text-red-500">
        Order not found!
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl shadow-sm transition-all mb-8 border border-gray-200 font-semibold text-sm"
      >
        <FaArrowLeft /> Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Order & User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  Order Details
                </span>
                <h2 className="text-3xl font-black text-gray-900 mt-2">
                  #{order._id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-gray-400 text-xs font-medium mt-1">
                  Placed on: {formatDate(order.createdAt)}
                </p>
              </div>
              <div
                className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-tighter ${
                  order.status === "pending"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {order.status}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                <FaBox className="text-4xl text-blue-500" />
              </div>
              <div className="text-center md:text-left flex-grow">
                <h3 className="text-xl font-bold text-gray-800">
                  {order.productName}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                  <p className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-lg">
                    Qty: <span className="text-gray-900">{order.quantity}</span>
                  </p>
                  <p className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-lg">
                    Total:{" "}
                    <span className="text-blue-600">${order.totalPrice}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaUser className="text-blue-600" />
              </div>
              <h3 className="font-black text-gray-800 uppercase text-sm tracking-wider">
                Customer Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Email Address
                </p>
                <p className="font-bold text-gray-700">{order.buyerEmail}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Payment Method
                </p>
                <p className="font-bold text-emerald-600 flex items-center gap-2">
                  <FaCheckCircle /> Stripe Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tracking History (Timeline) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaHistory className="text-blue-600" />
            </div>
            <h3 className="font-black text-gray-800 uppercase text-sm tracking-wider">
              Order Timeline
            </h3>
          </div>

          <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
            {order.trackingHistory && order.trackingHistory.length > 0 ? (
              order.trackingHistory.map((step, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col">
                    <p className="font-black text-gray-800 uppercase text-[11px] tracking-wide">
                      {step.status}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      {formatDate(step.time)}
                    </p>
                    {step.comment && (
                      <p className="text-xs text-blue-500 bg-blue-50 p-2 rounded-lg mt-2 border border-blue-100 italic">
                        "{step.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                <div className="flex flex-col">
                  <p className="font-black text-gray-800 uppercase text-[11px] tracking-wide">
                    Order {order.status}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {formatDate(order.updatedAt || order.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
