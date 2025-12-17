import { Outlet } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import { FaSpinner, FaUserSlash } from "react-icons/fa";
import DashboardSidebar from "../Pages/Dashboard/Shared/DashboardSidebar";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { userStatus, loading } = useAuth();

  /* Loading State */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="text-5xl text-green-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  /* Suspended Account */
  if (userStatus === "suspended") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-6">
        <FaUserSlash className="text-6xl text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-red-700">Account Suspended</h1>
        <p className="text-center text-red-600 mt-2 max-w-md">
          Your account has been suspended by admin. Please check your profile
          for suspension reason.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Body */}
      <div className="drawer lg:drawer-open flex-grow">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* Main Content Area */}
        <div className="drawer-content p-4 md:p-6">
          {/* Mobile Menu Button */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-success btn-sm drawer-button lg:hidden mb-4 text-white"
          >
            Dashboard Menu
          </label>

          <main className="max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        {/* Sidebar Area */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

          {/* এখানেই সমস্যা ছিল। শুধু DashboardSidebar রাখলেই হবে, 
              এর নিচে আলাদাভাবে <aside> ট্যাগ দিয়ে আবার কোড করার প্রয়োজন নেই।
          */}
          <DashboardSidebar />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
