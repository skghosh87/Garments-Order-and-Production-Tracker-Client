import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import Container from "../Components/Shared/Container";
import ProductCard from "../Components/Products/ProductCard"; // প্রোডাক্ট প্রদর্শনের জন্য কাস্টম কম্পোনেন্ট

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ডেটা ফেচ করার লজিক
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // ক্লায়েন্ট সাইড থেকে সার্ভারে API কল
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/api/v1/products`
        );
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("দুঃখিত! প্রোডাক্টের ডেটা লোড করা সম্ভব হয়নি।");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // সার্চ টার্ম অনুযায়ী প্রোডাক্ট ফিল্টার করা
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] dark:bg-gray-900">
        <FaSpinner className="text-4xl text-green-500 animate-spin" />
        <span className="ml-3 text-lg dark:text-gray-300">
          প্রোডাক্ট লোড হচ্ছে...
        </span>
      </div>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <Container className="min-h-[50vh] flex items-center justify-center dark:bg-gray-900">
        <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 px-4 dark:bg-gray-900">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <MdProductionQuantityLimits className="text-green-500 text-5xl" />
          আমাদের সমস্ত প্রোডাক্ট কালেকশন
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          আপনার প্রয়োজনীয় পণ্য খুঁজে নিন।
        </p>
      </header>

      {/* সার্চ বার */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition duration-200"
        />
      </div>

      {/* প্রোডাক্ট গ্রিড */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-xl text-gray-500 dark:text-gray-400 mt-10">
          কোন প্রোডাক্ট পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default AllProductsPage;
