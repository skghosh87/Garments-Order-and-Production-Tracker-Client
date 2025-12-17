import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading, userRole, isRoleLoading, userStatus } = useAuth();
  const location = useLocation();

  // লোডিং স্পিনার
  if (loading || isRoleLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
        <p className="mt-2 text-gray-500">Verifying permissions...</p>
      </div>
    );
  }

  // লগইন না থাকলে
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // রোল চেক (Case-insensitive)
  const dbRole = userRole?.toLowerCase();
  const requiredRoles = allowedRoles.map((r) => r.toLowerCase());
  const hasRequiredRole = dbRole && requiredRoles.includes(dbRole);

  // একাউন্ট স্ট্যাটাস চেক
  if (userStatus === "suspended") {
    toast.error("Your account is suspended!");
    return <Navigate to="/" replace />;
  }

  // পারমিশন থাকলে কন্টেন্ট দেখান
  if (hasRequiredRole) {
    return children;
  }

  // পারমিশন না থাকলে
  toast.warn("Access denied for your role.");
  console.warn(
    `Denied: ${user.email} (Role: ${userRole}, Status: ${userStatus})`
  );
  return <Navigate to="/" replace />;
};

export default RoleBasedRoute;
