import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCut, FaTshirt, FaCheckDouble, FaBoxOpen, FaTruck, FaMapMarkerAlt, FaHistory } from "react-icons/fa";
import { GiSewingMachine } from "react-icons/gi";

const TrackOrder = () => {
  const { orderId } = useParams(); // URL থেকে orderId নেওয়া হচ্ছে
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const res = await axiosSecure.get(`/api/v1/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Tracking Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingInfo();
  }, [orderId, axiosSecure]);

  // রিকোয়ারমেন্ট অনুযায়ী ধাপসমূহ
  const trackingSteps = [
    { label: "Cutting Completed", icon: <FaCut />, status: "cutting" },
    { label: "Sewing Started", icon: <GiSewingMachine />, status: "sewing" },
    { label: "Finishing", icon: <FaTshirt />, status: "finishing" },
    { label: "QC Checked", icon: <FaCheckDouble />, status: "qc" },
    { label: "Packed", icon: <FaBoxOpen />, status: "packed" },
    { label: "Shipped / Out for Delivery", icon: <FaTruck />, status: "shipped" },
  ];

  // বর্তমান স্ট্যাটাস ইনডেক্স বের করা
  const currentStatusIndex = trackingSteps.findIndex(
    (step) => step.status === (order?.status?.toLowerCase() || "cutting")
  );

  if (loading) return <div className="p-20 text-center text-blue-600 font-bold">Loading Timeline...</div>;
  if (!order) return <div className="p-20 text-center text-red-500 font-bold">Order Not Found!</div>;

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl min-h-screen border border-gray-50">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Order Tracking</h1>
          <p className="text-xs font-bold text-blue-500 uppercase mt-1">Order ID: #{orderId}</p>
        </div>
        <div className="text-right">
          <span className="badge badge-lg bg-emerald-100 text-emerald-700 border-none font-black text-[10px] uppercase px-4 py-4">
            Live Updates
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Timeline View - Chronological Order */}
        <div className="lg:col-span-2 space-y-8 relative">
          {trackingSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isLatest = index === currentStatusIndex;

            return (
              <div key={index} className={`flex gap-6 relative ${isLatest ? 'scale-105 origin-left transition-transform' : ''}`}>
                {/* Connector Line */}
                {index !== trackingSteps.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-full -z-0 ${isCompleted ? 'bg-blue-500' : 'bg-gray-100'}`}></div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl z-10 shadow-sm transition-colors duration-500 ${
                  isCompleted ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gray-50 text-gray-300'
                }`}>
                  {step.icon}
                </div>

                {/* Step Details */}
                <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                  isLatest ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-black text-sm uppercase ${isCompleted ? 'text-gray-800' : 'text-gray-300'}`}>
                      {step.label}
                    </h3>
                    {isCompleted && (
                      <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                        <FaHistory /> {order.updateTime || "Just Now"}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {isCompleted ? `Update from ${order.location || "Production Unit-A"}` : "Waiting for completion..."}
                  </p>
                  {isLatest && order.notes && (
                    <div className="mt-3 p-2 bg-white rounded-lg border border-blue-100 text-[10px] italic text-blue-700">
                      Note: {order.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Map & Order Summary */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-3xl p-6 text-white overflow-hidden relative min-h-[300px]">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" /> Current Location
              </h3>
              <p className="text-2xl font-bold mb-2">{order.currentLocation || "Dhaka, Bangladesh"}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Delivery: Dec 28, 2025</p>
            </div>
            {/* Interactive Map Placeholder */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Dhaka&zoom=13&size=600x300&key=YOUR_API_KEY')] bg-cover"></div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
            <h3 className="font-black uppercase text-xs mb-6 border-b border-blue-400 pb-4">Product Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase opacity-70">Item Name</span>
                <span className="text-xs font-black">{order.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase opacity-70">Quantity</span>
                <span className="text-xs font-black">{order.quantity} Pcs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;