import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";

/**
 * RoleBasedRoute: ড্যাশবোর্ডের ভেতরের রুটগুলিকে নির্দিষ্ট রোলের জন্য সুরক্ষিত করে।
 * @param {Array<string>} allowedRoles - যে রোলগুলি এই রুট অ্যাক্সেস করতে পারবে (যেমন: ['admin', 'manager'])
 * @param {ReactNode} children - সুরক্ষিত কন্টেন্ট
 */
const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading, userRole, isRoleLoading, userStatus } = useAuth();

  const location = useLocation();

  if (loading || isRoleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-secondary"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  const isSuspended = userStatus === "suspended";

  if (hasRequiredRole && !isSuspended) {
    return children;
  }

  console.warn(
    `Access Denied for user ${user?.email}. Role: ${userRole}, Status: ${userStatus}`
  );

  return <Navigate to="/" state={{ accessDenied: true }} replace />;
};

export default RoleBasedRoute;
