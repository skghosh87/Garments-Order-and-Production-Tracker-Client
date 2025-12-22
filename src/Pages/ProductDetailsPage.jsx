import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSpinner,
  FaDollarSign,
  FaWarehouse,
  FaShoppingCart,
  FaBan,
  FaBoxOpen,
  FaCreditCard,
  FaChevronLeft,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";

import Container from "../Components/Shared/Container";
import PlaceOrderModal from "../Components/Modals/PlaceOrderModal";
import useAuth from "../hooks/useAuth";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Auth Context থেকে ডাটা গ্রহণ
  const { user, userRole, userStatus, loading: authLoading } = useAuth();

  // স্টেট ম্যানেজমেন্ট
  const [product, setProduct] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // প্রোডাক্ট ডাটা ফেচ করা
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setDataLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/api/v1/products/${id}`
        );
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("প্রোডাক্টটি খুঁজে পাওয়া যায়নি।");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(
          "সার্ভার থেকে তথ্য আনতে সমস্যা হচ্ছে। আইডিটি সঠিক কিনা যাচাই করুন।"
        );
      } finally {
        setDataLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // লোডিং স্ক্রিন
  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] dark:bg-gray-900">
        <FaSpinner className="text-5xl text-blue-600 animate-spin" />
        <span className="mt-4 text-xl font-medium dark:text-gray-300">
          Loading Product Details...
        </span>
      </div>
    );
  }

  // এরর হ্যান্ডলিং
  if (error || !product) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Product Not Found"}
        </h2>
        <p className="text-gray-500 mb-6">Requested ID: {id}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition"
        >
          <FaChevronLeft /> Go Back
        </button>
      </div>
    );
  }

  const {
    name,
    image,
    videoUrl,
    price,
    category,
    quantity,
    description,
    minOrderQty,
    paymentOption, // আপনার ডাটাবেস অনুযায়ী (সিঙ্গুলার)
  } = product;

  // কন্ডিশনাল লজিক
  const currentRole = userRole?.toLowerCase();
  const currentStatus = userStatus?.toLowerCase();

  const isBuyer = currentRole === "buyer";
  const isAuthorized =
    currentStatus === "verified" || currentStatus === "approved";
  const isSuspended = currentStatus === "suspended";

  return (
    <Container className="py-12 px-4 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-center" />

      <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden p-6 md:p-12 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ইমেজ এবং ভিডিও সেকশন */}
          <div className="space-y-6">
            <div className="w-full h-[400px] md:h-[500px] rounded-[30px] overflow-hidden shadow-inner bg-gray-50 flex items-center justify-center border border-gray-100">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-contain transition duration-700 hover:scale-105"
              />
            </div>

            {videoUrl && (
              <div className="rounded-[30px] overflow-hidden aspect-video shadow-lg border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl.replace("watch?v=", "embed/")}
                  title="Product Demo"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
          </div>

          {/* ইনফরমেশন সেকশন */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight uppercase italic">
                {name}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
                  {category}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-blue-600 flex items-center tracking-tighter">
                  <FaDollarSign className="text-2xl" /> {price}
                </span>
              </div>

              {/* স্টক এবং মিনিমাম অর্ডার */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-2">
                    <FaWarehouse className="text-blue-500" /> Available Stock
                  </p>
                  <p
                    className={`text-xl font-black ${
                      quantity > 0
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-red-500"
                    }`}
                  >
                    {quantity > 0 ? `${quantity} Units` : "Out of Stock"}
                  </p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-2">
                    <FaBoxOpen className="text-blue-500" /> Min Order
                  </p>
                  <p className="text-xl font-black text-gray-800 dark:text-gray-200">
                    {minOrderQty || 1} Units
                  </p>
                </div>
              </div>

              {/* পেমেন্ট মেথড (আপনার ডাটাবেস ফিল্ড অনুযায়ী আপডেট করা) */}
              <div className="mb-8 p-5 bg-blue-50/30 dark:bg-blue-900/10 rounded-3xl border border-blue-50">
                <h3 className="text-[10px] font-black text-blue-700 dark:text-blue-500 uppercase mb-3 flex items-center gap-2">
                  <FaCreditCard /> Payment Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(paymentOption) ? (
                    paymentOption.map((opt, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-xs font-bold shadow-sm"
                      >
                        {opt}
                      </span>
                    ))
                  ) : (
                    <span className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-xs font-bold shadow-sm">
                      {paymentOption || "Not Specified"}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-black text-gray-800 dark:text-white mb-2 border-b pb-2 uppercase tracking-widest">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            </div>

            {/* বাটন লজিক */}
            <div className="mt-6">
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl transition uppercase tracking-widest"
                >
                  Login to Place Order
                </button>
              ) : isSuspended ? (
                <div className="p-5 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center gap-3 font-black text-sm border border-red-200 uppercase">
                  <FaBan /> Account Suspended
                </div>
              ) : !isBuyer ? (
                <div className="p-5 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl font-bold text-center text-xs uppercase">
                  Orders Restricted for {userRole}
                </div>
              ) : !isAuthorized ? (
                <div className="p-5 bg-amber-100 text-amber-800 rounded-2xl font-bold text-center text-xs">
                  Status: {userStatus.toUpperCase()}. Wait for Admin Approval.
                </div>
              ) : quantity <= 0 ? (
                <button
                  disabled
                  className="w-full py-5 bg-gray-200 text-gray-500 font-black rounded-2xl cursor-not-allowed uppercase"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center py-5 bg-blue-600 text-white text-xl font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl gap-3 active:scale-95 uppercase tracking-tighter"
                >
                  <FaShoppingCart /> Order / Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* বুকিং মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-2xl animate-in zoom-in duration-300">
            <PlaceOrderModal
              product={product}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default ProductDetailsPage;
