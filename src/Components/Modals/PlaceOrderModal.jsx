import React, { useState } from "react";
import {
  FaShoppingCart,
  FaTimes,
  FaMinus,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthProvider";

/**
 * PlaceOrderModal: অর্ডার প্লেস করার জন্য ব্যবহৃত মডাল কম্পোনেন্ট।
 * @param {boolean} isOpen - মডাল খোলা আছে কিনা
 * @param {function} setIsOpen - মডাল বন্ধ করার ফাংশন
 * @param {object} product - যে প্রোডাক্টটি অর্ডার করা হচ্ছে
 */
const PlaceOrderModal = ({ isOpen, setIsOpen, product }) => {
  const { user, userRole, token } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null; // মডাল বন্ধ থাকলে কিছু রেন্ডার হবে না

  const maxQuantity = product.quantity;
  const totalPrice = (quantity * product.price).toFixed(2);

  // Quantity Increment/Decrement
  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQty = prev + change;
      if (newQty < 1) return 1;
      if (newQty > maxQuantity) return maxQuantity;
      return newQty;
    });
  };

  // অর্ডার প্লেস করার মূল ফাংশন
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (quantity > maxQuantity) {
      toast.error(`আপনি সর্বোচ্চ ${maxQuantity} ইউনিট অর্ডার করতে পারেন।`);
      return;
    }

    const orderData = {
      productId: product._id,
      productName: product.name,
      buyerEmail: user?.email,
      buyerName: user?.displayName,
      orderQuantity: quantity,
      totalPrice: parseFloat(totalPrice),
      orderDate: new Date().toISOString(),
      status: "pending", // প্রাথমিক স্ট্যাটাস
    };

    try {
      setIsSubmitting(true);

      // সার্ভারে অর্ডার প্লেস করার জন্য API কল
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders`,
        orderData
        // JWT টোকেন Authorization Header এ পাঠানোর জন্য:
        // { headers: { Authorization: `Bearer ${token}` } } // যদি AuthProvider এ axios ইন্টারসেপ্টর সেট না করা থাকে
      );

      if (response.data.success) {
        toast.success(
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span>
              অর্ডার সফলভাবে প্লেস করা হয়েছে! আপনার অর্ডার আইডি:{" "}
              {response.data.orderId}
            </span>
          </div>,
          { position: "top-center" }
        );
        setIsOpen(false); // মডাল বন্ধ করা
        // অতিরিক্ত: ইউজারকে My Orders পেজে রিডাইরেক্ট করতে পারেন
        // navigate('/dashboard/my-orders');
      } else {
        toast.error(
          response.data.message || "অর্ডার প্লেস করার সময় একটি ত্রুটি হয়েছে।",
          { position: "top-center" }
        );
      }
    } catch (error) {
      console.error("Order placement error:", error);
      // সার্ভার থেকে আসা ত্রুটি মেসেজ দেখানো
      const errorMessage = error.response?.data?.message || "Order not placed";
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 md:p-8 transform transition-all duration-300 scale-100 dark:border dark:border-green-700"
        onClick={(e) => e.stopPropagation()} // মডালের বাইরে ক্লিক করলে বন্ধ হবে না
      >
        {/* মডাল হেডার */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
            <FaShoppingCart /> Please Confirm Order
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-2xl transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* প্রোডাক্ট ইনফো */}
        <div className="mb-6 space-y-2 text-gray-700 dark:text-gray-300">
          <p className="text-xl font-semibold dark:text-white">
            {product.name}
          </p>
          <p>
            Stock Available:{" "}
            <span className="font-bold text-green-600">{maxQuantity} Unit</span>
          </p>
          <p>
            Unit Price: <span className="font-semibold">${product.price}</span>
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          {/* কোয়ান্টিটি ইনপুট */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order's Quantity (Unit)
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isSubmitting}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-green-600 dark:text-green-400 disabled:opacity-50 transition"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(maxQuantity, parseInt(e.target.value) || 1)
                    )
                  )
                }
                min="1"
                max={maxQuantity}
                className="w-full text-center py-3 bg-white dark:bg-gray-800 dark:text-white font-bold text-lg focus:outline-none"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity || isSubmitting}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-green-600 dark:text-green-400 disabled:opacity-50 transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* মোট মূল্য */}
          <div className="flex justify-between items-center border-t pt-4 mt-6">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              Total Price:
            </p>
            <p className="text-2xl font-extrabold text-green-700 dark:text-green-400">
              ${totalPrice}
            </p>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isSubmitting || quantity < 1 || quantity > maxQuantity}
            className="w-full mt-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-lg disabled:bg-green-400/70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" /> Placing Order ...
              </>
            ) : (
              <>
                <FaCheckCircle /> Please Confirm Order
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderModal;
