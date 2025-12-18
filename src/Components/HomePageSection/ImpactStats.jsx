import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

// Swiper এর স্টাইলসমূহ
import "swiper/css";
import "swiper/css/free-mode";

import Container from "../Shared/Container";

const partnerLogos = [
  {
    name: "ACIMIT",
    url: "/Logo/Acimit.png",
  },
  {
    name: "Adidas",
    url: "/Logo/Adidas.png",
  },
  {
    name: "Clothing",
    url: "/Logo/Clothing.png",
  },
  {
    name: "Febric",
    url: "/Logo/Febric.jpeg",
  },
  {
    name: "Puma",
    url: "/Logo/Puma.png",
  },
  {
    name: "Inda",
    url: "/Logo/Inda.png",
  },
];

const ImpactStats = () => {
  return (
    <section className="py-20 bg-slate-900 overflow-hidden">
      <Container>
        {/* হেডিং সেকশন */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Global <span className="text-green-500">Collaboration</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base italic">
            "Trusted by leading fashion brands worldwide for precision and
            quality manufacturing."
          </p>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* লোগো কার্ড স্লাইডার */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView={2}
          spaceBetween={20}
          freeMode={true}
          loop={true}
          speed={3000} // স্লাইডিং স্পিড
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 5, spaceBetween: 40 },
          }}
          className="logo-swiper"
        >
          {partnerLogos.map((logo, index) => (
            <SwiperSlide key={index}>
              {/* লোগো কার্ড ডিজাইন */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 h-32 md:h-40 rounded-2xl flex flex-col items-center justify-center group hover:bg-white/10 transition-all duration-500 hover:border-green-500/50">
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-12 md:h-16 w-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
                />
                <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-3 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {logo.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* নিচের শ্যাডো/ফেড ইফেক্ট (ঐচ্ছিক) */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="w-12 h-1 bg-green-500/20 rounded-full"></div>
          <div className="w-24 h-1 bg-green-500 rounded-full"></div>
          <div className="w-12 h-1 bg-green-500/20 rounded-full"></div>
        </div>
      </Container>
    </section>
  );
};

export default ImpactStats;
