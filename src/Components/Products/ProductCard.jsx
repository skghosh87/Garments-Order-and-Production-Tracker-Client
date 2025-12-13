// src/components/Products/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// যদি আপনি Framer Motion ব্যবহার করে থাকেন, তবে এটি ইম্পোর্ট করুন

// Product ডেটা prop হিসেবে পাবে
const ProductCard = ({ product }) => {
  // নিশ্চিত করুন যে ডেটা অবজেক্টে এই প্রপার্টিগুলো আছে:
  const { _id, name, shortDescription, price, imageUrl, category } = product;

  // শর্ট ডেসক্রিপশন ট্রিম করার ফাংশন
  const trimDescription = (desc, maxLength) => {
    return desc.length > maxLength
      ? desc.substring(0, maxLength) + "..."
      : desc;
  };

  return (
    // Framer Motion ব্যবহার করে একটি হালকা হোভার ইফেক্ট যোগ করা হলো
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* 1. Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || "path/to/default-image.jpg"} // ফলব্যাক ইমেজ দিন
          alt={name}
          className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {category || "Garments"}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* 2. Product Name / Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {name}
        </h3>

        {/* 3. Price */}
        <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">
          ${price ? price.toFixed(2) : "N/A"}
        </p>

        {/* 4. Short Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-sm">
          {trimDescription(shortDescription || "No description available.", 80)}
        </p>

        {/* 5. View Details Button (ইউনিফর্ম স্টাইল) */}
        <Link to={`/product-details/${_id}`} className="mt-auto">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
