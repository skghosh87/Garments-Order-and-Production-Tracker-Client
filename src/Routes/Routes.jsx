import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import HomePage from "../Pages/Home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div> Page Not Found</div>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
