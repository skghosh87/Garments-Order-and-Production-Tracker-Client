import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaShoppingCart,
  FaCogs,
  FaTruck,
} from "react-icons/fa";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";

import Container from "../Shared/Container";

const steps = [
  {
    id: "01",
    title: "Choose Design",
    desc: "Select from our vast catalog of premium garment designs tailored for global markets.",
    icon: <FaSearch className="text-3xl" />,
  },
  {
    id: "02",
    title: "Place Order",
    desc: "Specify quantities and customization details easily through our smart ordering portal.",
    icon: <FaShoppingCart className="text-3xl" />,
  },
  {
    id: "03",
    title: "Production",
    desc: "Our automated system tracks every stitch in real-time with full transparency.",
    icon: <FaCogs className="text-3xl" />,
  },
  {
    id: "04",
    title: "Delivery",
    desc: "Experience quick and secure global shipping with end-to-end logistics support.",
    icon: <FaTruck className="text-3xl" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <Container>
        {/* হেডিং */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tight"
          >
            How It <span className="text-green-500">Works</span>
          </motion.h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto italic">
            "Streamlining your garment manufacturing process in four simple
            steps."
          </p>
        </div>

        {/* স্লাইডার কন্টেইনার */}
        <div className="relative px-4">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              nextEl: ".step-next",
              prevEl: ".step-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-16"
          >
            {steps.map((step, index) => (
              <SwiperSlide key={index}>
                <div className="group bg-gray-50 dark:bg-slate-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 h-[380px] flex flex-col items-center text-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 relative overflow-hidden">
                  {/* ব্যাকগ্রাউন্ড নম্বর */}
                  <span className="absolute -top-4 -right-2 text-8xl font-black text-gray-200 dark:text-slate-700/30 group-hover:text-green-500/10 transition-colors">
                    {step.id}
                  </span>

                  {/* আইকন সার্কেল */}
                  <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-3xl flex items-center justify-center text-green-500 mb-8 shadow-xl group-hover:bg-green-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
                    {step.icon}
                  </div>

                  <h4 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-2">
                    {step.desc}
                  </p>

                  {/* প্রগ্রেস লাইন (নিচে) */}
                  <div className="absolute bottom-0 left-0 h-1.5 bg-green-500 w-0 group-hover:w-full transition-all duration-700"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* কাস্টম নেভিগেশন বাটন */}
          <button className="step-prev absolute top-1/2 -left-4 md:-left-8 z-10 p-4 bg-white dark:bg-slate-800 shadow-xl rounded-full text-slate-400 hover:text-green-500 transition-all">
            <FaChevronLeft />
          </button>
          <button className="step-next absolute top-1/2 -right-4 md:-right-8 z-10 p-4 bg-white dark:bg-slate-800 shadow-xl rounded-full text-slate-400 hover:text-green-500 transition-all">
            <FaChevronRight />
          </button>
        </div>
      </Container>

      {/* কাস্টম স্টাইল */}
      <style>{`
        .swiper-pagination-bullet-active {
          background: #22c55e !important;
          width: 20px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
