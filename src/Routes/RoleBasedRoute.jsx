import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading, userRole, isRoleLoading, userStatus } = useAuth();
  const location = useLocation();

  const dbRole = userRole?.toLowerCase();
  const requiredRoles = allowedRoles.map((r) => r.toLowerCase());
  const hasRequiredRole = dbRole && requiredRoles.includes(dbRole);

  // সাইড ইফেক্টগুলো (Toast/Console) useEffect এর ভেতরে রাখতে হবে
  useEffect(() => {
    if (!loading && !isRoleLoading) {
      if (userStatus === "suspended") {
        toast.error("Your account is suspended!");
      } else if (user && !hasRequiredRole) {
        toast.warn("Access denied for your role.");
        console.warn(
          `Denied: ${user.email} (Role: ${userRole}, Status: ${userStatus})`
        );
      }
    }
  }, [user, userRole, userStatus, hasRequiredRole, loading, isRoleLoading]);

  // ১. লোডিং অবস্থা
  if (loading || isRoleLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
        <p className="mt-2 text-gray-500 font-bold uppercase tracking-widest text-xs">
          Verifying permissions...
        </p>
      </div>
    );
  }

  // ২. লগইন না থাকলে
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ৩. একাউন্ট সাসপেন্ডেড হলে
  if (userStatus === "suspended") {
    return <Navigate to="/" replace />;
  }

  // ৪. পারমিশন থাকলে কন্টেন্ট দেখান
  if (hasRequiredRole) {
    return children;
  }

  // ৫. পারমিশন না থাকলে হোম পেজে পাঠিয়ে দিন
  return <Navigate to="/" replace />;
};

export default RoleBasedRoute;
