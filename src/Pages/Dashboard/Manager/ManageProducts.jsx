import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaBoxOpen,
  FaCubes,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageProducts = () => {
  const { user, userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = import.meta.env.VITE_SERVER_API;

  /* ================= Fetch All Products ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/products`, {
        withCredentials: true,
      });

      const currentRole = userRole?.toLowerCase();
      const isAdmin = currentRole === "admin";

      if (isAdmin) {
        setProducts(res.data);
      } else {
        const myProducts = res.data.filter(
          (product) => product.addedBy === user?.email
        );
        setProducts(myProducts);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Could not load products.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email || userRole) {
      fetchProducts();
    }
  }, [user?.email, userRole]);

  /* ================= Delete Product ================= */
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${API_URL}/api/v1/products/${id}`, {
            withCredentials: true,
          });
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Product has been removed.", "success");
            setProducts(products.filter((p) => p._id !== id));
          }
        } catch (err) {
          Swal.fire("Error", "Failed to delete product.", "error");
        }
      }
    });
  };

  /* ================= Update Product (Submit) ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Quantity সহ আপডেট ডাটা তৈরি
    const updatedData = {
      name: form.name.value,
      price: Number(form.price.value),
      quantity: Number(form.quantity.value), // নতুন যুক্ত করা হয়েছে
      category: form.category.value,
      description: form.description.value,
      image: form.image.value,
    };

    try {
      const res = await axios.put(
        `${API_URL}/api/v1/products/${selectedProduct._id}`,
        updatedData,
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", "Product updated successfully.", "success");
        document.getElementById("edit_modal").close();
        fetchProducts(); // ডাটা রিফ্রেশ করা
      } else {
        Swal.fire("No Changes", "No information was modified.", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update product.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-5xl text-green-500" />
        <p className="text-gray-500 font-medium">Loading your inventory...</p>
      </div>
    );
  }

  const currentRoleNormalized =
    userRole?.toLowerCase() === "admin" ? "Admin" : "Manager";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Manage Products
          </h1>
          <p className="text-sm text-gray-500">
            Logged in as:{" "}
            <span className="font-bold text-green-600">
              {currentRoleNormalized}
            </span>
          </p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 text-center">
          <p className="text-sm text-green-700 font-semibold">
            Total Items: {products.length}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 italic">
            No products found in your account.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="table w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th>#</th>
                <th>Preview</th>
                <th>Product Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock (Qty)</th> {/* Quantity কলাম */}
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="font-medium text-gray-400">{index + 1}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                      className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm"
                    />
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {product._id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs uppercase font-bold">
                      {product.category}
                    </span>
                  </td>
                  <td className="font-bold text-green-600 dark:text-green-400">
                    ${product.price?.toLocaleString()}
                  </td>
                  {/* Quantity প্রদর্শন */}
                  <td>
                    <div className="flex items-center gap-2">
                      <FaCubes className="text-gray-400 text-xs" />
                      <span
                        className={`font-bold ${
                          product.quantity > 0
                            ? "text-blue-600"
                            : "text-red-500"
                        }`}
                      >
                        {product.quantity || 0}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      className={`badge ${
                        product.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      } text-white font-bold p-3`}
                    >
                      {product.status}
                    </div>
                  </td>
                  <td className="flex justify-center gap-2">
                    {userRole?.toLowerCase() === "admin" ||
                    product.addedBy === user?.email ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            document.getElementById("edit_modal").showModal();
                          }}
                          className="btn btn-sm btn-circle btn-info text-white hover:scale-110 transition-transform"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-sm btn-circle btn-error text-white hover:scale-110 transition-transform"
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-400 uppercase font-bold italic">
                        Restricted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-lg rounded-2xl">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h3 className="font-bold text-xl text-gray-800">
              Edit Product Detail
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">
                <FaTimes />
              </button>
            </form>
          </div>

          {selectedProduct && (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="form-control">
                <label className="label text-sm font-bold text-gray-600 uppercase">
                  Product Name
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-sm font-bold text-gray-600 uppercase">
                    Price ($)
                  </label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={selectedProduct.price}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                {/* Quantity ইনপুট যুক্ত করা হয়েছে */}
                <div className="form-control">
                  <label className="label text-sm font-bold text-gray-600 uppercase">
                    Stock Quantity
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    defaultValue={selectedProduct.quantity || 0}
                    className="input input-bordered w-full"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-sm font-bold text-gray-600 uppercase">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={selectedProduct.category}
                  className="select select-bordered w-full"
                >
                  <option value="t-shirt">T-Shirt</option>
                  <option value="shirt">Shirt</option>
                  <option value="jacket">Jacket</option>
                  <option value="pants">Pants</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label text-sm font-bold text-gray-600 uppercase">
                  Image URL
                </label>
                <input
                  name="image"
                  type="url"
                  defaultValue={selectedProduct.image}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-bold text-gray-600 uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedProduct.description}
                  className="textarea textarea-bordered h-24"
                  required
                ></textarea>
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-success text-white w-full h-12 text-lg shadow-md"
                >
                  Update Product
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ManageProducts;
