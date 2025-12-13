import React from "react";
import HeroBanner from "../../Components/HomePageSection/HeroBanner";
import OurProducts from "../../Components/HomePageSection/OurProducts";
import CustomerFeedback from "../../Components/HomePageSection/CustomerFeedback";
import HowItWorks from "../../Components/HomePageSection/HowItWorks";
import ExtraSection from "../../Components/HomePageSection/ExtraSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Our Products Section (Limit 6) */}
      <OurProducts />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Customer Feedback Section */}
      <CustomerFeedback />

      {/* 5. Two Extra Sections */}
      <ExtraSection sectionType="feature" />
      <ExtraSection sectionType="partners" />
    </div>
  );
};

export default HomePage;
