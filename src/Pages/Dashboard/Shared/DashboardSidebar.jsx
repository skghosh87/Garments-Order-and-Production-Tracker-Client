import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  FaUserShield,
  FaProductHunt,
  FaClipboardList,
  FaUserEdit,
  FaHome,
} from "react-icons/fa";

/* ===========================
   Role Based Menu Config
=========================== */
const dashboardMenus = {
  admin: [
    {
      path: "manage-users",
      icon: <FaUserShield />,
      label: "Manage Users",
    },
    {
      path: "manage-orders",
      icon: <FaClipboardList />,
      label: "All Orders",
    },
    {
      path: "profile",
      icon: <FaUserEdit />,
      label: "My Profile",
    },
  ],

  manager: [
    {
      path: "add-product",
      icon: <FaProductHunt />,
      label: "Add Product",
    },
    {
      path: "manage-products",
      icon: <FaProductHunt />,
      label: "Manage Products",
    },
    {
      path: "pending-orders",
      icon: <FaClipboardList />,
      label: "Pending Orders",
    },
    {
      path: "approved-orders",
      icon: <FaClipboardList />,
      label: "Approved Orders",
    },
    {
      path: "profile",
      icon: <FaUserEdit />,
      label: "My Profile",
    },
  ],

  buyer: [
    {
      path: "my-orders",
      icon: <FaClipboardList />,
      label: "My Orders",
    },
    {
      path: "profile",
      icon: <FaUserEdit />,
      label: "My Profile",
    },
  ],
};

const DashboardSidebar = () => {
  const { userRole } = useAuth();

  const menus = dashboardMenus[userRole] || dashboardMenus.buyer;

  return (
    <aside className="w-64 min-h-full bg-white border-r shadow-lg">
      {/* Header */}
      <div className="py-5 border-b">
        <h2 className="text-xl font-bold text-center text-green-600">
          {userRole?.toUpperCase()} Dashboard
        </h2>
      </div>

      {/* Menu */}
      <ul className="menu p-4">
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-green-500 text-white font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        ))}

        <div className="divider"></div>

        {/* Back to Home */}
        <li>
          <NavLink
            to="/"
            className="flex items-center gap-3 p-3 text-gray-600 hover:text-green-600"
          >
            <FaHome />
            Back to Home
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
