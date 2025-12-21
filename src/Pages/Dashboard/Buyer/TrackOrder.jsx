import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaSpinner,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  // গার্মেন্টস প্রোডাকশনের ধাপসমূহ (আপনার রিকোয়ারমেন্ট অনুযায়ী)
  const productionSteps = [
    {
      id: "pending",
      label: "Order Placed",
      desc: "আমরা আপনার অর্ডারটি পেয়েছি।",
    },
    {
      id: "cutting",
      label: "Cutting Completed",
      desc: "ফেব্রিক কাটিং সম্পন্ন হয়েছে।",
    },
    { id: "sewing", label: "Sewing Started", desc: "সেলাইয়ের কাজ চলমান আছে।" },
    { id: "finishing", label: "Finishing", desc: "ফিনিশিং এবং আয়রনিং চলছে।" },
    {
      id: "qc",
      label: "QC Checked",
      desc: "মান নিয়ন্ত্রণ (Quality Control) যাচাই করা হয়েছে।",
    },
    {
      id: "packed",
      label: "Packed",
      desc: "শিপিংয়ের জন্য প্যাকেটজাত করা হয়েছে।",
    },
    {
      id: "shipped",
      label: "Shipped / Out for Delivery",
      desc: "পণ্যটি ডেলিভারির উদ্দেশ্যে পাঠানো হয়েছে।",
    },
  ];

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/orders/track/${orderId}`,
          {
            withCredentials: true,
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchTracking();
  }, [orderId, API_URL]);

  if (loading)
    return (
      <div className="text-center p-20">
        <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto" />
      </div>
    );
  if (!order)
    return (
      <div className="text-center p-20 font-bold text-red-500">
        Order tracking information not found!
      </div>
    );

  // বর্তমান স্ট্যাটাসের ইনডেক্স খুঁজে বের করা
  const currentStatusIndex = productionSteps.findIndex(
    (s) => s.id === order.status?.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50">
        {/* উপরের অংশ: অর্ডার তথ্য */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                Order Tracking
              </p>
              <h1 className="text-3xl font-black mt-1 uppercase">
                #{order._id.slice(-8)}
              </h1>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase italic">
                Current Status
              </p>
              <p className="font-black text-lg uppercase">{order.status}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* বাঁদিকের অংশ: টাইমলাইন ভিউ */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2">
              <FaClock className="text-blue-600" /> PRODUCTION TIMELINE
            </h3>

            <div className="relative space-y-10 px-4">
              {/* মেইন কানেক্টিং লাইন */}
              <div className="absolute left-[27px] top-2 bottom-2 w-1 bg-gray-100"></div>

              {productionSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isLatest = index === currentStatusIndex;

                return (
                  <div
                    key={step.id}
                    className="relative flex items-start gap-8 group"
                  >
                    {/* টাইমলাইন ডট/আইকন */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted
                          ? "bg-green-500 shadow-lg shadow-green-200"
                          : "bg-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <FaCheckCircle className="text-white text-sm" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>

                    {/* টাইমলাইন টেক্সট */}
                    <div
                      className={`flex-1 -mt-1 p-4 rounded-2xl transition-all ${
                        isLatest ? "bg-blue-50 border border-blue-100" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4
                          className={`font-black uppercase text-sm ${
                            isCompleted ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCompleted && (
                          <span className="text-[10px] text-gray-400 font-bold">
                            {/* ডাটাবেসে টাইম থাকলে এখানে ডাইনামিকভাবে তারিখ দেখানো যাবে */}
                            {new Date().toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isCompleted
                            ? "text-gray-600 font-medium"
                            : "text-gray-300"
                        }`}
                      >
                        {step.desc}
                      </p>
                      {isLatest && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase animate-pulse">
                          Live Update
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ডানদিকের অংশ: ম্যাপ এবং প্রোডাক্ট সামারি */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h4 className="font-black text-gray-800 uppercase text-xs mb-4 tracking-widest flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" /> Current Location
              </h4>
              {/* ইন্টারঅ্যাক্টিভ ম্যাপের জন্য এখানে আইফ্রেম বা গুগল ম্যাপস ব্যবহার করা যায় */}
              <div className="w-full h-48 bg-blue-100 rounded-2xl border-2 border-white shadow-inner flex items-center justify-center overflow-hidden">
                <img
                  src="https://media.wired.com/photos/59269abc8d859a19103d0811/master/w_2560%2Cc_limit/GoogleMap-660x440.jpg"
                  alt="Static Map Placeholder"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <p className="mt-4 text-[11px] font-bold text-gray-500 uppercase text-center">
                Location: Gazipur Factory Outlet
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl">
              <h4 className="font-black text-blue-800 uppercase text-xs mb-4 tracking-widest">
                Product Summary
              </h4>
              <div className="flex items-center gap-4">
                <img
                  src={order.image}
                  className="w-14 h-14 rounded-xl object-cover"
                  alt=""
                />
                <div>
                  <p className="font-black text-sm text-gray-800 leading-tight">
                    {order.productName}
                  </p>
                  <p className="text-xs font-bold text-blue-600 mt-1">
                    {order.orderQuantity} Units Ordered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
