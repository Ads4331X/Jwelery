import Home from "./features/home/Home";
import Products from "./features/products/Products";
import AboutUs from "./features/about/AboutUs";
import Contact from "./features/contact/Contact";
import ScrollToTop from "./components/shared/ScrollToTop";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Login from "./features/auth/Login";
import Dashboard from "./features/admin/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
