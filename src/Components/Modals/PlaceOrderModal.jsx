import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner, FaTimes } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const PlaceOrderModal = ({ product, closeModal }) => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    // 1️⃣ Login check
    if (!user) {
      return Swal.fire("Error", "Please login first!", "error");
    }

    // 2️⃣ Buyer only
    if (userRole !== "buyer") {
      return Swal.fire("Access Denied", "Only Buyer can place orders", "error");
    }

    // 3️⃣ Stock check
    if (orderQuantity > product.quantity) {
      return Swal.fire("Error", "Order quantity exceeds stock!", "error");
    }

    setLoading(true);

    const orderData = {
      productId: product._id,
      productName: product.name,
      image: product.image,
      orderQuantity: Number(orderQuantity),
      totalPrice: product.price * orderQuantity,
      buyerEmail: user.email,
      buyerName: user.displayName,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders`,
        orderData,
        {
          withCredentials: true, // 🔥 VERY IMPORTANT
        }
      );

      if (res.data.insertedId) {
        Swal.fire("Success", "Order placed successfully!", "success");
        closeModal();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Order failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl relative shadow-xl">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
      >
        <FaTimes size={18} />
      </button>

      <h2 className="text-2xl font-bold mb-6">Confirm Order</h2>

      <div className="flex gap-4 items-center mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 rounded-lg"
        />
        <div>
          <h3 className="font-bold">{product.name}</h3>
          <p>${product.price}</p>
          <p className="text-sm text-gray-500">Available: {product.quantity}</p>
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="space-y-4">
        <input
          type="number"
          min="1"
          max={product.quantity}
          value={orderQuantity}
          onChange={(e) => setOrderQuantity(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        <button disabled={loading} className="btn btn-primary w-full">
          {loading ? <FaSpinner className="animate-spin" /> : "Confirm Order"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrderModal;
