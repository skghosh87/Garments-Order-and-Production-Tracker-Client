import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSpinner,
  FaBox,
  FaDollarSign,
  FaTags,
  FaWarehouse,
  FaShoppingCart,
  FaBan,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

import Container from "../Components/Shared/Container";
// import NotFound from "../Pages/NotFound";
import PlaceOrderModal from "../Components/Modals/PlaceOrderModal";
import useAuth from "../hooks/useAuth";

const ProductDetailsPage = () => {
  // 1. URL থেকে প্রোডাক্ট আইডি গ্রহণ
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Auth Context থেকে প্রয়োজনীয় স্টেট ও ফাংশন অ্যাক্সেস
  const { user, userRole, userStatus, loading: authLoading } = useAuth();

  // 3. প্রোডাক্ট ডেটা স্টেট
  const [product, setProduct] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. Modal স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);

  // প্রোডাক্ট ডেটা ফেচ করার লজিক
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return; // আইডি না থাকলে রিটার্ন

      try {
        setDataLoading(true);
        setError(null);

        // সার্ভারে একক প্রোডাক্ট ডেটার জন্য API কল
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/api/v1/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Sorry! No Information in this product।");
      } finally {
        setDataLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // লোডিং স্টেট হ্যান্ডলিং
  if (authLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] dark:bg-gray-900">
        <FaSpinner className="text-5xl text-green-500 animate-spin" />
        <span className="ml-4 text-xl dark:text-gray-300">
          Information Loading...
        </span>
      </div>
    );
  }

  // প্রোডাক্ট না পেলে বা এরর হলে
  if (error) {
    return <NotFound message={error} />;
  }

  // ডেস্ট্রাকচারিং প্রোডাক্ট ডেটা
  const { name, image, price, category, quantity, description } = product;

  // ইউজার অ্যাক্সেস শর্ত
  const isBuyer = userRole === "buyer";
  const canPlaceOrder = isBuyer && userStatus !== "suspended" && quantity > 0;
  const isSuspended = userStatus === "suspended";

  return (
    <Container className="py-16 px-4 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-6 md:p-10 border border-green-200 dark:border-green-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* বাম পাশ: প্রোডাক্ট ইমেজ */}
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* ডান পাশ: প্রোডাক্ট বিবরণ ও অ্যাকশন */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              {name}
            </h1>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center">
              <FaDollarSign className="mr-2 text-3xl" /> Price: ${price}
            </p>

            <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <p className="flex items-center text-lg">
                <FaTags className="mr-3 text-green-500" />
                **Categories:**{" "}
                <span className="ml-2 font-semibold capitalize">
                  {category}
                </span>
              </p>
              <p className="flex items-center text-lg">
                <FaWarehouse className="mr-3 text-green-500" />
                **Stock:**{" "}
                <span
                  className={`ml-2 font-bold ${
                    quantity > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {quantity > 0 ? `${quantity} Unit` : "No Stock Available"}
                </span>
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 border-b pb-2">
                Complete Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* অ্যাকশন বাটন এবং শর্তসাপেক্ষে বার্তা */}
            <div className="mt-10">
              {user && canPlaceOrder && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto flex items-center justify-center py-3 px-8 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-xl gap-3"
                >
                  <FaShoppingCart /> Place Order
                </button>
              )}

              {/* যদি লগইন করা না থাকে */}
              {!user && (
                <p className="text-red-500 font-semibold">
                  Place order! please Login first.
                </p>
              )}

              {/* যদি ইউজার Buyer না হয় */}
              {user && !isBuyer && (
                <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                  Your current role (Manager/Admin) is not authorized to place
                  orders.
                </p>
              )}

              {/* যদি স্ট্যাটাস সাসপেন্ডেড থাকে */}
              {user && isSuspended && (
                <p className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2">
                  <FaBan /> Your Account is Suspended, So you can't place any
                  orders.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* প্লেস অর্ডার মডাল */}
      {canPlaceOrder && (
        <PlaceOrderModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          product={product}
        />
      )}
      <ToastContainer />
    </Container>
  );
};

export default ProductDetailsPage;
