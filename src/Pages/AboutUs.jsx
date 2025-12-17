import React from "react";
import Container from "../Components/Shared/Container";
import { FaIndustry, FaUsers, FaHandshake } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            About Garments Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We help garment businesses manage products, orders, and users in a
            smart and efficient way.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaIndustry className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              To digitize garment production and order tracking for better
              transparency and productivity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaUsers className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Our Team
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              A passionate team of developers and garment industry experts
              working together.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaHandshake className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Our Values
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Trust, efficiency, and long-term partnership with our clients.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutUs;
