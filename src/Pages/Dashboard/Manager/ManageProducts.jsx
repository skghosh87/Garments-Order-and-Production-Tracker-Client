import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
  FaBoxOpen,
  FaCubes,
  FaCreditCard,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageProducts = () => {
  const { user, userRole } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  /* ================= ১. প্রোডাক্ট ডাটা ফেচ করা ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/v1/products");
      const currentRole = userRole?.toLowerCase();

      if (currentRole === "admin") {
        setProducts(res.data);
      } else {
        // আপডেট: addedBy.email দিয়ে ফিল্টার করা হচ্ছে
        const myProducts = res.data.filter(
          (product) => product.addedBy?.email === user?.email
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
            Swal.fire("Deleted!", "Product has been removed.", "success");
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
    const form = e.target;

    // ১১ নং শর্তের লজিক্যাল ভ্যালিডেশন
    if (Number(form.minOrderQty.value) > Number(form.quantity.value)) {
      return Swal.fire(
        "Warning",
        "Min order qty cannot exceed stock!",
        "warning"
      );
    }

    setUpdateLoading(true);
    const updatedData = {
      name: form.name.value,
      price: Number(form.price.value),
      quantity: Number(form.quantity.value),
      minOrderQty: Number(form.minOrderQty.value), // নতুন ফিল্ড
      category: form.category.value,
      paymentOption: form.paymentOption.value, // ম্যানেজার পেমেন্ট মুড আপডেট করতে পারবে
      description: form.description.value,
      image: form.image.value,
    };

    try {
      const res = await axiosSecure.put(
        `/api/v1/products/${selectedProduct._id}`,
        updatedData
      );

      if (res.data.modifiedCount > 0) {
        document.getElementById("edit_modal").close();
        Swal.fire("Success!", "Product updated successfully.", "success");
        fetchProducts();
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manage Inventory
        </h1>
        <div className="badge badge-success gap-2 p-4 text-white font-bold">
          Total Items: {products.length}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl dark:bg-gray-700">
          <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-300">
            No products listed yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th>Preview</th>
                <th>Product Details</th>
                <th>Stock Info</th>
                <th>Payment Mode</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td>
                    <img
                      src={product.image}
                      className="w-12 h-12 rounded-lg object-cover border"
                      alt=""
                    />
                  </td>
                  <td>
                    <div className="font-bold">{product.name}</div>
                    <div className="text-xs text-gray-400">
                      {product.category}
                    </div>
                  </td>
                  <td>
                    <div className="text-green-600 font-bold">
                      ${product.price}
                    </div>
                    <div className="text-xs flex items-center gap-1 text-gray-500">
                      <FaCubes /> Stock: {product.quantity} (Min:{" "}
                      {product.minOrderQty})
                    </div>
                  </td>
                  <td>
                    <div className="badge badge-ghost badge-sm font-medium">
                      <FaCreditCard className="mr-1" /> {product.paymentOption}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          document.getElementById("edit_modal").showModal();
                        }}
                        className="btn btn-square btn-sm btn-info btn-outline"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-square btn-sm btn-error btn-outline"
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
        <div className="modal-box max-w-2xl dark:bg-gray-800">
          <div className="flex justify-between items-center border-b pb-3 mb-5">
            <h3 className="font-bold text-xl">Update Product</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">
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
                <label className="label font-bold">Product Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label font-bold">Price ($)</label>
                <input
                  name="price"
                  type="number"
                  defaultValue={selectedProduct.price}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label font-bold">Stock Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  defaultValue={selectedProduct.quantity}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label font-bold">Min Order Qty</label>
                <input
                  name="minOrderQty"
                  type="number"
                  defaultValue={selectedProduct.minOrderQty}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label font-bold">Payment Option</label>
                <select
                  name="paymentOption"
                  defaultValue={selectedProduct.paymentOption}
                  className="select select-bordered"
                >
                  <option value="Both">Both (Stripe & COD)</option>
                  <option value="Stripe Only">Stripe Only</option>
                  <option value="COD Only">COD Only</option>
                </select>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label font-bold">Category</label>
                <input
                  name="category"
                  type="text"
                  defaultValue={selectedProduct.category}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label font-bold">Image URL</label>
                <input
                  name="image"
                  type="text"
                  defaultValue={selectedProduct.image}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label font-bold">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedProduct.description}
                  className="textarea textarea-bordered h-24"
                ></textarea>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  disabled={updateLoading}
                  type="submit"
                  className="btn btn-success text-white w-full"
                >
                  {updateLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Save Changes"
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
