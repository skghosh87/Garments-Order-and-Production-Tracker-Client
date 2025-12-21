import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaTimes,
  FaCalculator,
  FaShoppingCart,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const PlaceOrderModal = ({ product, closeModal }) => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);

  // ডায়নামিকভাবে স্টেট সেট করা (ডাটাবেসের minOrderQty অথবা ডিফল্ট ১)
  const [orderQuantity, setOrderQuantity] = useState(product?.minOrderQty || 1);

  // টোটাল প্রাইস ক্যালকুলেশন
  const totalPrice = (product?.price * orderQuantity).toFixed(2);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    // ১. লগইন চেক
    if (!user) {
      return Swal.fire("Error", "Please login first!", "error");
    }

    // ২. বায়ার চেক (Case-insensitive ফিক্স)
    if (userRole?.toLowerCase() !== "buyer") {
      return Swal.fire(
        "Access Denied",
        `অর্ডার শুধুমাত্র বায়ারদের জন্য। আপনার বর্তমান রোল: ${userRole}`,
        "error"
      );
    }

    // ৩. স্টক এবং মিনিমাম অর্ডার ভ্যালিডেশন
    const qty = Number(orderQuantity);
    if (qty < (product?.minOrderQty || 1)) {
      return Swal.fire(
        "Error",
        `কমপক্ষে ${product?.minOrderQty || 1} টি অর্ডার করতে হবে!`,
        "error"
      );
    }

    if (qty > product.quantity) {
      return Swal.fire("Error", "অর্ডার স্টক লিমিটের বাইরে!", "error");
    }

    setLoading(true);

    const orderData = {
      productId: product._id,
      productName: product.name,
      image: product.image,
      orderQuantity: qty,
      totalPrice: Number(totalPrice),
      buyerEmail: user.email,
      buyerName: user.displayName,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders`,
        orderData,
        {
          withCredentials: true, // HTTP Only Cookie পাঠানোর জন্য এটি বাধ্যতামূলক
        }
      );

      if (res.data.success || res.data.result?.insertedId) {
        Swal.fire(
          "Success",
          "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!",
          "success"
        );
        closeModal();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "অর্ডার সম্পন্ন করা সম্ভব হয়নি।",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl relative shadow-2xl border border-gray-100 dark:border-gray-700 max-w-lg w-full mx-auto">
      {/* ক্লোজ বাটন */}
      <button
        onClick={closeModal}
        className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
      >
        <FaTimes size={20} />
      </button>

      <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <FaShoppingCart className="text-green-600" /> Confirm Order
      </h2>

      {/* প্রোডাক্ট ইনফো কার্ড */}
      <div className="flex gap-5 items-center mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-xl shadow-md"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Unit Price: ${product.price}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase">
              Min Order: {product.minOrderQty || 1}
            </span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase">
              Stock: {product.quantity}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="space-y-6">
        {/* কোয়ান্টিটি ইনপুট */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            Select Order Quantity
          </label>
          <input
            type="number"
            min={product?.minOrderQty || 1}
            max={product?.quantity}
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
            className="input input-bordered w-full h-14 text-xl font-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-2xl bg-white dark:bg-gray-900"
            required
          />
        </div>

        {/* কস্ট ক্যালকুলেশন সেকশন */}
        <div className="p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Calculation:
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-bold">
              ${product.price} × {orderQuantity || 0}
            </span>
          </div>
          <hr className="border-green-200 dark:border-green-800 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaCalculator className="text-green-600" /> Total Cost:
            </span>
            <span className="text-2xl font-black text-green-700 dark:text-green-400">
              ${totalPrice}
            </span>
          </div>
        </div>

        {/* কনফার্ম বাটন */}
        <button
          disabled={loading}
          type="submit"
          className="btn border-none w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-green-100 dark:shadow-none transition-all active:scale-95"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin" /> Submitting...
            </div>
          ) : (
            "Place Order Now"
          )}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrderModal;
