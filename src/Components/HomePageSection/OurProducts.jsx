import { useEffect, useState } from "react";
import axios from "axios";
import Container from "../Shared/Container";
import ProductCard from "../Products/ProductCard";
import { motion } from "framer-motion";

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

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_SERVER_API}/api/v1/products?home=true&limit=6`
      )
      .then((res) => setProducts(res.data));
  }, []);

  return (
    <section className="py-20 bg-white">
      <Container>
        <motion.h2
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Featured Products
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
      </Container>
    </section>
  );
};

export default OurProducts;
