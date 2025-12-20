import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../Shared/Container";
import ProductCard from "../Products/ProductCard";

// অ্যানিমেশন ভেরিয়েন্টস
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // আপনার ব্যাকএন্ড রুট অনুযায়ী home=true এবং limit=6 পাঠানো হচ্ছে
    axios
      .get(`${import.meta.env.VITE_SERVER_API}/api/v1/products?home=true&limit=6`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Products loading error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <Container>
        {/* সেকশন হেডার */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Our Featured <span className="text-green-600">Products</span>
          </h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-500 font-medium italic">Handpicked premium garments for your business</p>
        </motion.div>

        {/* লোডিং স্টেট */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60">
            <span className="loading loading-spinner loading-lg text-green-600"></span>
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Inventory...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* প্রোডাক্ট গ্রিড */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={cardVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* See All Products বাটন (আপনার দেওয়া অংশ) */}
            <motion.div 
              className="flex justify-center mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/all-products">
                <button className="btn btn-outline border-green-500 text-green-500 hover:bg-green-500 hover:border-green-500 px-12 rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-green-100 hover:text-white">
                  See All Products
                </button>
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest">
              No products available at the moment.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default OurProducts;