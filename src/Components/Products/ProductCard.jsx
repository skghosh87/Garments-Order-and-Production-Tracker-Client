import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  // পরিবর্তন এখানে: imageUrl এর বদলে image ব্যবহার করুন
  const { _id, name, description, price, image, category } = product;

  const trimDescription = (desc, maxLength) => {
    if (!desc) return "No description available.";
    return desc.length > maxLength
      ? desc.substring(0, maxLength) + "..."
      : desc;
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* 1. Product Image */}
      <div className="relative overflow-hidden">
        <img
          // পরিবর্তন এখানে: image ব্যবহার করা হয়েছে
          src={image || "https://i.ibb.co/2kRrFqG/default-avatar.png"}
          alt={name}
          className="w-full h-75 object-content transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {category || "Garments"}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* 2. Product Name */}
        <h3 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {name}
        </h3>

        {/* 3. Price */}
        <p className="text-3xl text-center font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">
          ${price ? Number(price).toFixed(2) : "0.00"}
        </p>

        {/* 4. Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-sm">
          {/* আপনার ডাটাবেসে হয়তো shortDescription এর বদলে description নামে আছে */}
          {trimDescription(description || product.shortDescription, 80)}
        </p>

        {/* 5. View Details Button */}
        <Link to={`/product-details/${_id}`} className="mt-auto">
          <button className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
