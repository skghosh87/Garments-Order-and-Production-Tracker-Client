import React, { useState } from "react";
import Container from "../Components/Shared/Container";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;

    const contactData = { name, email, message };

    try {
      // আপনার সার্ভারের কন্টাক্ট এপিআই কল
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/contact`,
        contactData
      );

      if (res.data.insertedId) {
        toast.success("Thank you! Your message has been sent successfully.");
        form.reset();
      }
    } catch (error) {
      console.error("Contact Error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-16 min-h-screen">
      <Container>
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
            Have any questions or need a custom order? We'd love to hear from
            you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Contact Info */}
          <div className="space-y-8 bg-green-50 dark:bg-gray-800 p-8 rounded-2xl border border-green-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Get in Touch
            </h2>

            <div className="flex items-center gap-5">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                <FaEnvelope className="text-2xl text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  support@garmentstracker.com
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                <FaPhoneAlt className="text-2xl text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  +880 1234 567 890
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                <FaMapMarkerAlt className="text-2xl text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our Office
                </p>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  Uttara, Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleContactSubmit}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder="How can we help you?"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition duration-300 shadow-lg shadow-green-200 dark:shadow-none ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </Container>
      <ToastContainer position="bottom-right" />
    </section>
  );
};

export default Contact;
