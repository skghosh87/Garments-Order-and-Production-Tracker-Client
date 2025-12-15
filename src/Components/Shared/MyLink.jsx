import React from "react";
import { NavLink } from "react-router-dom";

const MyLink = ({ to, className, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          : `${className} font-semibold`
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;
