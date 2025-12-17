import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bannerImage from "../../assets/garments-production.jpg"; // আপনার ইমেজ ফাইল পাথ

const HeroBanner = () => {
  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // প্রতিটি চাইল্ড কম্পোনেন্টের মাঝে 0.3 সেকেন্ডের বিরতি
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Side: Content with Animation */}
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight mb-4"
              variants={itemVariants}
            >
              Streamline Your{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Garment Production
              </span>
              .
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              variants={itemVariants}
            >
              End-to-end order and production tracking system for small and
              medium factories. Manage inventory, stages, and delivery
              effortlessly.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link to="/all-products" className="inline-block">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                  View Products
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Image */}
          <div className="md:w-1/2 flex justify-end">
            <motion.img
              src={bannerImage}
              alt="Garment Factory Production"
              className="rounded-xl shadow-2xl object-cover w-full max-w-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
