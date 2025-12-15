import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const product = {
      name: form.name.value,
      category: form.category.value,
      price: Number(form.price.value),
      minOrderQty: Number(form.minOrderQty.value),
      description: form.description.value,
      image: form.image.value,
      status: "active",
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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleAddProduct} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="label font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            required
            className="input input-bordered w-full"
            placeholder="Cotton T-Shirt"
          />
        </div>

        {/* Category */}
        <div>
          <label className="label font-semibold">Category</label>
          <select
            name="category"
            required
            className="select select-bordered w-full"
          >
            <option value="">Select Category</option>
            <option value="t-shirt">T-Shirt</option>
            <option value="shirt">Shirt</option>
            <option value="jacket">Jacket</option>
            <option value="pants">Pants</option>
          </select>
        </div>

        {/* Price & MOQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label font-semibold">Price (per unit)</label>
            <input
              type="number"
              name="price"
              required
              min="1"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label font-semibold">Minimum Order Qty</label>
            <input
              type="number"
              name="minOrderQty"
              required
              min="1"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="label font-semibold">Product Image URL</label>
          <input
            type="url"
            name="image"
            required
            className="input input-bordered w-full"
            placeholder="https://..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="label font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            required
            className="textarea textarea-bordered w-full"
            placeholder="Product details..."
          ></textarea>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="btn btn-success w-full text-white"
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
