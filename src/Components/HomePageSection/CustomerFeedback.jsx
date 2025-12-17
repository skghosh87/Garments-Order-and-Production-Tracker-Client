import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Container from "../Shared/Container";

const reviews = [
  {
    name: "Rahim Textile",
    comment: "Very smooth order tracking and production management!",
  },
  {
    name: "Fashion Hub",
    comment: "Production updates are clear and delivery is always on time.",
  },
  {
    name: "Style Garments",
    comment: "Best garments management system for factories.",
  },
];

const CustomerFeedback = () => {
  return (
    <section className="py-20 bg-white">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-10">
          Customer Feedback
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          loop
          spaceBetween={20}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="bg-gray-50 p-6 rounded-xl shadow h-full">
                <p className="text-gray-600 italic">“{review.comment}”</p>
                <h4 className="mt-4 font-semibold text-green-600">
                  — {review.name}
                </h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default CustomerFeedback;
