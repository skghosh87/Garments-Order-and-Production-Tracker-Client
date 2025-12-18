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
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";

import Container from "../Components/Shared/Container";
import PlaceOrderModal from "../Components/Modals/PlaceOrderModal";
import useAuth from "../hooks/useAuth";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Auth Context থেকে ডেটা গ্রহণ
  const { user, userRole, userStatus, loading: authLoading } = useAuth();

  // স্টেট ম্যানেজমেন্ট
  const [product, setProduct] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // প্রোডাক্ট ডেটা ফেচ করা
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
        setError("Sorry! No Information found for this product.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // লোডিং স্ক্রিন
  if (authLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] dark:bg-gray-900">
        <FaSpinner className="text-5xl text-green-500 animate-spin" />
        <span className="ml-4 text-xl dark:text-gray-300">
          Loading Product Details...
        </span>
      </div>
    );
  }

  // এরর হ্যান্ডলিং
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">
          {error || "Product Not Found"}
        </h2>
        <button onClick={() => navigate(-1)} className="mt-4 btn btn-outline">
          Go Back
        </button>
      </div>
    );
  }

  const { name, image, price, category, quantity, description } = product;

  // পারমিশন লজিক
  const isBuyer = userRole === "buyer";
  const canPlaceOrder = isBuyer && userStatus !== "suspended" && quantity > 0;
  const isSuspended = userStatus === "suspended";

  return (
    <Container className="py-16 px-4 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-6 md:p-10 border border-green-200 dark:border-green-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* ইমেজ সেকশন */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-xl bg-gray-100">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain transition duration-500 hover:scale-105"
            />
          </div>

          {/* ইনফরমেশন সেকশন */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 italic">
              {name}
            </h1>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center">
              <FaDollarSign className="mr-1" /> {price}
            </p>

            <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <p className="flex items-center text-lg">
                <FaTags className="mr-3 text-green-500" />
                <span className="font-bold mr-2">Category:</span>
                <span className="capitalize">{category}</span>
              </p>
              <p className="flex items-center text-lg">
                <FaWarehouse className="mr-3 text-green-500" />
                <span className="font-bold mr-2">Stock:</span>
                <span
                  className={
                    quantity > 0
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {quantity > 0
                    ? `${quantity} Units Available`
                    : "Out of Stock"}
                </span>
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 border-b pb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* অ্যাকশন বাটন লজিক */}
            <div className="mt-10">
              {!user ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 font-semibold text-center">
                    Please{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </span>{" "}
                    to place an order.
                  </p>
                </div>
              ) : isSuspended ? (
                <p className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2 bg-red-50 p-4 rounded-lg">
                  <FaBan /> Your account is suspended. You cannot place orders.
                </p>
              ) : !isBuyer ? (
                <p className="text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-50 p-4 rounded-lg">
                  Authorized only for Buyers. Your role:{" "}
                  <span className="uppercase">{userRole}</span>
                </p>
              ) : quantity <= 0 ? (
                <button
                  disabled
                  className="py-3 px-8 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto flex items-center justify-center py-4 px-10 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-200 gap-3"
                >
                  <FaShoppingCart /> Place Order Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* কনফার্ম পারচেজ মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* ব্যাকড্রপ/ছায়া */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* মডাল কন্টেন্ট */}
          <div className="relative z-10 w-full max-w-lg">
            <PlaceOrderModal
              product={product}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default ProductDetailsPage;
