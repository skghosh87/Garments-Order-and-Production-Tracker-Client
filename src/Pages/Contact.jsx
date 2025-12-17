import React from "react";
import Container from "../Components/Shared/Container";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <Container>
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Have any questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                support@garmentstracker.com
              </span>
            </div>

            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-2xl text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                +880 1234 567 890
              </span>
            </div>

            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-2xl text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Contact;
