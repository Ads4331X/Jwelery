import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ScrollToTop from "./components/shared/ScrollToTop";

const Home = lazy(() => import("./features/home/Home"));
const Products = lazy(() => import("./features/products/Products"));
const AboutUs = lazy(() => import("./features/about/AboutUs"));
const Contact = lazy(() => import("./features/contact/Contact"));
const Login = lazy(() => import("./features/auth/Login"));
const Dashboard = lazy(() => import("./features/admin/Dashboard"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <iframe name="hidden-google-iframe" style={{ display: "none" }} />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about_us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
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
    </AuthProvider>
  );
}

export default App;
