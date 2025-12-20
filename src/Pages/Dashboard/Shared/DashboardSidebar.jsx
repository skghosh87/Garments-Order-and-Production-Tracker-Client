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
  Admin: [
    { path: "manage-users", icon: <FaUserShield />, label: "Manage Users" },
    { path: "all-orders", icon: <FaClipboardList />, label: "All Orders" },
    { path: "all-products", icon: <FaClipboardList />, label: "All Products" },
    { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
  ],
  Manager: [
    { path: "add-product", icon: <FaProductHunt />, label: "Add Product" },
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
    { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
  ],
  Buyer: [
    { path: "my-orders", icon: <FaClipboardList />, label: "My Orders" },
    { path: "track-order", icon: <FaClipboardList />, label: "Tracking Orders" },
    { path: "profile", icon: <FaUserEdit />, label: "My Profile" },
  ],
};

const DashboardSidebar = () => {
  const { userRole } = useAuth();

  // ডাটাবেসে role: "Manager" (বড় হাতের) থাকলে সেটি ক্যাপিটালাইজ করে মেনু সিলেক্ট করা
  const currentRole =
    userRole?.charAt(0).toUpperCase() + userRole?.slice(1).toLowerCase();
  const menus = dashboardMenus[currentRole] || dashboardMenus.Buyer;

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-lg flex flex-col">
      {/* Header - এখান থেকেই ড্যাশবোর্ড নাম আসছে */}
      <div className="py-6 border-b bg-green-50">
        <h2 className="text-xl font-bold text-center text-green-700 uppercase tracking-wide">
          {currentRole || "User"} Dashboard
        </h2>
      </div>

      {/* Menu List */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {menus.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-green-600 text-white shadow-md font-semibold"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="divider my-6"></div>

        {/* Home Navigation */}
        <NavLink
          to="/"
          className="flex items-center gap-3 p-3 text-gray-500 hover:text-red-500 transition-colors"
        >
          <FaHome className="text-lg" />
          <span className="font-medium">Back to Home</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
