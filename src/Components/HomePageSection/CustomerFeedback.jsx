import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Container from "../Shared/Container";

const reviews = [
  {
    img: "https://i.pravatar.cc/150?u=1",
    Author: "Ariful Islam",
    Designation: "Managing Director",
    company: "Rahim Textile Ltd",
    comment:
      "Their production management system has significantly increased our workflow efficiency and reduced manual errors. We can now track every single garment through the production line in real-time.",
    rating: 5,
  },
  {
    img: "https://i.pravatar.cc/150?u=2",
    Author: "Sara Hossain",
    Designation: "Production Manager",
    company: "Fashion Hub BD",
    comment:
      "The order tracking feature is outstanding! It has allowed us to provide real-time updates to our international clients, which has greatly improved our business relationships and trust.",
    rating: 4,
  },
  {
    img: "https://i.pravatar.cc/150?u=3",
    Author: "Tanvir Ahmed",
    Designation: "CEO",
    company: "Style Garments",
    comment:
      "This is the best garment management software I've used. It handles complex factory operations smoothly and the automated reporting saves our administrative team hours of work every week.",
    rating: 5,
  },
  {
    img: "https://i.pravatar.cc/150?u=4",
    Author: "Farhana Akter",
    Designation: "Operations Head",
    company: "Elite Apparels",
    comment:
      "Very user-friendly interface and the support team is always ready to help. The integration with our existing inventory system was seamless and the training provided was top-notch.",
    rating: 5,
  },
  {
    img: "https://i.pravatar.cc/150?u=5",
    Author: "Kamrul Hassan",
    Designation: "Owner",
    company: "Green Fabric",
    comment:
      "The reporting system provides deep insights that help us make quick and accurate business decisions. We've seen a 20% increase in productivity since implementing this management solution.",
    rating: 4,
  },
  {
    img: "https://i.pravatar.cc/150?u=6",
    Author: "Mitu Khandakar",
    Designation: "Chief Merchandiser",
    company: "Modern Wear",
    comment:
      "Excellent service! Our inventory management has become much easier and error-free. The system's ability to forecast raw material needs has optimized our supply chain significantly.",
    rating: 5,
  },
];

const CustomerFeedback = () => {
  return (
    <section className="py-24 bg-base-100">
      <Container>
        {/* ১. হেডিং - এখন পেজের ঠিক মাঝখানে */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-base-content uppercase tracking-widest">
            Customer <span className="text-green-500">Feedback</span>
          </h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          spaceBetween={30}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-10"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              {/* ২. কার্ড - উচ্চতা ৩৫০px এবং কন্টেন্ট সেন্টারে */}
              <div className="bg-base-200 p-8 rounded-3xl border border-base-300 h-[350px] flex flex-col items-center text-center justify-between hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-xl group">
                {/* Author Info */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      src={review.img}
                      alt={review.Author}
                      className="w-20 h-20 rounded-full object-cover border-4 border-green-500 p-1 bg-white"
                    />
                    <FaQuoteLeft className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full text-3xl shadow-lg" />
                  </div>
                  <h4 className="text-lg font-bold text-base-content">
                    {review.Author}
                  </h4>
                  <p className="text-[10px] font-bold text-green-600 uppercase italic">
                    {review.Designation} @ {review.company}
                  </p>
                </div>

                {/* Comment */}
                <div className="max-h-[80px] overflow-y-auto px-2 scrollbar-hide">
                  <p className="text-base-content/70 italic text-sm leading-relaxed">
                    “{review.comment}”
                  </p>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`text-sm ${
                        index < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ৩. নেভিগেশন বাটন - কার্ডের নিচে (ফুটার অংশে) */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button className="prev-btn p-4 rounded-full bg-base-200 hover:bg-green-500 hover:text-white transition-all shadow-md group border border-base-300">
            <FaChevronLeft className="text-xl group-active:scale-90" />
          </button>

          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>

          <button className="next-btn p-4 rounded-full bg-base-200 hover:bg-green-500 hover:text-white transition-all shadow-md group border border-base-300">
            <FaChevronRight className="text-xl group-active:scale-90" />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default CustomerFeedback;
