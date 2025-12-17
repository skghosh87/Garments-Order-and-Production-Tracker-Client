import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
    <section className="py-20 bg-base-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content uppercase tracking-wider">
            Customer Feedback
          </h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          spaceBetween={25}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              {/* কার্ডের উচ্চতা কমিয়ে h-[350px] করা হয়েছে */}
              <div className="bg-base-200 p-6 rounded-2xl shadow-sm border border-base-300 h-[350px] flex flex-col hover:shadow-lg transition-all duration-300 group">
                {/* প্রোফাইল অংশ */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.img}
                    alt={review.Author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <h4 className="text-md font-bold text-base-content leading-tight">
                      {review.Author}
                    </h4>
                    <p className="text-[10px] font-medium text-base-content/50 uppercase">
                      {review.Designation}
                    </p>
                  </div>
                </div>

                {/* কোম্পানি এবং রেটিং */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md">
                    {review.company}
                  </span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className="text-sm">
                        {index < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* বর্ধিত কমেন্ট - লাইন ক্ল্যাম্প ব্যবহার করা হয়েছে যাতে টেক্সট বেশি হলেও ডিজাইন না ভাঙে */}
                <p className="text-base-content/70 italic leading-relaxed text-sm overflow-hidden display-webkit-box webkit-line-clamp-5 webkit-box-orient-vertical">
                  “{review.comment}”
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default CustomerFeedback;
