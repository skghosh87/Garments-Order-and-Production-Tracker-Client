import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FaSpinner, FaBoxOpen, FaTrashAlt, FaEdit, 
  FaPlus, FaTimes, FaUserShield, FaEnvelope 
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const API_URL = import.meta.env.VITE_SERVER_API;

  /* ================= ১. ডাটা ফেচ করা ================= */
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

  /* ================= ২. মডাল ওপেন করা ================= */
  const openEditModal = (product) => {
    setSelectedProduct(product);
    document.getElementById("full_edit_modal").showModal();
  };

  /* ================= ৩. ফুল আপডেট লজিক (Error/Success Handling সহ) ================= */
  const handleFullUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const modal = document.getElementById("full_edit_modal");
    
    // ডাটাবেস ফিল্ড অনুযায়ী ডাটা অবজেক্ট তৈরি
    const updatedData = {
  name: form.name.value,
  price: parseFloat(form.price.value),
  quantity: parseInt(form.quantity.value), // correct key
  category: form.category.value,
  addedBy: form.addedBy.value,             // correct key
  image: form.image.value,
};

    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/products/${selectedProduct._id}`, 
        updatedData, 
        { withCredentials: true }
      );

      // সফল হলে মডাল বন্ধ হবে এবং মেসেজ দেখাবে
      modal.close(); 

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Inventory Updated!",
          text: "Product details have been synced successfully.",
          icon: "success",
          confirmButtonColor: "#3b82f6"
        });
        fetchProducts(); 
      } else {
        Swal.fire("No Changes", "The information is already up to date.", "info");
      }
    } catch (err) {
      // এরর আসলেও মডালটি বন্ধ করে মেসেজ দেখাবে
      modal.close(); 
      console.error("Update Error:", err);
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  /* ================= ৪. ডিলিট লজিক ================= */
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${API_URL}/api/v1/products/${id}`, { withCredentials: true });
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Item removed.", "success");
            fetchProducts();
          }
        } catch (err) {
          Swal.fire("Error", "Could not delete product.", "error");
        }
      }
    });
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[500px]">
      <FaSpinner className="animate-spin text-5xl text-blue-600 mb-4" />
      <p className="text-gray-400 font-bold uppercase tracking-widest">Loading Inventory...</p>
    </div>
  );

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-100 rounded-2xl">
            <FaBoxOpen className="text-3xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Global Inventory</h1>
            <p className="text-sm font-medium text-gray-400 uppercase">Manage Products & Assignments</p>
          </div>
        </div>
        {/* <Link to="/dashboard/add-product" className="btn btn-primary px-8 rounded-xl shadow-lg border-none">
          <FaPlus /> Add New Item
        </Link> */}
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-black tracking-widest">
            <tr>
              <th className="py-5 pl-8">Product Details</th>
              <th>Category</th>
              <th>Owner (addedBy)</th>
              <th className="text-center">Stock</th>
              <th className="text-right pr-8">Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-blue-50/40 transition-all">
                <td className="py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                    <div>
                      <div className="font-black text-gray-800 uppercase text-xs">{product.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">ID: {product._id.slice(-8)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost font-bold text-[10px] uppercase text-gray-400 border-none px-3">
                    {product.category || "General"}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-400 text-[10px]" />
                    <span className="text-xs font-semibold text-gray-600">{product.addedBy || "N/A"}</span>
                  </div>
                </td>
                <td className="text-center font-bold text-gray-700">{product.quantity || 0}</td>
                <td className="text-right font-black text-blue-600 text-base pr-8">${product.price}</td>
                <td className="text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEditModal(product)} className="btn btn-square btn-sm btn-ghost text-blue-500 hover:bg-blue-100">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn btn-square btn-sm btn-ghost text-red-500 hover:bg-red-100">
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
        <div className="modal-box bg-white max-w-2xl rounded-3xl p-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h3 className="font-black text-xl uppercase text-gray-800">Update Product Details</h3>
            <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost">✕</button></form>
          </div>

          {selectedProduct && (
            <form onSubmit={handleFullUpdate} className="space-y-5 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">Product Name</label>
                  <input type="text" name="name" defaultValue={selectedProduct.name} className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                    <FaUserShield className="text-blue-500" /> Manager Email (addedBy)
                  </label>
                  <input type="email" name="addedBy" defaultValue={selectedProduct.addedBy} className="input input-bordered" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">Price ($)</label>
                  <input type="number" name="price" defaultValue={selectedProduct.price} className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">Stock Qty</label>
                  <input type="number" name="quantity" defaultValue={selectedProduct.quantity} className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-black uppercase text-gray-500">Category</label>
                  <select name="category" defaultValue={selectedProduct.category} className="select select-bordered font-bold" required>
                    <option value="t-shirt">T-Shirt</option>
                    <option value="pants">Pants</option>
                    <option value="shirt">Shirt</option>
                    <option value="jacket">Jacket</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-gray-500">Image URL</label>
                <input type="text" name="image" defaultValue={selectedProduct.image} className="input input-bordered w-full" required />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary w-full h-14 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                  Save Changes
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