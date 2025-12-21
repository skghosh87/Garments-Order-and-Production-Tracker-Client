import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaBoxOpen,
  FaDollarSign,
  FaLayerGroup,
  FaImage,
  FaListUl,
  FaCreditCard,
} from "react-icons/fa";
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
    const paymentOption = form.paymentOption.value;

    // লজিক্যাল ভ্যালিডেশন
    if (minOrderQty > quantity) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Minimum order quantity cannot exceed total stock!",
        confirmButtonColor: "#16a34a",
      });
    }

    const product = {
      name: form.name.value,
      category: form.category.value,
      price,
      quantity,
      minOrderQty,
      paymentOption, // ম্যানেজার পেমেন্ট অপশন নির্ধারণ করছে
      description: form.description.value,
      image: form.image.value,
      status: "active",
      addedBy: {
        email: user?.email,
        name: user?.displayName,
      },
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const res = await axiosSecure.post("/api/v1/products", product);

      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product added to inventory!",
          showConfirmButton: false,
          timer: 1500,
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
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <FaBoxOpen className="animate-bounce" /> Add New Product
            </h1>
            <p className="text-green-100 mt-1">
              Fill in the details to list a new garment item
            </p>
          </div>
          <div className="hidden md:block opacity-20 text-6xl">
            <FaLayerGroup />
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleAddProduct}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Product Name */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold text-gray-700">
              Product Title
            </label>
            <div className="relative">
              <FaListUl className="absolute left-4 top-4 text-gray-400" />
              <input
                name="name"
                type="text"
                placeholder="e.g. Slim Fit Cotton Chino"
                required
                className="input input-bordered w-full pl-12 focus:outline-green-500 transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              required
              className="select select-bordered focus:outline-green-500"
            >
              <option value="" disabled selected>
                Choose Category
              </option>
              <option value="T-Shirt">T-Shirt</option>
              <option value="Shirt">Shirt</option>
              <option value="Panjabi">Panjabi</option>
              <option value="Saree">Saree</option>
              <option value="Jeans">Jeans</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700">
              Unit Price ($)
            </label>
            <div className="relative">
              <FaDollarSign className="absolute left-4 top-4 text-gray-400" />
              <input
                name="price"
                type="number"
                min="1"
                required
                placeholder="0.00"
                className="input input-bordered w-full pl-12 focus:outline-green-500"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700">
              Stock Quantity
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              required
              placeholder="Total items"
              className="input input-bordered focus:outline-green-500"
            />
          </div>

          {/* Min Order */}
          <div className="form-control">
            <label className="label font-semibold text-gray-700">
              Minimum Order Qty
            </label>
            <input
              name="minOrderQty"
              type="number"
              min="1"
              required
              placeholder="Min to order"
              className="input input-bordered focus:outline-green-500"
            />
          </div>

          {/* Manager's Decision: Payment Option */}
          <div className="form-control md:col-span-1">
            <label className="label font-semibold text-gray-700">
              <FaCreditCard className="inline mr-1 text-green-600" /> Payment
              Option
            </label>
            <select
              name="paymentOption"
              required
              className="select select-bordered focus:outline-green-500 border-green-200"
            >
              <option value="Both">Both (Stripe & COD)</option>
              <option value="Stripe Only">Stripe Only (Prepaid)</option>
              <option value="COD Only">Cash on Delivery Only</option>
            </select>
          </div>

          {/* Image URL */}
          <div className="form-control md:col-span-1">
            <label className="label font-semibold text-gray-700">
              Product Image URL
            </label>
            <div className="relative">
              <FaImage className="absolute left-4 top-4 text-gray-400" />
              <input
                name="image"
                type="url"
                required
                placeholder="https://image-link.com"
                className="input input-bordered w-full pl-12 focus:outline-green-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold text-gray-700">
              Product Specification
            </label>
            <textarea
              name="description"
              rows="4"
              required
              placeholder="Fabric details, size charts, etc..."
              className="textarea textarea-bordered focus:outline-green-500 text-base"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-4">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-block bg-green-600 hover:bg-green-700 text-white border-none text-lg h-14 shadow-lg shadow-green-200"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-2xl" />
              ) : (
                "Add Product to Inventory"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
