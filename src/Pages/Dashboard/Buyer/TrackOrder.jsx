import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // সঠিক পাথ
import { FaSearch, FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import Swal from "sweetalert2";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    try {
      // আপনার ব্যাকএন্ডে অর্ডারের ডিটেইলস পাওয়ার রুট অনুযায়ী
      const res = await axiosSecure.get(`/api/v1/orders/${orderId}`);
      setOrderData(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Order Not Found",
        text: "Please check your Order ID and try again.",
        icon: "error",
        confirmButtonColor: "#3b82f6"
      });
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  // স্ট্যাটাস অনুযায়ী স্টেপস নির্ধারণ
  const steps = [
    { label: "Pending", icon: <FaRegClock />, color: "bg-amber-500" },
    { label: "Processing", icon: <FaBox />, color: "bg-blue-500" },
    { label: "Shipped", icon: <FaTruck />, color: "bg-indigo-500" },
    { label: "Delivered", icon: <FaCheckCircle />, color: "bg-emerald-500" },
  ];

  const currentStatusIndex = steps.findIndex(step => 
    step.label.toLowerCase() === (orderData?.status || "pending").toLowerCase()
  );

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Track Your Shipment</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Real-time Order Tracking</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleTrack} className="max-w-2xl mb-12">
        <div className="relative group">
          <input
            type="text"
            placeholder="Enter your Order ID (e.g. 64f2...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full h-16 pl-14 pr-32 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
            required
          />
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track Now"}
          </button>
        </div>
      </form>

      {/* Tracking Result */}
      {orderData && (
        <div className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Order Status Timeline */}
            <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-row md:flex-col items-center gap-4 z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-all duration-500 ${
                      index <= currentStatusIndex ? step.color : "bg-gray-200"
                    }`}>
                      {step.icon}
                    </div>
                    <div className="text-left md:text-center">
                      <p className={`text-xs font-black uppercase tracking-wider ${
                        index <= currentStatusIndex ? "text-gray-800" : "text-gray-300"
                      }`}>{step.label}</p>
                      {index <= currentStatusIndex && (
                        <p className="text-[9px] text-gray-400 font-bold">Completed</p>
                      )}
                    </div>
                  </div>
                ))}
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-200 -z-0">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white border-2 border-gray-50 rounded-3xl p-8 shadow-sm">
              <h3 className="font-black text-gray-800 uppercase text-sm mb-6 border-b pb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Product</span>
                  <span className="text-xs font-black text-gray-700">{orderData.productName || "Product Item"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</span>
                  <span className="text-sm font-black text-blue-600">${orderData.totalPrice}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <FaMapMarkerAlt /> Delivery to
                  </span>
                  <span className="text-[10px] font-bold text-gray-600 truncate max-w-[120px]">
                    {orderData.address || "Shipping Address"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {!orderData && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <FaSearch className="text-3xl text-gray-200" />
          </div>
          <h2 className="text-xl font-black text-gray-300 uppercase">No Order Selected</h2>
          <p className="text-gray-400 text-xs font-medium max-w-xs mt-2">Enter your valid Order ID above to see the current status of your garment delivery.</p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;