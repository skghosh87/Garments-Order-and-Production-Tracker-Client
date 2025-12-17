import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageProducts = () => {
  const { user, userRole } = useAuth(); // ইউজার এবং রোল গেট করা হলো
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = import.meta.env.VITE_SERVER_API;

  /* ================= Fetch All Products with Filtering ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/products`, {
        withCredentials: true,
      });

      // লজিক: অ্যাডমিন হলে সব দেখাবে, না হলে শুধু নিজের ইমেইলের প্রোডাক্ট ফিল্টার করবে
      if (userRole === "admin") {
        setProducts(res.data);
      } else {
        const myProducts = res.data.filter(
          (product) => product.addedBy === user?.email
        );
        setProducts(myProducts);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ইউজার ডাটা লোড হওয়ার পর ফেচ শুরু হবে
    if (user?.email || userRole) {
      fetchProducts();
    }
  }, [user?.email, userRole]);

  /* ================= Delete Product ================= */
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
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
    const updatedData = {
      name: form.name.value,
      price: Number(form.price.value),
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
        fetchProducts();
      } else {
        Swal.fire("No Changes", "No information was modified.", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update product.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          <p className="text-sm text-gray-500">
            {userRole === "admin" ? "Viewing all items" : "Viewing your items"}
          </p>
        </div>
        <p className="text-sm text-gray-500 font-medium">
          Total: {products.length}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 italic">
          No products found for your account.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                    />
                  </td>
                  <td className="font-medium text-gray-700">{product.name}</td>
                  <td>
                    <span className="badge badge-ghost capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="font-semibold text-green-600">
                    ${product.price}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        product.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      } text-white border-none`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="flex justify-center gap-3">
                    {/* সিকিউরিটি চেক: শুধু মালিক বা অ্যাডমিন এডিট/ডিলিট করতে পারবে */}
                    {userRole === "admin" || product.addedBy === user?.email ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            document.getElementById("edit_modal").showModal();
                          }}
                          className="btn btn-sm btn-circle btn-info text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-sm btn-circle btn-error text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        View Only
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
        <div className="modal-box max-w-lg">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="font-bold text-lg">Update Product Info</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost focus:outline-none">
                <FaTimes />
              </button>
            </form>
          </div>

          {selectedProduct && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label font-semibold">Product Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label font-semibold">Image URL</label>
                <input
                  name="image"
                  type="url"
                  defaultValue={selectedProduct.image}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-semibold">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={selectedProduct.price}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Category</label>
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
              </div>

              <div className="form-control">
                <label className="label font-semibold">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedProduct.description}
                  className="textarea textarea-bordered h-24"
                  required
                ></textarea>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="submit"
                  className="btn btn-success text-white w-full shadow-lg cursor-pointer"
                >
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

export default ManageProducts;
