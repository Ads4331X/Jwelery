import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ScrollToTop from "./components/shared/ScrollToTop";
import ProductDetail from "./features/products/components/ProductDetails.tsx";
import { AdminAuthProvider } from "./features/auth/context/AdminAuthProvider.tsx";
import Checkout from "./features/customer/Checkout";

// ── Public ────────────────────────────────────────────────────
const Products = lazy(() => import("./features/products/Products"));
const AboutUs = lazy(() => import("./features/about/AboutUs"));
const Contact = lazy(() => import("./features/contact/Contact"));
const CustomerRoute = lazy(
  () => import("./components/shared/CustomerRoute.tsx"),
);

// ── Customer auth pages ───────────────────────────────────────
const CustomerLogin = lazy(
  () => import("./features/customer/Customerlogin.tsx"),
);
const CustomerSignup = lazy(
  () => import("./features/customer/Customersignup.tsx"),
);
const CustomerForgotPassword = lazy(
  () => import("./features/customer/ForgotPassword"),
);

// ── Customer protected pages ──────────────────────────────────
const Profile = lazy(() => import("./features/customer/Profile.tsx"));
const Orders = lazy(() => import("./features/customer/Orders.tsx"));
const Cart = lazy(() => import("./features/customer/Cart.tsx"));

/* ── Admin ───────────────────────────────────────────────────── */
const AdminLogin = lazy(() => import("./features/auth/Login")); // keep existing file
const AdminForgotPassword = lazy(
  () => import("./features/auth/AdminForgotPassword"),
);
const Dashboard = lazy(() => import("./features/admin/Dashboard"));

function App() {
  return (
    // AuthProvider — customer session via own backend API; admin uses separate flow
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <iframe name="hidden-google-iframe" style={{ display: "none" }} />
          <Suspense fallback={null}>
            <Routes>
              {/* ── Public ─────────────────────────────────── */}
              <Route path="/" element={<Products />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/about_us" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />

              {/* ── Customer auth ──────────────────────────── */}
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/signup" element={<CustomerSignup />} />
              <Route
                path="/forgot-password"
                element={<CustomerForgotPassword />}
              />
              <Route path="/cart" element={<Cart />} />

              {/* ── Customer protected ─────────────────────── */}
              <Route
                path="/profile"
                element={
                  <CustomerRoute>
                    <Profile />
                  </CustomerRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <CustomerRoute>
                    <Orders />
                  </CustomerRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <CustomerRoute>
                    <Checkout />
                  </CustomerRoute>
                }
              />

              {/* ── Admin auth ──────────────────────────────── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/forgot-password"
                element={<AdminForgotPassword />}
              />
              {/* ── Admin protected ─────────────────────────── */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
