import React from "react";
import { NavLink } from "react-router-dom";

const MyLink = ({ to, className, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-white underline font-bold"
          : `${className} font-semibold`
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;
