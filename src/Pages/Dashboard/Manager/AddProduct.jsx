import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const AddProduct = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    // ১. product অবজেক্টে quantity ফিল্ড যুক্ত করা হয়েছে
    const product = {
      name: form.name.value,
      category: form.category.value,
      price: Number(form.price.value),
      quantity: Number(form.quantity.value), // নতুন যুক্ত করা হয়েছে
      minOrderQty: Number(form.minOrderQty.value),
      description: form.description.value,
      image: form.image.value,
      status: "active",
      addedBy: user?.email,
      createdAt: new Date(),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/products`,
        product,
        { withCredentials: true }
      );

      Swal.fire("Success", "Product added successfully!", "success");
      form.reset();
    } catch (error) {
      Swal.fire("Error", "Failed to add product", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Add New Product
      </h1>

      <form onSubmit={handleAddProduct} className="space-y-4">
        {/* Product Name */}
        <div className="form-control">
          <label className="label font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            required
            className="input input-bordered w-full focus:outline-green-500"
            placeholder="Cotton T-Shirt"
          />
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label font-semibold">Category</label>
          <select
            name="category"
            required
            className="select select-bordered w-full focus:outline-green-500"
          >
            <option value="">Select Category</option>
            <option value="t-shirt">T-Shirt</option>
            <option value="shirt">Shirt</option>
            <option value="jacket">Jacket</option>
            <option value="pants">Pants</option>
          </select>
        </div>

        {/* Price & Quantity (একই লাইনে সাজানো হয়েছে) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label font-semibold">Price (per unit)</label>
            <input
              type="number"
              name="price"
              required
              min="1"
              className="input input-bordered w-full focus:outline-green-500"
              placeholder="e.g. 50"
            />
          </div>

          {/* ২. নতুন Quantity ইনপুট ফিল্ড */}
          <div className="form-control">
            <label className="label font-semibold">Available Quantity</label>
            <input
              type="number"
              name="quantity"
              required
              min="0"
              className="input input-bordered w-full focus:outline-green-500"
              placeholder="e.g. 500"
            />
          </div>
        </div>

        {/* Minimum Order Qty & Image URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label font-semibold">Minimum Order Qty</label>
            <input
              type="number"
              name="minOrderQty"
              required
              min="1"
              className="input input-bordered w-full focus:outline-green-500"
              placeholder="e.g. 10"
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Product Image URL</label>
            <input
              type="url"
              name="image"
              required
              className="input input-bordered w-full focus:outline-green-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            required
            className="textarea textarea-bordered w-full focus:outline-green-500"
            placeholder="Product details..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="btn btn-success w-full text-white shadow-md hover:bg-green-700 transition-colors cursor-pointer"
        >
          {loading ? (
            <FaSpinner className="animate-spin text-lg" />
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
