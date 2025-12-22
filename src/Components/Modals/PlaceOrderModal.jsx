import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaTimes,
  FaCalculator,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const PlaceOrderModal = ({ product, closeModal }) => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [orderQuantity, setOrderQuantity] = useState(product?.minOrderQty || 1);
  const [selectedPayment, setSelectedPayment] = useState("");

  const totalPrice = (product?.price * orderQuantity).toFixed(2);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!user) return Swal.fire("Error", "Please login first!", "error");

    if (userRole?.toLowerCase() !== "buyer") {
      return Swal.fire(
        "Access Denied",
        "অর্ডার শুধুমাত্র বায়ারদের জন্য।",
        "error"
      );
    }

    if (!selectedPayment) {
      return Swal.fire(
        "Error",
        "দয়া করে একটি পেমেন্ট মেথড সিলেক্ট করুন।",
        "warning"
      );
    }

    const qty = Number(orderQuantity);
    setLoading(true);

    const orderData = {
      productId: product._id,
      productName: product.name,
      image: product.image,
      orderQuantity: qty,
      unitPrice: product.price,
      totalPrice: Number(totalPrice),
      buyerEmail: user.email,
      buyerName: user.displayName,
      paymentMethod: selectedPayment,
      status: "pending",
      orderDate: new Date(),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders`,
        orderData,
        { withCredentials: true }
      );

      // সাকসেস চেক আপডেট করা হয়েছে
      if (
        res.data.insertedId ||
        res.data.success ||
        res.data.result?.insertedId
      ) {
        const orderId = res.data.insertedId || res.data.result?.insertedId;

        if (selectedPayment === "Stripe") {
          await Swal.fire({
            title: "Place Your Order!",
            text: "আপনাকে পেমেন্ট পেজে নিয়ে যাওয়া হচ্ছে...",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          // মডাল বন্ধ করা এবং রিডাইরেক্ট করা
          closeModal();
          navigate(`/dashboard/payment/${orderId}`, { state: { totalPrice } });
        } else {
          await Swal.fire("সফল", "আপনার অর্ডারটি গ্রহণ করা হয়েছে!", "success");
          closeModal();
          navigate("/dashboard/my-orders");
        }
      }
    } catch (error) {
      console.error("Order Error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "অর্ডার সম্পন্ন করা সম্ভব হয়নি।",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[35px] relative shadow-2xl border border-gray-100 dark:border-gray-700 max-w-lg w-full mx-auto overflow-y-auto max-h-[90vh]">
      <button
        onClick={closeModal}
        className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
      >
        <FaTimes size={20} />
      </button>

      <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white flex items-center gap-2 italic uppercase">
        <FaShoppingCart className="text-blue-600" /> Complete Your Order
      </h2>

      {/* প্রোডাক্ট প্রিভিউ */}
      <div className="flex gap-4 items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100">
        <img
          src={product.image}
          className="w-16 h-16 object-cover rounded-xl shadow-sm"
          alt={product.name}
        />
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white">
            {product.name}
          </h3>
          <p className="text-sm font-bold text-blue-600">
            ${product.price} / unit
          </p>
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Quantity
          </label>
          <input
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
            className="input input-bordered w-full h-12 text-lg font-bold rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
            required
            min={product?.minOrderQty || 1}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedPayment("Stripe")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                selectedPayment === "Stripe"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-100 dark:border-gray-700 hover:border-blue-200"
              }`}
            >
              <FaCreditCard
                className={
                  selectedPayment === "Stripe"
                    ? "text-blue-600"
                    : "text-gray-400"
                }
                size={24}
              />
              <span className="text-xs font-bold mt-2">Stripe (Card)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPayment("COD")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                selectedPayment === "COD"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-100 dark:border-gray-700 hover:border-green-200"
              }`}
            >
              <FaTruck
                className={
                  selectedPayment === "COD" ? "text-green-600" : "text-gray-400"
                }
                size={24}
              />
              <span className="text-xs font-bold mt-2">Cash on Delivery</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-900 rounded-2xl text-white">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold opacity-70">Total Amount:</span>
            <span className="text-2xl font-black text-green-400">
              ${totalPrice}
            </span>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-black uppercase tracking-tighter shadow-lg transition-all active:scale-95 disabled:bg-gray-400"
        >
          {loading ? (
            <FaSpinner className="animate-spin mx-auto text-white" />
          ) : (
            "Confirm & Pay"
          )}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrderModal;
