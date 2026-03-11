import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import AdminRoute from "../components/routing/AdminRoute";
import Home from "../pages/public/Home";
import Products from "../pages/public/Products";
import ProductDetails from "../pages/public/ProductDetails";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import CheckoutSuccess from "../pages/user/CheckoutSuccess";
import CheckoutCancelled from "../pages/user/CheckoutCancelled";
import OrderTracking from "../pages/user/OrderTracking";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import UserDashboard from "../pages/user/UserDashboard";
import Orders from "../pages/user/Orders";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageOrders from "../pages/admin/ManageOrders";
import ManagePayments from "../pages/admin/ManagePayments";
import ManageUsers from "../pages/admin/ManageUsers";
import AuthCallback from "../pages/public/AuthCallback";

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Route>

    {/* Admin Login - Outside layouts for full-page design */}
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancelled" element={<CheckoutCancelled />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderTracking />} />
      </Route>
    </Route>

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/payments" element={<ManagePayments />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
