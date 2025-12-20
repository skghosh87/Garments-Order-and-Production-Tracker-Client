import { motion } from "framer-motion";
import { FaPaperPlane, FaEnvelopeOpenText, FaUsers, FaBoxOpen, FaGlobe } from "react-icons/fa";
import Swal from "sweetalert2";
import Container from "../Shared/Container";

const stats = [
  { 
    id: 1, 
    label: "Registered Companies", 
    value: "50+", 
    icon: <FaUsers />, 
    gradient: "from-blue-600/80 to-indigo-900/90", // ব্লু গ্রেডিয়েন্ট
    bgImage: "https://images.unsplash.com/photo-1558444479-c8a027920927?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    label: "Orders Completed", 
    value: "1,200+", 
    icon: <FaBoxOpen />, 
    gradient: "from-emerald-500/80 to-teal-900/90", // গ্রিন গ্রেডিয়েন্ট
    bgImage: "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    label: "Global Reach", 
    value: "12+ Countries", 
    icon: <FaGlobe />, 
    gradient: "from-purple-600/80 to-fuchsia-900/90", // পার্পল গ্রেডিয়েন্ট
    bgImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop" 
  },
];

const StatsNewsletter = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Subscribed!",
      text: "Welcome to our community.",
      icon: "success",
      confirmButtonColor: "#22c55e",
    });
    e.target.reset();
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <Container>
        {/* মেইন হেডিং */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tight"
          >
            Growth & <span className="text-green-500">Updates</span>
          </motion.h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* কালারফুল স্ট্যাটাস কার্ডসমূহ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              whileHover={{ scale: 1.03 }}
              className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-xl group"
            >
              {/* ব্যাকগ্রাউন্ড গার্মেন্টস ইমেজ */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${stat.bgImage})` }}
              ></div>
              {/* কালারফুল গ্রেডিয়েন্ট ওভারলে */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} mix-blend-multiply group-hover:opacity-90 transition-opacity`}></div>
              <div className="absolute inset-0 bg-black/20"></div>

              {/* কন্টেন্ট */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/30 shadow-inner">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black mb-1 drop-shadow-md">{stat.value}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* আপনার পছন্দের আগের সেই নিউজলেটার ডিজাইন */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-green-500 to-emerald-700 rounded-[3rem] p-10 md:p-20 overflow-hidden shadow-2xl shadow-green-200 dark:shadow-none"
        >
          {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left text-white">
              <div className="inline-flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <FaEnvelopeOpenText className="animate-bounce" /> Stay Updated
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Don't Miss Out on <br /> Production Updates!
              </h2>
              <p className="text-emerald-50 text-lg opacity-90 max-w-md">
                Subscribe to our newsletter and get the latest insights directly in your inbox.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              <form onSubmit={handleSubscribe} className="bg-white p-3 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 w-full relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter professional email"
                    required
                    className="w-full pl-6 pr-4 py-4 rounded-2xl text-slate-800 focus:outline-none font-medium placeholder:text-gray-400"
                  />
                </div>
                <button type="submit" className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95">
                  Subscribe <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default StatsNewsletter;