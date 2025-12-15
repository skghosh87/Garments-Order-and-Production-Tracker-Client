import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch All Products ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/v1/products`,
        { withCredentials: true }
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= Delete Product ================= */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_API}/api/v1/products/${id}`,
        { withCredentials: true }
      );

      Swal.fire("Deleted!", "Product has been removed.", "success");
      fetchProducts();
    } catch (err) {
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-4xl text-green-500" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    {/* Edit (Future feature) */}
                    <button className="btn btn-xs btn-info">
                      <FaEdit />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-xs btn-error"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
