import { useState } from "react";
import Swal from "sweetalert2";
import { FaSpinner, FaBoxOpen } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const form = e.target;

    const price = Number(form.price.value);
    const quantity = Number(form.quantity.value);
    const minOrderQty = Number(form.minOrderQty.value);

    // লজিক্যাল ভ্যালিডেশন
    if (minOrderQty > quantity) {
      return Swal.fire(
        "Warning",
        "Minimum order cannot exceed stock!",
        "warning"
      );
    }

    const product = {
      name: form.name.value,
      category: form.category.value,
      price,
      quantity,
      minOrderQty,
      description: form.description.value,
      image: form.image.value,
      status: "active",
      addedBy: user?.email,
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const res = await axiosSecure.post("/api/v1/products", product);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Product added successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        form.reset();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <FaBoxOpen className="text-3xl text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
      </div>

      <form
        onSubmit={handleAddProduct}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Product Name */}
        <div className="form-control md:col-span-2">
          <label className="label font-bold text-gray-700">Product Name</label>
          <input
            name="name"
            type="text"
            required
            className="input input-bordered focus:ring-2 focus:ring-green-400"
            placeholder="Premium Silk Saree"
          />
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label font-bold text-gray-700">Category</label>
          <select
            name="category"
            required
            className="select select-bordered focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Category</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Shirt">Shirt</option>
            <option value="Panjabi">Panjabi</option>
            <option value="Saree">Saree</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label font-bold text-gray-700">Price ($)</label>
          <input
            name="price"
            type="number"
            min="1"
            required
            className="input input-bordered focus:ring-2 focus:ring-green-400"
            placeholder="500"
          />
        </div>

        {/* Quantity */}
        <div className="form-control">
          <label className="label font-bold text-gray-700">
            Stock Quantity
          </label>
          <input
            name="quantity"
            type="number"
            min="1"
            required
            className="input input-bordered focus:ring-2 focus:ring-green-400"
            placeholder="100"
          />
        </div>

        {/* Min Order */}
        <div className="form-control">
          <label className="label font-bold text-gray-700">Min Order Qty</label>
          <input
            name="minOrderQty"
            type="number"
            min="1"
            required
            className="input input-bordered focus:ring-2 focus:ring-green-400"
            placeholder="5"
          />
        </div>

        {/* Image URL */}
        <div className="form-control md:col-span-2">
          <label className="label font-bold text-gray-700">Image URL</label>
          <input
            name="image"
            type="url"
            required
            className="input input-bordered focus:ring-2 focus:ring-green-400"
            placeholder="https://imgur.com/example.jpg"
          />
        </div>

        {/* Description */}
        <div className="form-control md:col-span-2">
          <label className="label font-bold text-gray-700">
            Product Description
          </label>
          <textarea
            name="description"
            rows="3"
            required
            className="textarea textarea-bordered focus:ring-2 focus:ring-green-400"
            placeholder="Describe your product materials, size guide, etc."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4">
          <button
            disabled={loading}
            type="submit"
            className="btn btn-block bg-green-600 hover:bg-green-700 text-white border-none text-lg"
          >
            {loading ? (
              <FaSpinner className="animate-spin text-xl" />
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
