import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Original main homepage components
import CarouselWithNavbar from "./components/CarouselWithNavbar";
import FeaturedHero from "./components/FeaturedHero";
import FeaturedProducts from "./components/FeaturedProducts";
import TestimonialSection from "./components/Testimony";
import SubscribeForm from "./components/SubscribeForm";
import Footer from "./components/Footer";

// Pages
import NewHome from "./pages/NewHome";
import Login from "./pages/login";
import Register from "./pages/register";
import MyAccount from "./pages/MyAccount";
import Shop from "./pages/Shop"; 
import Wishlist from "@/pages/Wishlist";
import ContactUs from "@/pages/ContactUs";
import About from "@/pages/About";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetails from "@/pages/ProductDetails";

// ADMIN IMPORTS
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import AdminProducts from "./components/admin/AdminProducts"; 
import AdminOrders from "./components/admin/AdminOrders"; 
import AdminLayout from "./components/admin/AdminLayout";
import AdminNotifications from "./components/admin/AdminNotifications";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute"; 


const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
};

// 🛡️ Admin Layout Wrapper
const AdminLayoutWrapper = () => {
  return (
    <AdminLayout>
      <Outlet /> 
    </AdminLayout>
  );
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          
          <Routes>
            {/* 🛑 SECURE ADMIN ROUTES 🛑 */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayoutWrapper />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} /> 
                <Route path="/admin/notifications" element={<AdminNotifications/>} />
              </Route>
            </Route>

            {/* 🌸 PUBLIC SHOP ROUTES */}
            <Route element={<PublicLayout />}>
              <Route
                path="/"
                element={
                  <>
                    <CarouselWithNavbar />
                    <FeaturedHero />
                    <FeaturedProducts />
                    <TestimonialSection />
                    <SubscribeForm />
                    <Footer />
                  </>
                }
              />

              <Route path="/home-new" element={<NewHome />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Route>
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;