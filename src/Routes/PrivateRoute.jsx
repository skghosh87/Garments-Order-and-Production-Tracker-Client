import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  // AuthContext থেকে user এবং loading স্টেটগুলি অ্যাক্সেস করা
  const { user, loading } = useAuth();

  // ইউজার যে রুটটি অ্যাক্সেস করার চেষ্টা করছে তার তথ্য ক্যাপচার করা
  const location = useLocation();

  // ১. লোডিং স্টেট হ্যান্ডলিং
  if (loading) {
    // API কল চলাকালীন একটি লোডিং স্পিনার দেখানো
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        {/* অথবা একটি কাস্টম লোডার ব্যবহার করতে পারেন */}
      </div>
    );
  }

  // ২. ইউজার লগইন করে থাকলে
  if (user) {
    // চাইল্ড কম্পোনেন্টটি রেন্ডার করা (যেমন: ProductDetailsPage বা DashboardLayout)
    return children;
  }

  // ৩. ইউজার লগইন না করে থাকলে
  // তাকে '/login' রুটে রিডাইরেক্ট করা এবং বর্তমান লোকেশনটি state-এ সেভ করা
  // 'replace' prop নিশ্চিত করে যে ব্রাউজারের হিস্টরি থেকে বর্তমান এন্ট্রিটি প্রতিস্থাপিত হয়
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
