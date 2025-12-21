import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSpinner,
  FaDollarSign,
  FaTags,
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
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("দুঃখিত! এই প্রোডাক্টটির কোনো তথ্য পাওয়া যায়নি।");
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
        <FaSpinner className="text-5xl text-green-500 animate-spin" />
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
        <h2 className="text-2xl font-bold text-red-500">
          {error || "Product Not Found"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition"
        >
          <FaChevronLeft /> Go Back
        </button>
      </div>
    );
  }

  const {
    name,
    image,
    price,
    category,
    quantity,
    description,
    minOrderQty,
    paymentOptions,
  } = product;

  // --- কন্ডিশনাল লজিক (নিরাপদ এবং Case-insensitive আপডেট) ---
  const currentRole = userRole?.toLowerCase();
  const currentStatus = userStatus?.toLowerCase();

  const isBuyer = currentRole === "buyer";
  const isAuthorized =
    currentStatus === "verified" || currentStatus === "approved";
  const isSuspended = currentStatus === "suspended";

  return (
    <Container className="py-12 px-4 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-center" />

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-12 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ইমেজ সেকশন */}
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-inner bg-gray-50 flex items-center justify-center border border-gray-100">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain transition duration-700 hover:scale-105"
            />
          </div>

          {/* ইনফরমেশন সেকশন */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-black text-green-600 flex items-center">
                  <FaDollarSign className="text-2xl" /> {price}
                </span>
                <span className="px-4 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black rounded-full uppercase tracking-tighter border border-green-100 dark:border-green-800">
                  {category}
                </span>
              </div>

              {/* স্টক এবং মিনিমাম অর্ডার ইনফো */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2">
                    <FaWarehouse /> Available Stock
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      quantity > 0
                        ? "text-slate-700 dark:text-slate-200"
                        : "text-red-500"
                    }`}
                  >
                    {quantity > 0 ? `${quantity} Units` : "Out of Stock"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-2">
                    <FaBoxOpen /> Minimum Order
                  </p>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                    {/* ডাটাবেজে minOrderQty থাকলে সেটি দেখাবে, না থাকলে ১ দেখাবে */}
                    {minOrderQty ? `${minOrderQty} Units` : "1 Units"}
                  </p>
                </div>
              </div>

              {/* পেমেন্ট মেথডস */}
              <div className="mb-8 p-5 bg-green-50/30 dark:bg-green-900/10 rounded-2xl border border-green-50 dark:border-green-900/20">
                <h3 className="text-xs font-bold text-green-700 dark:text-green-500 uppercase mb-3 flex items-center gap-2">
                  <FaCreditCard /> Payment Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {paymentOptions?.map((option, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-green-100 dark:border-green-800 rounded-xl text-sm font-semibold shadow-sm text-slate-700 dark:text-slate-300"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-100 pb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            </div>

            {/* বাটন লজিক (সংশোধিত) */}
            <div className="mt-4">
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg transition"
                >
                  Login to Place Order
                </button>
              ) : isSuspended ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-2xl flex items-center gap-3 font-bold">
                  <FaBan /> Your account is suspended!
                </div>
              ) : !isBuyer ? (
                <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl font-medium">
                  অর্ডার শুধুমাত্র বায়ারদের জন্য। আপনার বর্তমান রোল:{" "}
                  <span className="uppercase font-bold">{userRole}</span>
                </div>
              ) : !isAuthorized ? (
                <div className="p-4 bg-amber-100 text-amber-800 rounded-2xl font-bold text-center">
                  Your account is {userStatus}. Order will be enabled after
                  Admin Approval.
                </div>
              ) : quantity <= 0 ? (
                <button
                  disabled
                  className="w-full py-4 bg-gray-200 text-gray-500 font-bold rounded-2xl cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center py-5 bg-green-600 text-white text-xl font-black rounded-2xl hover:bg-green-700 transition shadow-xl shadow-green-100 dark:shadow-none gap-3 active:scale-95"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-2xl">
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
