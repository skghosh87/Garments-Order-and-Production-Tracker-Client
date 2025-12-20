import { useEffect, useState } from "react";
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
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProducts = () => {
  const { user, userRole } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false); // আপডেটের সময় লোডিং এর জন্য

  /* ================= ১. প্রোডাক্ট ডাটা ফেচ করা ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/v1/products");
      const currentRole = userRole?.toLowerCase();

      if (currentRole === "admin") {
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

  /* ================= ২. প্রোডাক্ট ডিলিট করা ================= */
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
          const res = await axiosSecure.delete(`/api/v1/products/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Product has been removed.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            setProducts(products.filter((p) => p._id !== id));
          }
        } catch (err) {
          Swal.fire("Error", "Failed to delete product.", "error");
        }
      }
    });
  };

  /* ================= ৩. প্রোডাক্ট আপডেট করা ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const form = e.target;

    const updatedData = {
      name: form.name.value,
      price: Number(form.price.value),
      quantity: Number(form.quantity.value),
      category: form.category.value,
      description: form.description.value,
      image: form.image.value,
    };

    try {
      const res = await axiosSecure.put(
        `/api/v1/products/${selectedProduct._id}`,
        updatedData
      );

      if (res.data.modifiedCount > 0) {
        // মডাল অটো ক্লোজ করা
        document.getElementById("edit_modal").close();

        // সাকসেস মেসেজ দেখানো
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchProducts(); // টেবিল রিফ্রেশ করা
      } else {
        document.getElementById("edit_modal").close();
        Swal.fire("No Changes", "No information was modified.", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update product.", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-5xl text-green-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading Inventory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Product Management
        </h1>
        <div className="badge badge-success gap-2 p-4 text-white font-bold">
          Total Items: {products.length}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl dark:bg-gray-700">
          <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-300">No products found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th>Preview</th>
                <th>Details</th>
                <th>Price & Stock</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td>
                    <img
                      src={product.image}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                      alt={product.name}
                    />
                  </td>
                  <td>
                    <div className="font-bold dark:text-white">
                      {product.name}
                    </div>
                    <div className="text-xs opacity-50 dark:text-gray-400">
                      {product.category}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-green-600 dark:text-green-400">
                      ${product.price}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <FaCubes /> Qty: {product.quantity}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        product.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      } text-white font-bold`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          document.getElementById("edit_modal").showModal();
                        }}
                        className="btn btn-square btn-sm btn-outline btn-info hover:scale-110 transition-transform"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-square btn-sm btn-outline btn-error hover:scale-110 transition-transform"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-800">
          <div className="flex justify-between border-b pb-3 mb-5">
            <h3 className="font-bold text-xl dark:text-white">
              Update Product Information
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost dark:text-white">
                <FaTimes />
              </button>
            </form>
          </div>

          {selectedProduct && (
            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="form-control md:col-span-2">
                <label className="label font-bold text-gray-600 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="input input-bordered focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-600 dark:text-gray-300">
                  Price ($)
                </label>
                <input
                  name="price"
                  type="number"
                  defaultValue={selectedProduct.price}
                  className="input input-bordered dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-600 dark:text-gray-300">
                  Stock Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  defaultValue={selectedProduct.quantity}
                  className="input input-bordered dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-600 dark:text-gray-300">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={selectedProduct.category}
                  className="select select-bordered dark:bg-gray-700 dark:text-white"
                >
                  <option value="t-shirt">T-Shirt</option>
                  <option value="shirt">Shirt</option>
                  <option value="jacket">Jacket</option>
                  <option value="pants">Pants</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label font-bold text-gray-600 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  name="image"
                  type="text"
                  defaultValue={selectedProduct.image}
                  className="input input-bordered dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label font-bold text-gray-600 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedProduct.description}
                  className="textarea textarea-bordered h-24 dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2 mt-4">
                <button
                  disabled={updateLoading}
                  type="submit"
                  className="btn btn-success text-white w-full text-lg shadow-md"
                >
                  {updateLoading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    "Update Product"
                  )}
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
