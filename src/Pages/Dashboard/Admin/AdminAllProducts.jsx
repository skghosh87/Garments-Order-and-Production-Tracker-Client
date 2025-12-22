import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaBoxOpen,
  FaTrashAlt,
  FaEdit,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const API_URL = import.meta.env.VITE_SERVER_API;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/products`, {
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= ১. Show on Home Toggle Logic ================= */
  const handleToggleHome = async (id, currentStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/products/toggle-home/${id}`,
        { showOnHome: !currentStatus },
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Updated!",
          text: "Home page visibility changed.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchProducts();
      }
    } catch (err) {
      Swal.fire("Error", "Could not update home status", "error");
    }
  };

  /* ================= ২. মডাল ওপেন করা ================= */
  const openEditModal = (product) => {
    setSelectedProduct(product);
    document.getElementById("full_edit_modal").showModal();
  };

  /* ================= ৩. ফুল আপডেট লজিক ================= */
  const handleFullUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const modal = document.getElementById("full_edit_modal");

    const updatedData = {
      name: form.name.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      description: form.description.value,
      videoUrl: form.videoUrl.value,
      paymentOptions: form.paymentOptions.value,
      image: form.image.value,
    };

    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/products/${selectedProduct._id}`,
        updatedData,
        { withCredentials: true }
      );

      if (res.data.modifiedCount > 0 || res.status === 200) {
        Swal.fire("Success", "Product updated successfully!", "success");
        modal.close();
        fetchProducts();
      } else {
        Swal.fire("No Changes", "Product info is already up to date.", "info");
        modal.close();
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      Swal.fire(
        "Error",
        "Update failed. Ensure backend fields match.",
        "error"
      );
    }
  };

  /* ================= ৪. ডিলিট লজিক ================= */
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${API_URL}/api/v1/products/${id}`, {
            withCredentials: true,
          });
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Product has been removed.", "success");
            fetchProducts();
          }
        } catch (err) {
          Swal.fire("Error", "Could not delete product.", "error");
        }
      }
    });
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <FaSpinner className="animate-spin text-5xl text-blue-600 mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest">
          Loading Inventory...
        </p>
      </div>
    );

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10 border-b pb-6">
        <div className="p-4 bg-blue-100 rounded-2xl">
          <FaBoxOpen className="text-3xl text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Global Inventory
          </h1>
          <p className="text-sm font-medium text-gray-400 uppercase">
            Manage All Products & Display
          </p>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-black tracking-widest">
            <tr>
              <th className="py-5 pl-8">Image & Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created By</th>
              <th className="text-center">Show on Home</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-blue-50/40 transition-all"
              >
                <td className="py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100"
                      alt=""
                    />
                    <div className="font-black text-gray-800 uppercase text-xs">
                      {product.name}
                    </div>
                  </div>
                </td>
                <td className="font-black text-blue-600">${product.price}</td>
                <td>
                  <span className="badge badge-ghost font-bold text-[10px] uppercase text-gray-400 border-none px-3">
                    {product.category || "General"}
                  </span>
                </td>
                <td>
                  <div className="flex flex-col text-xs">
                    {/* Object rendering fix: direct property access */}
                    <span className="font-bold text-gray-700">
                      {typeof product.addedBy === "object"
                        ? product.addedBy?.name
                        : "Admin"}
                    </span>
                    <span className="text-gray-400">
                      {typeof product.addedBy === "object"
                        ? product.addedBy?.email
                        : product.addedBy}
                    </span>
                  </div>
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-sm"
                    checked={product.showOnHome || false}
                    onChange={() =>
                      handleToggleHome(product._id, product.showOnHome)
                    }
                  />
                </td>
                <td className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="btn btn-square btn-sm btn-ghost text-blue-500 hover:bg-blue-100"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-square btn-sm btn-ghost text-red-500 hover:bg-red-100"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT PRODUCT MODAL ================= */}
      <dialog id="full_edit_modal" className="modal modal-middle">
        <div className="modal-box bg-white max-w-3xl rounded-3xl p-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h3 className="font-black text-xl uppercase text-gray-800 italic">
              Edit Product Inventory
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          {selectedProduct && (
            <form onSubmit={handleFullUpdate} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedProduct.name}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={selectedProduct.category}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-gray-500">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedProduct.description}
                  className="textarea textarea-bordered h-24"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={selectedProduct.price}
                    className="input input-bordered"
                    required
                  />
                </div>
                {/* Payment Options Dropdown */}
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">
                    Payment Options
                  </label>
                  <select
                    name="paymentOptions"
                    defaultValue={selectedProduct.paymentOptions}
                    className="select select-bordered font-bold"
                    required
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Both">Both (Stripe & COD)</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-gray-500">
                  Demo Video URL
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  defaultValue={selectedProduct.videoUrl}
                  className="input input-bordered"
                  placeholder="YouTube/Vimeo link"
                />
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-gray-500">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  defaultValue={selectedProduct.image}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary w-full h-12 text-white font-black uppercase tracking-widest shadow-lg"
                >
                  Update Product Now
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default AdminAllProducts;
