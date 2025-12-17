import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import HomePage from "../Pages/Home/HomePage";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AllProductsPage from "../Pages/AllProductsPage";
import ProductDetailsPage from "../Pages/ProductDetailsPage";
import DashboardLayout from "../Layouts/DashboardLayout";
import RoleBasedRoute from "./RoleBasedRoute";
import NotFound from "../Pages/NotFound";

// ড্যাশবোর্ড পেজ ইম্পোর্ট
import MyOrders from "../Pages/Dashboard/Buyer/MyOrders";
// import TrackOrder from "../Pages/Dashboard/Buyer/TrackOrder";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
// import AdminAllProducts from "../Pages/Dashboard/Admin/AdminAllProducts"; // Admin All Products
import AllOrders from "../Pages/Dashboard/Admin/AllOrders"; // Admin All Orders
import AddProduct from "../Pages/Dashboard/Manager/AddProduct";
import ManageProducts from "../Pages/Dashboard/Manager/ManageProducts";
import PendingOrders from "../Pages/Dashboard/Manager/PendingOrders";
import ApprovedOrders from "../Pages/Dashboard/Manager/ApprovedOrders";
import AboutUs from "../Pages/AboutUs";
import Contact from "../Pages/Contact";
// import Profile from "../Pages/Dashboard/Shared/Profile"; // Shared Profile Page

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "all-products",
        element: <AllProductsPage />,
      },
      // প্রোডাক্ট ডিটেইলস পেজ (Private Route): শুধু লগইন করা ইউজারদের জন্য
      {
        path: "product/:id",
        // Admin, Manager, Buyer - সকলেই প্রোডাক্ট দেখতে পারবে।
        element: (
          <RoleBasedRoute allowedRoles={["admin", "manager", "buyer"]}>
            <ProductDetailsPage />
          </RoleBasedRoute>
        ),
      },
      // About Us এবং Contact রুটগুলি যোগ করতে পারেন (যদি থাকে)
      { path: "about-us", element: <AboutUs /> },
      { path: "contact", element: <Contact /> },
    ],
  },

  // ড্যাশবোর্ড রুট কাঠামো
  {
    path: "/dashboard",
    // ড্যাশবোর্ডের মূল লেআউটে প্রবেশ করতে হলে যে কোনো একটি বৈধ রোল থাকতে হবে
    element: (
      <RoleBasedRoute allowedRoles={["admin", "manager", "buyer"]}>
        <DashboardLayout />
      </RoleBasedRoute>
    ),
    children: [
      // --- ১. বাইয়ার (Buyer) রুটস (Role: buyer) ---
      {
        path: "my-orders",
        element: (
          <RoleBasedRoute allowedRoles={["buyer"]}>
            {" "}
            <MyOrders />{" "}
          </RoleBasedRoute>
        ),
      },
      // {
      //   path: "track-order",
      //   element: (
      //     <RoleBasedRoute allowedRoles={["buyer"]}>
      //       {" "}
      //       <TrackOrder />{" "}
      //     </RoleBasedRoute>
      //   ),
      // },
      // // --- ২. ম্যানেজার (Manager) রুটস (Role: manager) ---
      {
        path: "add-product",
        element: (
          <RoleBasedRoute allowedRoles={["manager"]}>
            {" "}
            <AddProduct />{" "}
          </RoleBasedRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <RoleBasedRoute allowedRoles={["manager"]}>
            {" "}
            <ManageProducts />{" "}
          </RoleBasedRoute>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <RoleBasedRoute allowedRoles={["manager"]}>
            {" "}
            <PendingOrders />{" "}
          </RoleBasedRoute>
        ),
      },
      {
        path: "approved-orders",
        element: (
          <RoleBasedRoute allowedRoles={["manager"]}>
            {" "}
            <ApprovedOrders />{" "}
          </RoleBasedRoute>
        ),
      },
      // // --- ৩. অ্যাডমিন (Admin) রুটস (Role: admin) ---
      {
        path: "manage-users",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            {" "}
            <ManageUsers />{" "}
          </RoleBasedRoute>
        ),
      },
      // {
      //   path: "all-products", // ড্যাশবোর্ড/all-products (Admin-এর জন্য)
      //   element: (
      //     <RoleBasedRoute allowedRoles={["admin"]}>
      //       {" "}
      //       <AdminAllProducts />{" "}
      //     </RoleBasedRoute>
      //   ),
      // },
      {
        path: "all-orders", // ড্যাশবোর্ড/all-orders (Admin-এর জন্য)
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            {" "}
            <AllOrders />{" "}
          </RoleBasedRoute>
        ),
      },
      // // --- ৪. শেয়ার্ড প্রোফাইল রুট (সকলের জন্য) ---
      // {
      //   // /dashboard/profile
      //   path: "profile",
      //   element: (
      //     <RoleBasedRoute allowedRoles={["admin", "manager", "buyer"]}>
      //       {" "}
      //       <Profile />{" "}
      //     </RoleBasedRoute>
      //   ),
      // },
    ],
  },

  // তবে চাইলে ওয়াইল্ডকার্ড ব্যবহার করা যেত:
  { path: "*", element: <NotFound /> },
]);
