import React from "react";
import Container from "../Components/Shared/Container";
import {
  FaIndustry,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaCheckCircle,
  FaGlobe,
} from "react-icons/fa";

const AboutUs = () => {
  // Statistics Data
  const stats = [
    { id: 1, icon: <FaUsers />, value: "500+", label: "Active Users" },
    {
      id: 2,
      icon: <FaCheckCircle />,
      value: "10k+",
      label: "Orders Delivered",
    },
    { id: 3, icon: <FaGlobe />, value: "15+", label: "Partner Factories" },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 min-h-screen">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-green-600 mb-6 tracking-tight">
            About Garments Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            We are revolutionizing the garment industry by integrating modern
            technology into product manufacturing, order management, and
            delivery tracking. Our goal is to create a digital ecosystem where
            buyers and manufacturers can connect seamlessly with full
            transparency.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-b-4 border-green-500 hover:-translate-y-2 transition duration-300">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center rounded-full mb-6 text-green-600 dark:text-green-400 text-3xl">
              <FaIndustry />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To provide data-driven solutions in the garment sector, ensuring
              every step from production to final delivery remains transparent
              and efficient.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-b-4 border-blue-500 hover:-translate-y-2 transition duration-300">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 flex items-center justify-center rounded-full mb-6 text-blue-600 dark:text-blue-400 text-3xl">
              <FaUsers />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
              Our Team
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A dedicated team of expert developers and garment industry
              professionals working constantly to enhance the management
              experience.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-b-4 border-orange-500 hover:-translate-y-2 transition duration-300">
            <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 flex items-center justify-center rounded-full mb-6 text-orange-600 dark:text-orange-400 text-3xl">
              <FaHandshake />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
              Our Values
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Integrity, efficiency, and building long-term partnerships with
              our clients are the core driving forces behind our platform.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-green-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.id} className="space-y-3">
                <div className="text-4xl flex justify-center">{stat.icon}</div>
                <h2 className="text-4xl font-bold">{stat.value}</h2>
                <p className="text-green-100 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Why Choose Garments Tracker?
            </h2>
            <ul className="space-y-4">
              {[
                "Real-time Order Tracking for Buyers",
                "Efficient Inventory Management for Managers",
                "Secure Role-based Access Control",
                "Advanced Data Analytics for Admins",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                >
                  <FaCheckCircle className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-green-100 dark:bg-gray-800 h-64 w-full rounded-2xl flex items-center justify-center">
            <FaChartLine className="text-9xl text-green-500 opacity-20" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutUs;
