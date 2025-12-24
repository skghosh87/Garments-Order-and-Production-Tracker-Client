import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  // ডায়নামিক লোগো পাথ এবং নাম
  const logoPath = "/Logo-Filnal.png"; // public ফোল্ডারের জন্য সরাসরি পাথ
  const websiteName = "Garments Tracker";
  const description =
    "Simplifying garment production workflow, from order tracking to timely delivery, for small and medium factories.";

  return (
    <footer className="bg-gray-800 text-white dark:bg-gray-950 border-t border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* ১. লোগো ও বর্ণনা (Logo & Description) */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {/* ডায়নামিক লোগো ইমপ্লিমেন্টেশন */}
              <img
                src={logoPath}
                alt={`${websiteName} Logo`}
                className="h-10 w-auto object-contain"
              />
              <h3 className="text-2xl font-bold text-blue-400">
                {websiteName}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">{description}</p>

            {/* সোশ্যাল মিডিয়া লিংকস */}
            <div className="flex space-x-4">
              <a
                href="#"
                target="_blank"
                className="text-gray-400 hover:text-blue-500 transition duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                className="text-gray-400 hover:text-gray-200 transition duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                className="text-gray-400 hover:text-blue-600 transition duration-300"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* ২. দরকারী লিংকসমূহ (Useful Links) */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-blue-500/50 pb-1">
              Useful Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-products"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ৩. কুইক লিংকস (Quick Access) */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-blue-500/50 pb-1">
              Quick Access
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-blue-400 transition duration-300 text-sm"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* ৪. যোগাযোগ (Contact Info) */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-blue-500/50 pb-1">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-blue-400 flex-shrink-0" />
                <span>
                  123 Garments Hub, Production Lane, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-400 flex-shrink-0" />
                <span>+880 1721921623</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-400 flex-shrink-0" />
                <span>support@garmentstracker.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* কপিরাইট তথ্য */}
        <div className="border-t border-gray-700/50 pt-8 mt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {websiteName}. All Rights
            Reserved.
          </p>
          <p className="text-xs text-gray-200 mt-1">
            Developed By Banglasoft Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
