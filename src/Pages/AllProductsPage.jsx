import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaSearch } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import Container from "../Components/Shared/Container";
import ProductCard from "../Components/Products/ProductCard";

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/api/v1/products`
        );
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Oops! Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter logic for search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading State UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="text-5xl text-green-500 animate-spin mx-auto" />
          <p className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-300">
            Loading our collection...
          </p>
        </div>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <Container className="min-h-[60vh] flex items-center justify-center dark:bg-gray-900">
        <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-xl">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 px-4 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-4">
          <MdProductionQuantityLimits className="text-green-600" />
          Explore All Products
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Discover high-quality garments tailored to your needs. Find everything
          from fabric to finished products.
        </p>
      </header>

      {/* Search Bar Section */}
      <div className="flex justify-center mb-12">
        <div className="relative w-full max-w-2xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:text-white transition duration-300 text-lg"
          />
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">
            No products found matching "{searchTerm}"
          </h3>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-green-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default AllProductsPage;
