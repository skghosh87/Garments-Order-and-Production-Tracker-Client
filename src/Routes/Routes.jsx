import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import HomePage from "../Pages/Home/HomePage";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AllProductsPage from "../Pages/AllProductsPage";
import ProductDetailsPage from "../Pages/ProductDetailsPage";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";

import MyOrders from "../Pages/Dashboard/Buyer/MyOrders";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import AddProduct from "../Pages/Dashboard/Manager/AddProduct";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div> 404 Page Not Found</div>,
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
      // প্রাইভেট রুট ১: Product Details (লগইন করা ইউজারদের জন্য)
      {
        path: "product/:id",
        element: (
          <PrivateRoute>
            <ProductDetailsPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  // প্রাইভেট রুট ২: ড্যাশবোর্ড কাঠামো
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ক্রেতা রুটস
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      // ম্যানেজার রুটস
      {
        path: "add-product",
        element: <AddProduct />,
      },
      // অ্যাডমিন রুটস
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
    ],
  },
]);
