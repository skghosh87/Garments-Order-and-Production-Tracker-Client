import Container from "../Shared/Container";
import { FaClipboardCheck, FaCut, FaShippingFast } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <FaClipboardCheck />,
    title: "Place Order",
    desc: "Buyer places order with required quantity and details",
  },
  {
    icon: <FaCut />,
    title: "Production",
    desc: "Cutting, sewing, finishing & quality check",
  },
  {
    icon: <FaShippingFast />,
    title: "Delivery",
    desc: "Packed and delivered on time",
  },
];

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20">
      <Container>
        {/* Section Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>

        {/* Steps */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: "0px 20px 30px rgba(0,0,0,0.12)",
              }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl text-green-600 mb-4 flex justify-center">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {step.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default HowItWorks;
