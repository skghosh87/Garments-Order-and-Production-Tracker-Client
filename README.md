# React + Vite

# Garments Order & Production Tracker System (Client)

## 🔗 Live Site

## 📌 Project Overview

Garments Order & Production Tracker System is a web-based platform designed to help small and medium-sized garment factories manage orders, production stages, and delivery tracking efficiently. Buyers can place orders, managers can manage products and approve orders, and admins can control users and analytics.

## 🎯 Purpose

The purpose of this project is to demonstrate a full-stack production-level application with role-based authentication, secure routing, real-time order tracking, and a modern, recruiter-friendly UI.

## 🚀 Key Features

- Role-based authentication (Admin, Manager, Buyer)
- Firebase email/password & Google login
- JWT authentication with secure cookie handling
- Product listing with search & filter
- Product details page with booking/order system
- Dashboard for Admin, Manager & Buyer
- Order lifecycle tracking (Pending → Approved → Shipped)
- Dark / Light theme toggle
- Fully responsive UI
- Framer Motion animations
- Protected private routes (no redirect on reload)

## 🧩 Pages & Routes

- Home
- All Products
- Product Details (Private)
- Login / Register
- Dashboard
  - Admin: Manage Users, All Products, All Orders
  - Manager: Add Product, Manage Products, Pending Orders
  - Buyer: My Orders, Track Order, Profile
- 404 Not Found Page

## 🛠️ Technologies Used

- React
- React Router DOM
- Firebase Authentication
- Axios
- Tailwind CSS
- Framer Motion
- React Hook Form
- SweetAlert2 / React Toastify

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_apiKey=your_firebase_apiKey
VITE_authDomain=your_firebase_authDomain
VITE_projectId=your_firebase_projectId
VITE_storageBucket=your_firebase_storageBucket
VITE_messagingSenderId=your_firebase_messagingSenderId
VITE_appId=your_firebase_appId
VITE_SERVER_URL=your_server_api_url






This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```
