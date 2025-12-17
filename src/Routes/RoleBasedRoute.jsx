import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

/**
 * RoleBasedRoute: ড্যাশবোর্ডের বা অন্য private route-কে নির্দিষ্ট রোলের জন্য সুরক্ষিত করে।
 * @param {Array<string>} allowedRoles - যে রোলগুলি এই রুট অ্যাক্সেস করতে পারবে (যেমন: ['admin', 'manager'])
 * @param {ReactNode} children - সুরক্ষিত কন্টেন্ট
 */
const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading, userRole, isRoleLoading, userStatus } = useAuth();
  const location = useLocation();

  // Loading spinner while auth state is being checked
  if (loading || isRoleLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
        <p className="mt-2 text-gray-500">Checking access...</p>
      </div>
    );
  }

  // Not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = userRole && allowedRoles.includes(userRole);
  const isSuspended = userStatus === "suspended";

  // Suspended user → redirect to profile to view suspend reason
  if (isSuspended) {
    toast.error("Your account is suspended. Contact admin for details.");
    return <Navigate to="/dashboard/profile" replace />;
  }

  // User has required role → show children
  if (hasRequiredRole) {
    return children;
  }

  // User role mismatch → redirect to home page
  toast.warn("Access denied for your role.");
  console.warn(
    `Access Denied for user ${user?.email}. Role: ${userRole}, Status: ${userStatus}`
  );

  return <Navigate to="/" state={{ accessDenied: true }} replace />;
};

export default RoleBasedRoute;
