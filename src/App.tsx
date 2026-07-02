import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import ProtectedRoute from "./components/shared/ProtectedRoute";
// CustomerRoute import kept via existing lazy declaration below
import ScrollToTop from "./components/shared/ScrollToTop";
import ProductDetail from "./features/products/components/ProductDetails.tsx";
import { AdminAuthProvider } from "./features/auth/context/AdminAuthProvider.tsx";

import Checkout from "./features/customer/Checkout";
import { CUSTOMER_URL, STATIC_URL, isCustomerApp } from "./config/appConfig";

function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return null;
}

function ProductRedirect() {
  const { slug } = useParams();
  useEffect(() => {
    window.location.href = slug
      ? `${CUSTOMER_URL}/products/${slug}`
      : `${CUSTOMER_URL}/`;
  }, [slug]);
  return null;
}

// ── Public ────────────────────────────────────────────────────
const Products = lazy(() => import("./features/products/Products"));
const AboutUs = lazy(() => import("./features/about/AboutUs"));
const Contact = lazy(() => import("./features/contact/Contact"));
const CustomerRoute = lazy(
  () => import("../src/components/shared/CustomerRoute.tsx"),
);

// ── Customer auth pages ───────────────────────────────────────
const CustomerLogin = lazy(
  () => import("./features/customer/Customerlogin.tsx"),
);
const CustomerSignup = lazy(
  () => import("./features/customer/Customersignup.tsx"),
);

// ── Customer protected pages ──────────────────────────────────
const Profile = lazy(() => import("./features/customer/Profile.tsx"));
const Orders = lazy(() => import("./features/customer/Orders.tsx"));
const Cart = lazy(() => import("./features/customer/Cart.tsx"));

// ── Admin ─────────────────────────────────────────────────────
const AdminLogin = lazy(() => import("./features/auth/Login")); // keep existing file
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
              {isCustomerApp ? (
                <>
                  {/* ── Customer App routes ─────────────────────── */}
                  <Route path="/" element={<Products />} />
                  <Route path="/products" element={<Products />} />
                  <Route
                    path="/about_us"
                    element={
                      <ExternalRedirect url={`${STATIC_URL}/about_us`} />
                    }
                  />
                  <Route
                    path="/contact"
                    element={<ExternalRedirect url={`${STATIC_URL}/contact`} />}
                  />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/login" element={<CustomerLogin />} />
                  <Route path="/signup" element={<CustomerSignup />} />
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
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/checkout"
                    element={
                      <CustomerRoute>
                        <Checkout />
                      </CustomerRoute>
                    }
                  />
                </>
              ) : (
                <>
                  {/* ── Static App routes ───────────────────────── */}
                  <Route
                    path="/"
                    element={<ExternalRedirect url={`${CUSTOMER_URL}/`} />}
                  />
                  <Route path="/about_us" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/products"
                    element={<ExternalRedirect url={`${CUSTOMER_URL}/`} />}
                  />
                  <Route path="/products/:slug" element={<ProductRedirect />} />
                  <Route
                    path="/login"
                    element={<ExternalRedirect url={`${CUSTOMER_URL}/login`} />}
                  />
                  <Route
                    path="/signup"
                    element={
                      <ExternalRedirect url={`${CUSTOMER_URL}/signup`} />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ExternalRedirect url={`${CUSTOMER_URL}/profile`} />
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ExternalRedirect url={`${CUSTOMER_URL}/orders`} />
                    }
                  />
                  <Route
                    path="/cart"
                    element={<ExternalRedirect url={`${CUSTOMER_URL}/cart`} />}
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ExternalRedirect url={`${CUSTOMER_URL}/checkout`} />
                    }
                  />
                </>
              )}

              {/* ── Admin auth ───────────────────────────── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* ── Admin protected ──────────────────────── */}
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
