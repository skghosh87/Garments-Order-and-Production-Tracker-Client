import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Container from "../Shared/Container";

const partners = [
  { name: "Adidas", logo: "https://i.ibb.co.com/Nggmhc0q/Adidas.png" },
  { name: "American", logo: "https://i.ibb.co.com/fdCr2vQG/American.png" },
  { name: "Chai", logo: "https://i.ibb.co.com/rK4dZfhp/chai.png" },
  { name: "Puma", logo: "https://i.ibb.co.com/BVFJsby4/Puma.png" },
  { name: "Etc", logo: "https://i.ibb.co.com/bMQ6bHLY/etc.jpg" },
  { name: "Australia", logo: "https://i.ibb.co.com/Jwv3wTst/australia.png" },
];

const LogoShowcase = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <Container>
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-green-500 uppercase tracking-[0.3em] mb-2">
            Our Trusted Partners
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase">
            Working with Industry <span className="text-green-500">Leaders</span>
          </h2>
        </div>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={15} // গ্যাপ কিছুটা কমানো হয়েছে
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="logo-swiper"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              {/* Padding কমিয়ে p-2 করা হয়েছে এবং height ঠিক রাখা হয়েছে */}
              <div className="h-28 w-full flex items-center justify-center p-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all duration-300 group overflow-hidden">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  // w-full এবং h-full ব্যবহার করা হয়েছে যেন পুরো জায়গা নেয়
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=' + partner.name }} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      <style>{`
        .logo-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default LogoShowcase;